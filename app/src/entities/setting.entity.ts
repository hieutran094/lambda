import { Column, CreateDateColumn, Entity, UpdateDateColumn, PrimaryColumn } from 'typeorm'
@Entity('settings')
export class SettingEntity {
  @PrimaryColumn('int', { name: 'site_id' })
  site_id: number

  @Column('varchar', { name: 'admin_email', nullable: true, length: 255 })
  admin_email: string | null

  @Column('varchar', { name: 'admin_tel', nullable: true, length: 100 })
  admin_tel: string | null

  @Column('varchar', { name: 'site_title', nullable: true, length: 255 })
  site_title: string | null

  @Column('text', { name: 'site_description', nullable: true })
  site_description: string | null

  @Column('varchar', { name: 'site_keywords', nullable: true, length: 255 })
  site_keywords: string | null

  @Column('varchar', { name: 'top_page_title', nullable: true, length: 255 })
  top_page_title

  @Column('tinyint', { name: 'topics_limit_flag', width: 1, default: 0 })
  topics_limit_flag: string

  @Column('int', { name: 'topics_limit_num', default: 0 })
  topics_limit_num: string

  @Column('tinyint', { name: 'topics_limit_order', width: 1, default: 0 })
  topics_limit_order: string

  @Column('tinyint', { name: 'attention_limit_flag', width: 1, default: 0 })
  attention_limit_flag: string

  @Column('int', { name: 'attention_limit_num', default: 0 })
  attention_limit_num: string

  @Column('tinyint', { name: 'attention_limit_order', width: 1, default: 0 })
  attention_limit_order: string

  @Column('tinyint', { name: 'recommend_limit_flag', width: 1, default: 0 })
  recommend_limit_flag: string

  @Column('int', { name: 'recommend_limit_num', default: 0 })
  recommend_limit_num: string

  @Column('tinyint', { name: 'recommend_limit_order', width: 1, default: 0 })
  recommend_limit_order: string

  @Column('int', { name: 'mngt_job_display_num', default: 20 })
  mngt_job_display_num: string

  @Column('int', { name: 'mngt_entry_display_num', default: 10 })
  mngt_entry_display_num: string

  @Column('int', { name: 'search_display_num', default: 0 })
  search_display_num: string

  @Column('tinyint', { name: 'search_order_type', width: 1, default: 0 })
  search_order_type: string

  @Column('int', { name: 'logo_image_id', nullable: true })
  logo_image_id: number | null

  @Column('int', { name: 'banner_header_image_id', nullable: true })
  banner_header_image_id: number | null

  @Column('int', { name: 'favicon_image_id', nullable: true })
  favicon_image_id: number | null

  @Column('varchar', { name: 'banner_header_url', nullable: true, length: 255 })
  banner_header_url: string | null

  @Column('tinyint', { name: 'target_flag', nullable: true })
  target_flag: number

  @Column('varchar', { name: 'top_search_text', nullable: true, length: 255 })
  top_search_text: string | null

  @Column('varchar', { name: 'top_marquee', nullable: true, length: 255 })
  top_marquee: string | null

  @Column('varchar', {
    name: 'text_keyword_search',
    nullable: true,
    length: 255,
  })
  text_keyword_search: string | null

  @Column('varchar', { name: 'text_topic', nullable: true, length: 255 })
  text_topic: string | null

  @Column('varchar', {
    name: 'text_featured_work',
    nullable: true,
    length: 255,
  })
  text_featured_work: string | null

  @Column('int', { name: 'recruit_info_notice', nullable: true })
  recruit_info_notice: string

  @Column('varchar', { name: 'gtag_id', nullable: true })
  gtag_id: string | null

  @Column('int', { name: 'ogp_image_id', nullable: true })
  ogp_image_id: number | null

  @Column('varchar', { name: 'fb_app_id', length: 255, nullable: true })
  fb_app_id: string

  @Column('tinyint', { name: 'url_department_flag', default: 0 })
  url_department_flag: number

  @Column('tinyint', {
    name: 'external_entry_form_url_flag',
    width: 1,
    default: 0,
  })
  external_entry_form_url_flag: number

  @Column('tinyint', { name: 'attention_job_date_flag', width: 1, default: 1 })
  attention_job_date_flag: number

  @Column('tinyint', { name: 'indeed_flag', width: 1, default: 1 })
  indeed_flag: number

  @Column('text', { name: 'free_search_placeholder', nullable: true })
  free_search_placeholder: string | null

  @Column('tinyint', { name: 'send_mail_indeed_entry', width: 1, default: 0 })
  send_mail_indeed_entry: number

  @Column('tinyint', { name: 'teamz_job_json_data', width: 1, default: 0 })
  teamz_job_json_data: number

  @Column('tinyint', { name: 'recruitment_process', width: 1, default: 1 })
  recruitment_process: number

  @Column('tinyint', { name: 'recruitment_analysis', width: 1, default: 1 })
  recruitment_analysis: number

  @Column('tinyint', { name: 'job_channel', width: 1, default: 1 })
  job_channel: number

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', nullable: true })
  created_at: Date

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', nullable: true })
  updated_at: Date
}
