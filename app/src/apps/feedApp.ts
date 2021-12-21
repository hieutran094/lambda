import { ApiGatewayEvent } from '../common/apiGateway/apiGatewayEvent'
import { ApiGatewayResponse } from '../common/apiGateway/apiGatewayResponse'
import { LambdaApp } from './lambdaApp'
import { Connection, QueryRunner, In } from 'typeorm'
import { JobEntity } from '../entities/job.entity'
import { MeritEntity } from '../entities/merit.entity'
import { SettingEntity } from '../entities/setting.entity'
import { JobDescriptionEntity } from '../entities/jobDescription.entity'
import { JobGoogleDataEntity } from '../entities/jobGoogleData.entity'
import { CompanyEntity } from '../entities/company.entity'
import { FormEntity } from '../entities/form.entity'
import { PanelService } from '../services/panelService'
import { EPrivateFlag } from '../enum/privateFlag.enum'
import { EPrefecture } from '../enum/EPrefecture.enum'
import * as moment from 'moment'
import 'moment-timezone'
import { groupBy, keyBy } from 'lodash'
import * as querystring from 'querystring'

interface JobMerit {
  job_id: number
  merit_id: number
}

export class FeedApp implements LambdaApp {
  conn: Connection
  site: any

  constructor(connection: Connection) {
    this.conn = connection
  }

