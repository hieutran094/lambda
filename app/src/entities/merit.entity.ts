import { Column, CreateDateColumn, Entity, ManyToMany, UpdateDateColumn, PrimaryColumn } from 'typeorm'
import { JobEntity } from './job.entity'

@Entity('merits')
export class MeritEntity {
  @PrimaryColumn({ type: 'int', name: 'id' })
  id: number

  @Column('text', { name: 'name', nullable: false })
  name: string | null

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', nullable: true })
  created_at: Date

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', nullable: true })
  updated_at: Date

  @Column('tinyint', { name: 'delete_flag', width: 1, default: 0 })
  delete_flag: number

  @ManyToMany(() => JobEntity, (JobEntity) => JobEntity.merits)
  jobs: JobEntity[]
}
