import { Request, Response } from 'express';

import { container } from 'tsyringe';

import CreateOrderService from '@modules/orders/services/CreateOrderService';
import FindOrderService from '@modules/orders/services/FindOrderService';

export default class OrdersController {
  public async show(request: Request, response: Response): Promise<Response> {
    /** Pegamos o 'id' do 'request.params' */
    const { id } = request.params;

    /** Instanciamos a 'service' 'FindOrderService' */
    const findOrder = container.resolve(FindOrderService);

    /** Buscamos pelo pedio, passando o 'id' */
    const order = await findOrder.execute({
      id,
    });

    /** Retornamos a 'order' */
    return response.json(order);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    /** Pegamos as informações de 'customer_id' e 'products' do 'request.body' */
    const { customer_id, products } = request.body;

    /** Instanciamos nosso 'service' 'CreateOrderService' */
    const createOrder = container.resolve(CreateOrderService);

    /** Cria o pedido 'customer', passando o customer_id e o 'produdcts' */
    const customer = await createOrder.execute({
      customer_id,
      products,
    });

    /** Retornamos 'customer' */
    return response.json(customer);
  }
}
