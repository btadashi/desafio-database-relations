import { inject, injectable } from 'tsyringe';

import Order from '../infra/typeorm/entities/Order';
import IOrdersRepository from '../repositories/IOrdersRepository';

interface IRequest {
  id: string;
}

@injectable()
class FindOrderService {
  /** Dentro do constructor, damos um 'inject' para cada um dos repositórios */
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,
  ) {}

  public async execute({ id }: IRequest): Promise<Order | undefined> {
    /** Buscamos pela 'order', usando o método 'findById' de dentro do 'ordersRepository' */
    const order = await this.ordersRepository.findById(id);

    /** Retornamos a 'order' encontrada */
    return order;
  }
}

export default FindOrderService;