  async run(event: ApiGatewayEvent): Promise<ApiGatewayResponse> {
    const domain = event.headers.Domain || event.headers.domain
    const baseUrl = event.headers.Origin || event.headers.origin
    try {
      const panelService = new PanelService()
      this.site = await panelService.getSiteInfo(domain)
      const startDate = moment('23:59:59', 'HH:mm:ss').tz('Asia/Tokyo', true).toISOString()
      const endDate = moment('00:00:00', 'HH:mm:ss').tz('Asia/Tokyo', true).toISOString()
      const jobs: JobEntity[] = await this.conn
        .createQueryBuilder()
        .addSelect('job')
        .from(JobEntity, 'job')
        .leftJoinAndSelect('job.eye_catch_image', 'eye_catch_image')
        .leftJoinAndSelect('job.eye_catch_image1', 'eye_catch_image1')
        .leftJoinAndSelect('job.eye_catch_image2', 'eye_catch_image2')
        .leftJoinAndSelect('job.creator', 'creator')
        .where('job.private_flag = :private_flag', { private_flag: EPrivateFlag.public })
        .andWhere('job.delete_flag = :delete_flag', { delete_flag: 0 })
        .andWhere('job.site_id = :siteId', { siteId: this.site.id })
        .andWhere('job.start_date IS NULL OR job.start_date <= :startDate', { startDate })
        .andWhere('job.end_date IS NULL OR job.end_date >= :endDate', { endDate })
        .orderBy('job.updated_at', 'DESC')
        .getMany()

      let feed = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"
          xmlns:content="http://purl.org/rss/1.0/modules/content/"
          xmlns:wfw="http://wellformedweb.org/CommentAPI/"
          xmlns:dc="http://purl.org/dc/elements/1.1/"
          xmlns:atom="http://www.w3.org/2005/Atom"
          xmlns:sy="http://purl.org/rss/1.0/modules/syndication/"
          xmlns:slash="http://purl.org/rss/1.0/modules/slash/"
          ><channel>`

      const settings = await this.conn.getRepository(SettingEntity).findOne({ where: { site_id: this.site.id } })
      feed +=
        '<title>' +
        settings.site_title.replace(/&/g, '&amp;') +
        '</title>' +
        '<atom:link href="' +
        `${baseUrl}/feed` +
        '" rel="self" type="application/rss+xml" />' +
        '<link>' +
        baseUrl +
        '</link>' +
        '<lastBuildDate>' +
        moment().utc().format('ddd, DD MMM YYYY HH:mm:ss ZZ') +
        '</lastBuildDate>' +
        '<language>ja</language>' +
        '<sy:updatePeriod>hourly</sy:updatePeriod>' +
        '<sy:updateFrequency>1</sy:updateFrequency>' +
        '<generator>toremasse 3.0</generator>'

      const entryForm = await this.getEntryForm()
      const entryFormUpdatedAt = entryForm.form_items.length > 0 ? moment(entryForm.form_items[0].updated_at).format('YMMDDHHmmss') : ''

      const jobInternalIds = jobs.map((job) => job.internal_id)
      if (jobInternalIds.length > 0) {
        //merit
        const jobMerits: JobMerit[] = await this.queryRunner(`SELECT job_id, merit_id FROM job_merits WHERE job_id in (${jobInternalIds.toString()})`)
        const jobMeritsGroupBy = groupBy(jobMerits, 'job_id')
        const meritIds = [...new Set(jobMerits.map((item) => item.merit_id))]
        if (meritIds.length > 0) {
          const merits = await this.conn.getRepository(MeritEntity).find({ where: { id: In(meritIds) } })
          const meritsKeyBy = keyBy(merits, 'id')
          for (const job of jobs) {
            const jobMs = jobMeritsGroupBy[job.internal_id]
            if (jobMs) {
              job.merits = []
              for (const jobM of jobMs) {
                job.merits.push(meritsKeyBy[jobM.merit_id])
                job.merit_ids.push(jobM.merit_id)
              }
            }
          }
        }

        //job_description
        const jobDescriptions = await this.conn.getRepository(JobDescriptionEntity).find({ where: { job_id: In(jobInternalIds) } })
        const jobDescriptionsKeyBy = keyBy(jobDescriptions, 'job_id')
        for (const job of jobs) {
          const jobDesc = jobDescriptionsKeyBy[job.internal_id]
          if (jobDesc) job.job_description = jobDesc
        }

        //job_google_data
        const jobGoogleDatas = await this.conn.getRepository(JobGoogleDataEntity).find({ where: { job_id: In(jobInternalIds) } })
        const jobGoogleDatasKeyBy = keyBy(jobGoogleDatas, 'job_id')
        for (const job of jobs) {
          const jobGoogleData = jobGoogleDatasKeyBy[job.internal_id]
          if (jobGoogleData) job.job_google_data = jobGoogleData
        }

        //company
        const companys = await this.conn.getRepository(CompanyEntity).find({ where: { job_id: In(jobInternalIds) } })
        const companysKeyBy = keyBy(companys, 'job_id')
        for (const job of jobs) {
          const company = companysKeyBy[job.internal_id]
          if (company) job.company = company
        }
      }

      // const jobsArray = Object.values(jobs)
      jobs.forEach((item) => {
        const [workState, workCity] = this.getJobAddress(item.job_description?.workplace || '')
        const imgUrl = item.eye_catch_image?.source || ''
        const imgUrl1 = item.eye_catch_image1?.source || ''
        const imgUrl2 = item.eye_catch_image2?.source || ''
        const link = `${baseUrl}/job/detail/${item.id}`
        const indeedPostUrl = `${baseUrl}/indeed/entry`
        const indeedQuestionsUrl = `${baseUrl}/indeed/questions.json?${entryFormUpdatedAt}`
        const publicDate = moment(item.public_date || item.created_at)
          .utc()
          .format('ddd, DD MMM YYYY HH:mm:ss ZZ')
        let workDescription = '<b>タイトル:</b><br>'
        workDescription += item.job_name + '<br><br>'
        if (item.merits && item.merits.length > 0) {
          let meritStr = ''
          for (const merit of item.merits) {
            meritStr += merit.name + '　'
          }
          workDescription += '<b>このお仕事の特徴:</b><br>' + meritStr + '<br><br>'
        }
        if (item.job_description) {
          if (item.job_description.office_name) workDescription += '<b>勤務先名:</b><br>' + item.job_description.office_name + '<br><br>'
          if (item.job_description.occupation) workDescription += '<b>職種:</b><br>' + item.job_description.occupation + '<br><br>'
          if (item.job_description.description) workDescription += '<b>仕事内容:</b><br> ' + item.job_description.description + '<br><br>'
          if (item.job_description.workplace) workDescription += '<b>勤務地:</b><br>' + item.job_description.workplace + '<br><br>'
          if (item.job_description.traffic) workDescription += '<b>交通手段（車通勤可など）:</b><br>' + item.job_description.traffic + '<br><br>'
          if (item.job_description.salary) workDescription += '<b>給与:</b><br>' + item.job_description.salary + '<br><br>'
          if (item.job_description.office_hours) workDescription += '<b>勤務時間:</b><br>' + item.job_description.office_hours + '<br><br>'
          if (item.job_description.period) workDescription += '<b>就労期間:</b><br>' + item.job_description.period + '<br><br>'
          if (item.job_description.qualification) workDescription += '<b>応募資格:</b><br>' + item.job_description.qualification + '<br><br>'
          if (item.job_description.employment_system) workDescription += '<b>雇用形態:</b><br>' + item.job_description.employment_system + '<br><br>'
          if (item.job_description.service) workDescription += '<b>待遇:</b><br>' + item.job_description.service + '<br><br>'
          if (item.job_description.holiday) workDescription += '<b>休日休暇:</b><br>' + item.job_description.holiday + '<br><br>'
          if (item.job_description.method) workDescription += '<b>応募方法:</b><br>' + item.job_description.method + '<br><br>'
          if (item.job_description.flow) workDescription += '<b>応募の流れ:</b><br>' + item.job_description.flow + '<br><br>'
          if (item.job_description.interview_place) workDescription += '<b>面接地:</b><br>' + item.job_description.interview_place + '<br><br>'
          if (item.job_description.reception_staff) workDescription += '<b>受付担当者:</b><br>' + item.job_description.reception_staff + '<br><br>'
          if (item.job_description.reception_tel)
            workDescription += '<b>応募受付先電話番号:</b><br>' + item.job_description.reception_tel + '<br><br>'
        }
        if (item.company) {
          if (item.company.company_name) workDescription += '<b>企業名:</b><br>' + item.company.company_name + '<br><br>'
          if (item.company.address) workDescription += '<b>住所:</b><br>' + item.company.address + '<br><br>'
          if (item.company.tel) workDescription += '<b>電話番号（代表）:</b><br>' + item.company.tel + '<br><br>'
          if (item.company.business) workDescription += '<b>事業内容:</b><br>' + item.company.business + '<br><br>'
          if (item.company.hp) workDescription += '<b>会社HP:</b><br>' + item.company.hp + '<br><br>'
          if (item.company.foundation) workDescription += '<b>設立:</b><br>' + item.company.foundation + '<br><br>'
          if (item.company.sales) workDescription += '<b>企業のセールスポイント:</b><br>' + item.company.sales + '<br><br>'
          if (item.company.capital) workDescription += '<b>資本金:</b><br>' + item.company.capital + '<br><br>'
          if (item.company.proceeds) workDescription += '<b>売上高:</b><br>' + item.company.proceeds + '<br><br>'
          if (item.company.employee) workDescription += '<b>従業員数:</b><br>' + item.company.employee
        }
        const indeedApplyData = {
          'indeed-apply-apiToken': process.env.INDEED_API_TOKEN,
          'indeed-apply-jobUrl': link,
          'indeed-apply-jobId': item.id,
          'indeed-apply-jobTitle': item.job_name,
          'indeed-apply-jobCompanyName': item.company?.company_name || '',
          'indeed-apply-jobLocation': item.job_description?.workplace || '',
          'indeed-apply-locale': 'ja',
          'indeed-apply-postUrl': indeedPostUrl,
          'indeed-apply-phone': 'hidden',
          'indeed-apply-coverletter': 'hidden',
          'indeed-apply-resume': 'hidden',
          'indeed-apply-questions': indeedQuestionsUrl,
          'indeed-apply-jobMeta': `${baseUrl}`,
        }

        feed += `<item>
              <title><![CDATA[${item.job_description?.occupation || ''}]]></title>
              <link>${link}</link>
              <pubDate>${publicDate}</pubDate>
              <dc:creator><![CDATA[${item.creator?.id || ''}]]></dc:creator>
    
              <guid isPermaLink="false">${link}</guid>
              <content:encoded><![CDATA[]]></content:encoded>
              <postid><![CDATA[${item.id}]]></postid>
                <company><![CDATA[${item.job_description?.office_name || item.company?.company_name || ''}]]></company>
                <city><![CDATA[${workCity}]]></city>
                <country><![CDATA[JP]]></country>
                <state><![CDATA[${workState}]]></state>
                <description><![CDATA[${workDescription}]]></description>
                <salary><![CDATA[${item.job_description?.salary || ''}]]></salary>
                <jobtype><![CDATA[${item.job_description?.employment_system || ''}]]></jobtype>
                <category><![CDATA[${item.job_description?.occupation || ''}]]></category>
                <station><![CDATA[${item.job_description?.near_station || ''}]]></station>
                <imageUrls>
                ${imgUrl ? imgUrl : ''}
                ${imgUrl && imgUrl1 ? ',' : ''}
                ${imgUrl1 ? imgUrl1 : ''}
                ${(imgUrl && imgUrl2) || (imgUrl1 && imgUrl2) ? ',' : ''}
                ${imgUrl2 ? imgUrl2 : ''}
                </imageUrls>
                ${settings.indeed_flag ? `<indeed-apply-data><![CDATA[${querystring.stringify(indeedApplyData)}]]></indeed-apply-data>` : ''}
            </item>
            `
      })
      feed += `</channel>
        </rss>`
      return {
        statusCode: 200,
        body: feed,
      }
    } catch (err: any) {
      console.log(err.message)
      return {
        statusCode: 500,
        body: {
          event,
          err,
        },
      }
    }
  }

  public async queryRunner(query: string): Promise<any> {
    const queryRunner: QueryRunner = this.conn.createQueryRunner()
    await queryRunner.connect() // performs connection
    const data = await queryRunner.query(query)
    await queryRunner.release() // release connection
    return data
  }

  private async getEntryForm(): Promise<FormEntity> {
    const formRepository = this.conn.getRepository(FormEntity)
    return await formRepository
      .createQueryBuilder('forms')
      .leftJoinAndSelect('forms.form_items', 'form_items', 'form_items.delete_flag = :deleteFlag', { deleteFlag: 0 })
      .where('forms.site_id = :site_id', { site_id: this.site.id })
      .andWhere('forms.entry_form_flag = :entryFormFlag', { entryFormFlag: 1 })
      .andWhere('forms.delete_flag = :deleteFlag', { deleteFlag: 0 })
      .getOne()
  }

  getJobAddress(address) {
    let workState = ''
    let workCity = address

    EPrefecture.forEach((e) => {
      const patt = new RegExp(`^${e.name}`, 'g')
      if (patt.test(address)) {
        workState = e.name
        workCity = address.replace(workState, '')
      }
    })
    return [workState, workCity]
  }
}
