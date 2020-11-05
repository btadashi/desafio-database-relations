import { getRepository, Repository } from 'typeorm';

import IOrdersRepository from '@modules/orders/repositories/IOrdersRepository';
import ICreateOrderDTO from '@modules/orders/dtos/ICreateOrderDTO';
import Order from '../entities/Order';

class OrdersRepository implements IOrdersRepository {
  private ormRepository: Repository<Order>;

  constructor() {
    this.ormRepository = getRepository(Order);
  }

  public async create({ customer, products }: ICreateOrderDTO): Promise<Order> {
    /** Criamos a 'order' através do método 'create' de dentro do 'typeorm', passando 'customer' e 'products' */
    /** Como na nosssa 'entitie' temos apenas 'order_products' e nao 'products', saberemos que 'order_products' na
     * verdade são os 'products' */
    const order = await this.ormRepository.create({
      customer,
      order_products: products,
    });

    /** Salvamos a 'order' no banco de dados */
    await this.ormRepository.save(order);

    /** Retornamos a 'order' */
    return order;
  }

  public async findById(id: string): Promise<Order | undefined> {
    /** Buscamos pela 'order' usndo o método 'findOne' do 'typeorm', passando como parâmetro o 'id' e também
     * um objeto 'relations', com as informações de 'order_products' e 'customer' */
    const order = await this.ormRepository.findOne(id, {
      relations: ['order_products', 'customer'],
    });

    /** Retornamos a 'order' */
    return order;
  }
}

export default OrdersRepository;
