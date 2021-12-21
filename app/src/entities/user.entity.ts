import { Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { JobEntity } from './job.entity'

@Entity('users')
@Index(['site_id', 'id'], { unique: true })
@Index(['site_id', 'email'])
export class UserEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'internal_id' })
  internal_id: number

  @Column('int', { name: 'site_id', nullable: false })
  site_id: number

  @Column('int', { name: 'id', nullable: false, default: 0 })
  id: number

  @Column('varchar', { name: 'email', nullable: true, length: 255 })
  email: string | null

  @Column('varchar', { name: 'user_name', nullable: true, length: 255 })
  user_name: string | null

  @Column('varchar', {
    name: 'password',
    length: 255,
    nullable: false,
  })
  password: string | null

  @Column('int', { name: 'department_id', nullable: true })
  department_id: number | null

  @Column('tinyint', { name: 'role', default: 2, nullable: true })
  role: number | null

  @Column('timestamp', { name: 'last_login', nullable: true })
  last_login: Date | null

  @Column('varchar', {
    name: 'reset_password_token',
    nullable: true,
    length: 255,
  })
  reset_password_token: string | null

  @Column('timestamp', { name: 'reset_password_sent_at', nullable: true })
  reset_password_sent_at: string | null

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', nullable: true })
  created_at: Date

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', nullable: true })
  updated_at: Date

  @Column('tinyint', { name: 'delete_flag', width: 1, default: 0 })
  delete_flag: boolean

  @OneToMany(() => JobEntity, (jobs) => jobs.creator, { cascade: true })
  jobs: JobEntity[]
}
