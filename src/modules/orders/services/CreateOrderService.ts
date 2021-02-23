import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import Order from '../infra/typeorm/entities/Order';
import IOrdersRepository from '../repositories/IOrdersRepository';

interface IProduct {
  id: string;
  quantity: number;
}

interface IProductWithAvailableQuantity extends IProduct {
  available: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

@injectable()
export default class CreateOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,

    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,

    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  /**
   * @param customer_id - string
   * @param products - Array<{id: number, quantity: number}>
   */
  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    const customer = await this.customersRepository.findById(customer_id);

    if (!customer) {
      throw new AppError('Customer does not exists.');
    }

    const existentProducts = await this.productsRepository.findAllById(
      products,
    );

    if (!existentProducts.length) {
      throw new AppError('Could not find any products with the given ids');
    }

    // compare if there are ids whose products do not exist in the database
    const existentProductsIds = existentProducts.map(product => product.id);

    const checkInexistentProducts = products.filter(
      product => !existentProductsIds.includes(product.id),
    );

    if (checkInexistentProducts.length) {
      const msg =
        checkInexistentProducts.length > 1
          ? `products ${checkInexistentProducts.map(prod => `${prod.id}, `)}`
          : `product ${checkInexistentProducts[0].id}`;

      throw new AppError(`Could not find ${msg}`);
    }

    // get array [product.id, product.quantity] of products with no quantity available
    const findProductsWithNoQuantityAvailable = products.reduce(
      (list, product) => {
        const currentProduct = existentProducts.find(
          prod => prod.id === product.id,
        );

        if (currentProduct && currentProduct.quantity < product.quantity) {
          list.push({
            id: product.id,
            quantity: product.quantity,
            available: currentProduct.quantity,
          });
        }

        return list;
      },
      [] as IProductWithAvailableQuantity[],
    );

    if (findProductsWithNoQuantityAvailable.length) {
      const errorMessage = findProductsWithNoQuantityAvailable.reduce(
        (msg, product) =>
          (msg += `You ordered ${product.quantity} products with id ${product.id} but only have ${product.available} available. `),
        '',
      );

      throw new AppError(errorMessage);
    }

    const serializedOrderProducts = products.map(product => ({
      product_id: product.id,
      quantity: product.quantity,
      price: existentProducts.filter(p => p.id === product.id)[0].price,
    }));

    const order = await this.ordersRepository.create({
      customer,
      products: serializedOrderProducts,
    });

    const orderedProductsQuantity = order.order_products.map(product => ({
      id: product.product_id,
      quantity:
        existentProducts.filter(p => p.id === product.product_id)[0].quantity -
        product.quantity,
    }));

    await this.productsRepository.updateQuantity(orderedProductsQuantity);

    return order;
  }
}
