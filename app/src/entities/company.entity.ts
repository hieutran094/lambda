import { AfterLoad, Column, CreateDateColumn, Entity, Index, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { JobEntity } from './job.entity'

@Entity('companies')
export class CompanyEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'internal_id' })
  internal_id: number

  @Column('int', { name: 'site_id', nullable: false })
  @Index()
  site_id: number

  @Column('int', { name: 'id', nullable: true })
  id: number

  @Column('int', { name: 'job_id', nullable: true })
  job_id: number | null

  @Column('varchar', { name: 'company_name', nullable: true, length: 255 })
  company_name: string | null

  @Column('varchar', { name: 'address', nullable: true, length: 255 })
  address: string | null

  @Column('varchar', { name: 'tel', nullable: true, length: 45 })
  tel: string | null

  @Column('text', { name: 'business', nullable: true })
  business: string | null

  @Column('varchar', { name: 'hp', nullable: true, length: 255 })
  hp: string | null

  @Column('text', { name: 'sales', nullable: true })
  sales: string | null

  @Column('varchar', { name: 'foundation', nullable: true, length: 255 })
  foundation: string | null

  @Column('varchar', { name: 'capital', nullable: true, length: 255 })
  capital: string | null

  @Column('varchar', { name: 'proceeds', nullable: true, length: 255 })
  proceeds: string | null

  @Column('varchar', { name: 'employee', nullable: true, length: 255 })
  employee: string | null

  @Column('text', { name: 'registration_num', nullable: true })
  registration_num: string | null

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
