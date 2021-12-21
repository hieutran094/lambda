import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  AfterLoad,
  Index,
} from 'typeorm'
import { CompanyEntity } from './company.entity'
import { JobDescriptionEntity } from './jobDescription.entity'
import { JobGoogleDataEntity } from './jobGoogleData.entity'
import { UserEntity } from './user.entity'
import { ImageEntity } from './image.entity'
import { MeritEntity } from './merit.entity'

@Entity('jobs')
@Index(['site_id', 'id'], { unique: true })
export class JobEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'internal_id' })
  internal_id: number

  @Column('int', { name: 'site_id', nullable: false })
  site_id: number

  @Column('int', { name: 'id', nullable: false, default: 0 })
  id: number

  @Column('int', { name: 'creator_id' })
  creator_id: number

  @Column('varchar', { name: 'admin_title', nullable: true, length: 255 })
  admin_title: string | null

  @Column('varchar', { name: 'contact_email', nullable: true, length: 255 })
  contact_email: string | null

  @Column('text', { name: 'job_name', nullable: true })
  job_name: string | null

  @Column('int', { name: 'eye_catch_image_id', nullable: true })
  eye_catch_image_id: number | null

  @Column('int', { name: 'eye_catch_image_id1', nullable: true })
  eye_catch_image_id1: number | null

  @Column('int', { name: 'eye_catch_image_id2', nullable: true })
  eye_catch_image_id2: number | null

  @Column('varchar', { name: 'main_image', nullable: true, length: 255 })
  main_image: string | null

  @Column('timestamp', { name: 'start_date', nullable: true })
  @Index()
  start_date: Date | null

  @Column('timestamp', { name: 'end_date', nullable: true })
  @Index()
  end_date: Date | null

  @Column('timestamp', { name: 'public_date', nullable: true })
  public_date: Date | null

  @Column('varchar', { name: 'keywords', nullable: true, length: 255 })
  keywords: string | null

  @Column('text', { name: 'description', nullable: true })
  description: string | null

  @Column('varchar', { name: 'youtube_url', nullable: true, length: 255 })
  youtube_url: string | null

  @Column('varchar', {
    name: 'external_entry_form_url',
    nullable: true,
    length: 255,
  })
  external_entry_form_url: string | null

  @Column('tinyint', { name: 'top_flag', nullable: true })
  top_flag: number | null

  @Column('tinyint', { name: 'topics_flag', nullable: true })
  topics_flag: number | null

  @Column('tinyint', { name: 'sidebar_flag', nullable: true })
  sidebar_flag: number | null

  @Column('tinyint', { name: 'private_flag', width: 1, default: 0 })
  @Index()
  private_flag: number

  @Column('varchar', { name: 'income_example', nullable: true, length: 255 })
  income_example: string | null

  @Column('varchar', { name: 'overview', nullable: true, length: 255 })
  overview: string | null

  @Column('varchar', { name: 'profile', nullable: true, length: 255 })
  profile: string | null

  @Column('text', { name: 'memo', nullable: true })
  memo: string | null

  @Column('varchar', { name: 'office_id', nullable: true })
  office_id: string | null

  @Column('varchar', { name: 'agent_id', nullable: true })
  agent_id: string | null

  department_ids: number[] | null

  category_ids: number[] | null

  merit_ids: number[] | null

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', nullable: true })
  created_at: Date

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', nullable: true })
  updated_at: Date

  @Column('tinyint', { name: 'delete_flag', width: 1, default: 0 })
  @Index()
  delete_flag: number

  // relationship
  @ManyToOne(() => ImageEntity, {
    cascade: true,
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'eye_catch_image_id' })
  eye_catch_image: ImageEntity

  @ManyToOne(() => ImageEntity, {
    cascade: true,
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'eye_catch_image_id1' })
  eye_catch_image1: ImageEntity

  @ManyToOne(() => ImageEntity, {
    cascade: true,
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'eye_catch_image_id2' })
  eye_catch_image2: ImageEntity

  @ManyToOne(() => UserEntity, { onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  @JoinColumn({ name: 'creator_id' })
  creator: UserEntity

  @OneToOne(() => JobGoogleDataEntity, (job_google_data) => job_google_data.job, { cascade: true, onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  job_google_data: JobGoogleDataEntity

  @OneToOne(() => JobDescriptionEntity, (job_description) => job_description.job, { cascade: true, onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  job_description: JobDescriptionEntity

  @OneToOne(() => CompanyEntity, (company) => company.job, {
    cascade: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  company: CompanyEntity

  @ManyToMany(() => MeritEntity, (MeritEntity) => MeritEntity.jobs)
  @JoinTable({
    name: 'job_merits',
    joinColumn: {
      name: 'job_id',
    },
    inverseJoinColumn: {
      name: 'merit_id',
    },
  })
  merits: MeritEntity[]

  @AfterLoad()
  setEyeCatchImageId() {
    if (this.eye_catch_image) this.eye_catch_image_id = this.eye_catch_image.id
    else delete this.eye_catch_image_id
    if (this.eye_catch_image1) this.eye_catch_image_id1 = this.eye_catch_image1.id
    else delete this.eye_catch_image_id1
    if (this.eye_catch_image2) this.eye_catch_image_id2 = this.eye_catch_image2.id
    else delete this.eye_catch_image_id2
  }

  @AfterLoad()
  setCreatorId() {
    if (this.creator) this.creator_id = this.creator.id
    else delete this.creator_id
  }

  @AfterLoad()
  setMeritIds() {
    this.merit_ids = []
    if (this.merits && this.merits.length > 0) {
      this.merit_ids = this.merits.map((e) => e.id)
    }
  }
}
