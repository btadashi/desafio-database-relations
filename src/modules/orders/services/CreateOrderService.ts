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

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

@injectable()
class CreateOrderService {
  /** Damos um 'inject' para cada um dos repositórios de dentro do 'constructor' */
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    /** Primeiramente, verificamos se o 'customer' já existe */
    const customerExists = await this.customersRepository.findById(customer_id);

    /** Se o 'customer' não existir, então disparamos um erro */
    if (!customerExists) {
      throw new AppError('Could not find any customer with the given id');
    }

    /** Verificamos os produtos existentes, usando o método 'findAllbyId' do repositório de 'products', passando
     * dentro dela 'products', que é uma array de 'id'. */
    const existentProducts = await this.productsRepository.findAllById(
      products,
    );

    /** Se o comprimento da array não existir, ou seja, se minha array estiver vazia, então disparamos um erro */
    if (!existentProducts.length) {
      throw new AppError('Could nt find any products with given id');
    }

    /** Mapeamos todos os 'id' dos produtos que tenho na lista de produtos existentes */
    const existentProductsIds = existentProducts.map(product => product.id);

    /** Comparamos a array de produtos do banco de dados com os produtos que estamos recebendo como parâmetro
     * para encontrar os produtos inexistentes */
    const checkInexistentProducts = products.filter(
      product => !existentProductsIds.includes(product.id),
    );

    /** Se o comprimento da array existir, então disparamos um erro */
    if (checkInexistentProducts.length) {
      throw new AppError(
        `Could not find product ${checkInexistentProducts[0].id}`,
      );
    }

    /** Fazemos um filtro dos produtos existentes para verificar se há algum produto com quantidade inválida  */
    const findProductsWithNoQuantityAvailable = products.filter(
      product =>
        existentProducts.filter(p => p.id === product.id)[0].quantity <
        product.quantity,
    );

    /** Se tiver alguma coisa dentro de 'findProductsWithNoQuantityAvailable', ou seja, um produto inválido, então disparamos um erro */
    if (findProductsWithNoQuantityAvailable.length) {
      throw new AppError(
        `The quantity ${findProductsWithNoQuantityAvailable[0].quantity} is not available for ${findProductsWithNoQuantityAvailable[0].id}`,
      );
    }

    /** Formatamos os produtos da forma que precisamos inserir dentro do banco de dados */
    /** Fazemos um mapeamento dentro de 'products' que estamos recebendo e para cada 'product' retornamos
     * um objeto contendo o 'id' a 'quantinty' e o 'price'. Para o caso do 'price', fazemo um filtro dentro
     * dos produtos existentes para buscar o valor com o mesmo 'id' que recebemos. Então pegamos o 'price'
     * do primeiro produto que o filter me retornar, que seria o da posição 0. */
    const serializedProducts = products.map(product => ({
      product_id: product.id,
      quantity: product.quantity,
      price: existentProducts.filter(p => p.id === product.id)[0].price,
    }));

    /** Criamos a 'order' usando o método 'create' de dentro do 'ordersRepository, passando a informação já validada de 'customer'
     * e os produtos já formatados */
    const order = await this.ordersRepository.create({
      customer: customerExists,
      products: serializedProducts,
    });

    /** Pegamos a 'order_products' de dentro de 'order' */
    const { order_products } = order;

    /** Subtraímos a quantidade do produto de dentro da 'order' da quantidade total de produtos existentes no banco de dados */
    /** Fazemos um mapeando dentro de 'products', em que para cada 'product' retornamos um objeto contendo o 'id' desse produto,
     * e a quantidade, que é obtida através de um filtro pra pegar exatamente a quantidade desse produto que está na 'order' e subtrair
     * pela quantidade do produto que consta dentro da 'order' */
    const orderedProductsQuantity = order_products.map(product => ({
      id: product.product_id,
      quantity:
        existentProducts.filter(p => p.id === product.product_id)[0].quantity -
        product.quantity,
    }));

    /** Atualizamos a quantidade de produtos existentes de dentor do banco, após a 'order' */
    await this.productsRepository.updateQuantity(orderedProductsQuantity);

    /** Retornamos a 'order' */
    return order;
  }
}

export default CreateOrderService;
