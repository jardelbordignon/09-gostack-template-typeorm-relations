import { Entity, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

import Defaults from '@shared/infra/typeorm/entities/Defaults';

import Customer from '@modules/customers/infra/typeorm/entities/Customer';
import OrdersProducts from '@modules/orders/infra/typeorm/entities/OrdersProducts';

@Entity('orders')
export default class Order extends Defaults {
  @ManyToOne(() => Customer, { eager: true })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @OneToMany(() => OrdersProducts, orderProduct => orderProduct.order, {
    cascade: true,
    eager: true,
  })
  order_products: OrdersProducts[];
}
