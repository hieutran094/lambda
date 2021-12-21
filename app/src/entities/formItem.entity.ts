import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, Index, AfterLoad } from 'typeorm'
import { FormEntity } from './form.entity'

@Entity('form_items')
@Index(['site_id', 'id'], { unique: true })
export class FormItemEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'internal_id' })
  internal_id: number

  @Column('int', { name: 'site_id', nullable: false })
  site_id: number

  @Column('int', { name: 'id', nullable: false, default: 0 })
  id: number

  @Column('int', { name: 'form_id', nullable: true })
  form_id: number

  @Column('varchar', { name: 'title', nullable: true, length: 255 })
  title: string | null

  @Column('varchar', { name: 'name', nullable: true, length: 45 })
  name: string | null

  @Column('int', { name: 'type', nullable: true })
  type: number

  @Column('text', { name: 'placeholder', nullable: true })
  placeholder: string | null

  @Column('text', { name: 'annotation', nullable: true })
  annotation: string | null

  @Column('text', { name: 'options', nullable: true })
  options: string | null

  @Column('text', { name: 'ats_type', nullable: true })
  ats_type: string | null

  @Column('tinyint', { name: 'required_flag', default: 0 })
  required_flag: number

  @Column('tinyint', { name: 'name_flag' })
  name_flag: number

  @Column('tinyint', { name: 'email_flag' })
  email_flag: number

  @Column('int', { name: 'display_order' })
  display_order: number

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', nullable: true })
  created_at: Date

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', nullable: true })
  updated_at: Date

  @Column('tinyint', { name: 'delete_flag', width: 1, default: 0 })
  delete_flag: number

  @ManyToOne(() => FormEntity, { onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  @JoinColumn({ name: 'form_id' })
  form: FormEntity

  @AfterLoad()
  setFormId() {
    if (this.form) this.form_id = this.form.id
    else delete this.form_id
  }
}
