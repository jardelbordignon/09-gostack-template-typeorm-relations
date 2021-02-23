import { Entity, Column, OneToMany } from 'typeorm';

import Defaults from '@shared/infra/typeorm/entities/Defaults';

import OrdersProducts from '@modules/orders/infra/typeorm/entities/OrdersProducts';

@Entity('products')
export default class Product extends Defaults {
  @Column()
  name: string;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  price: number;

  @Column('integer')
  quantity: number;

  @OneToMany(() => OrdersProducts, order => order.product)
  order_products: OrdersProducts[];
}
