import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../model/base.entity';

@Entity({ name: 'contact' })
export class ContactEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 300, nullable:false })
  name: string;

  @Column({ type: 'varchar', length: 300, nullable:false })
  address: string;

  @Column({ type: 'varchar', length: 300, unique:true, nullable:false })
  email: string;

  @Column({ type: 'varchar', length: 300, nullable:false })
  phone: string;

  @Column({type: 'varchar', nullable: false })
  avatar?: string;
}