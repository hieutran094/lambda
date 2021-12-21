import { AfterLoad, Column, CreateDateColumn, Entity, Index, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { JobEntity } from './job.entity'

@Entity('job_descriptions')
export class JobDescriptionEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'internal_id' })
  internal_id: number

  @Column('int', { name: 'site_id', nullable: false })
  @Index()
  site_id: number

  @Column('int', { name: 'id', nullable: true })
  id: number

  @Column('int', { name: 'job_id' })
  job_id: number

  @Column('varchar', { name: 'job_no', nullable: true, length: 100 })
  job_no: string | null

  @Column('varchar', { name: 'office_name', nullable: true, length: 255 })
  office_name: string | null

  @Column('varchar', { name: 'occupation', nullable: true, length: 255 })
  occupation: string | null

  @Column('text', { name: 'description', nullable: true })
  description: string | null

  @Column('varchar', { name: 'workplace', nullable: true, length: 255 })
  workplace: string | null

  @Column('varchar', { name: 'map', nullable: true, length: 45 })
  map: string | null

  @Column('text', { name: 'traffic', nullable: true })
  traffic: string | null

  @Column('text', { name: 'near_station', nullable: true })
  near_station: string | null

  @Column('text', { name: 'salary', nullable: true })
  salary: string | null

  @Column('text', { name: 'office_hours', nullable: true })
  office_hours: string | null

  @Column('text', { name: 'period', nullable: true })
  period: string | null

  @Column('text', { name: 'qualification', nullable: true })
  qualification: string | null

  @Column('text', { name: 'employment_system', nullable: true })
  employment_system: string | null

  @Column('text', { name: 'service', nullable: true })
  service: string | null

  @Column('text', { name: 'holiday', nullable: true })
  holiday: string | null

  @Column('text', { name: 'method', nullable: true })
  method: string | null

  @Column('text', { name: 'flow', nullable: true })
  flow: string | null

  @Column('text', { name: 'interview_place', nullable: true })
  interview_place: string | null

  @Column('varchar', { name: 'reception_staff', nullable: true, length: 255 })
  reception_staff: string | null

  @Column('varchar', { name: 'reception_tel', nullable: true, length: 255 })
  reception_tel: string | null

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', nullable: true })
  created_at: Date

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', nullable: true })
  updated_at: Date

  @Column('tinyint', { name: 'delete_flag', width: 1, default: 0 })
  delete_flag: number

  @OneToOne(() => JobEntity, { onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  @JoinColumn({ name: 'job_id' })
  job: JobEntity

  @AfterLoad()
  setJobId() {
    if (this.job) this.job_id = this.job.id
  }
}
