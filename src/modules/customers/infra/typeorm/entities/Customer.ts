import { Entity, Column } from 'typeorm';

import Defaults from '@shared/infra/typeorm/entities/Defaults';

@Entity('customers')
export default class Customer extends Defaults {
  @Column()
  name: string;

  @Column()
  email: string;
}
