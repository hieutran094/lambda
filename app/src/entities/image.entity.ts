import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, AfterLoad, OneToMany, Index } from 'typeorm'
import { JobEntity } from './job.entity'

@Entity('images')
@Index(['site_id', 'id'], { unique: true })
export class ImageEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'internal_id' })
  internal_id: number

  @Column('int', { name: 'site_id', nullable: false })
  site_id: number

  @Column('int', { name: 'id', nullable: false, default: 0 })
  id: number

  @Column('varchar', { name: 'title', nullable: true, length: 255 })
  title: string | null

  @Column('varchar', { name: 'source', length: 255 })
  source: string | null

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', nullable: true })
  created_at: Date

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', nullable: true })
  updated_at: Date

  @Column('tinyint', { name: 'delete_flag', width: 1, default: 0 })
  delete_flag: boolean

  @OneToMany(() => JobEntity, (job_eye_catch_image) => job_eye_catch_image.eye_catch_image)
  job_eye_catch_image: JobEntity[]

  @OneToMany(() => JobEntity, (job_eye_catch_image1) => job_eye_catch_image1.eye_catch_image1)
  job_eye_catch_image1: JobEntity[]

  @OneToMany(() => JobEntity, (job_eye_catch_image2) => job_eye_catch_image2.eye_catch_image2)
  job_eye_catch_image2: JobEntity[]

  @AfterLoad()
  getSource_Url() {
    const s3Source = process.env.IMAGE_ENDPOINT + '/' + this.source
    this.source = this.source ? s3Source : 'https://i.picsum.photos/id/1021/500/300.jpg'
  }
}
