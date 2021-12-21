import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn, Index, AfterLoad } from 'typeorm'
import { JobEntity } from './job.entity'

@Entity('jobs_google_datas')
export class JobGoogleDataEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'internal_id' })
  internal_id: number

  @Column('int', { name: 'site_id', nullable: false })
  @Index()
  site_id: number

  @Column('int', { name: 'id', nullable: true })
  id: number

  @Column('int', { name: 'job_id' })
  job_id: number

  @Column('varchar', { name: 'quantitative_unit', nullable: true, length: 100 })
  quantitative_unit: string | null

  @Column('varchar', {
    name: 'quantitative_value',
    nullable: true,
    length: 100,
  })
  quantitative_value: number | null

  @Column('varchar', {
    name: 'quantitative_min_value',
    nullable: true,
    length: 100,
  })
  quantitative_min_value: number | null

  @Column('varchar', {
    name: 'quantitative_max_value',
    nullable: true,
    length: 100,
  })
  quantitative_max_value: number | null

  @Column('varchar', { name: 'employment_type', nullable: true, length: 100 })
  employment_type: string | null

  @Column('varchar', { name: 'location_postal', nullable: true, length: 100 })
  location_postal: string | null

  @Column('varchar', { name: 'location_pref', nullable: true, length: 100 })
  location_pref: number | null

  @Column('varchar', { name: 'location_locality', nullable: true, length: 255 })
  location_locality: string | null

  @Column('varchar', { name: 'location_address', nullable: true, length: 255 })
  location_address: string | null

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
