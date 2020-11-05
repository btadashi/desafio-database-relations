import { getRepository, Repository, In } from 'typeorm';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICreateProductDTO from '@modules/products/dtos/ICreateProductDTO';
import IUpdateProductsQuantityDTO from '@modules/products/dtos/IUpdateProductsQuantityDTO';
import Product from '../entities/Product';

interface IFindProducts {
  id: string;
}

class ProductsRepository implements IProductsRepository {
  private ormRepository: Repository<Product>;

  constructor() {
    this.ormRepository = getRepository(Product);
  }

  public async create({
    name,
    price,
    quantity,
  }: ICreateProductDTO): Promise<Product> {
    /** Implementamos o méotodo 'create', usando o método 'create' do repositório do 'typeorm', passando as informações
     * que precisamos para pra fazer a criação do produto, 'name', 'price' e 'quantity' */
    const product = await this.ormRepository.create({
      name,
      price,
      quantity,
    });

    /** Pegamos o 'product' e salvamos dentro do banco de dados */
    await this.ormRepository.save(product);

    /** Retornamos o produto criado */
    return product;
  }

  public async findByName(name: string): Promise<Product | undefined> {
    /** Implementamos o método 'findByName', usando o método 'findOne' do repositório 'typeorm', passando a condição 'where' e o
     * parâmetro de nossa busca, que é o 'name' */
    const product = await this.ormRepository.findOne({
      where: {
        name,
      },
    });

    /** Retornamos o produto encontrado */
    return product;
  }

  public async findAllById(products: IFindProducts[]): Promise<Product[]> {
    /** Buscamos os 'id' dos 'products' que estamos recebendo e fazemos um 'map'   */
    const productsId = products.map(product => product.id);

    /** Pelo 'id' dos produtos, buscamos os produtos dentro do bando de dados */
    /** Como o método 'map' retorna um 'array', dizemos que queremos fazer uma busca dentro do banco de dados
     * pelos produtos, cujo 'id' está (In) dentro da array de 'productsId' */
    const existentProducts = this.ormRepository.find({
      where: {
        id: In(productsId),
      },
    });

    /** Retornamos os produtos encontrados */
    return existentProducts;
  }

  public async updateQuantity(
    products: IUpdateProductsQuantityDTO[],
  ): Promise<Product[]> {
    /** Nesse caso, apenas salvamos os produtos que recebemos como forma de atualização. */
    return this.ormRepository.save(products);
  }
}

export default ProductsRepository;
