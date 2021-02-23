import { Entity, Column, JoinColumn, ManyToOne } from 'typeorm';

import Defaults from '@shared/infra/typeorm/entities/Defaults';

import Order from '@modules/orders/infra/typeorm/entities/Order';
import Product from '@modules/products/infra/typeorm/entities/Product';

@Entity('orders_products')
export default class OrdersProducts extends Defaults {
  @ManyToOne(() => Order)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column()
  product_id: string;

  @Column()
  order_id: string;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  price: number;

  @Column('integer')
  quantity: number;
}
