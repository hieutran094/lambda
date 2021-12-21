import { Column, Entity, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn, Index, AfterLoad } from 'typeorm'
import { FormItemEntity } from './formItem.entity'

@Entity('forms')
@Index(['site_id', 'id'], { unique: true })
export class FormEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'internal_id' })
  internal_id: number

  @Column('int', { name: 'site_id', nullable: false })
  site_id: number

  @Column('int', { name: 'id', nullable: false, default: 0 })
  id: number

  @Column('varchar', { name: 'main_title', nullable: true, length: 255 })
  main_title: string | null

  @Column('varchar', { name: 'complete_url', nullable: true, length: 255 })
  complete_url: string | null

  @Column('varchar', { name: 'email', nullable: true, length: 255 })
  email: string | null

  @Column('varchar', { name: 'subject', nullable: true, length: 255 })
  subject: string | null

  @Column('text', { name: 'content', nullable: true })
  content: string | null

  @Column('varchar', { name: 'admin_subject', nullable: true, length: 255 })
  admin_subject: string | null

  @Column('int', { name: 'entry_form_flag' })
  entry_form_flag: number

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', nullable: true })
  created_at: Date

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', nullable: true })
  updated_at: Date

  @Column('tinyint', { name: 'delete_flag', width: 1, default: 0 })
  delete_flag: number

  @OneToMany(
    () => FormItemEntity,

    (form_items) => form_items.form,
    { cascade: true, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
  )
  form_items: FormItemEntity[]

  @AfterLoad()
  setFormId() {
    if (this.form_items) {
      this.form_items.map((item) => {
        item.form_id = this.id
      })
    }
  }
}
