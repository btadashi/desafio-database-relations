import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Product from '../infra/typeorm/entities/Product';
import IProductsRepository from '../repositories/IProductsRepository';
import ProductsRepository from '../infra/typeorm/repositories/ProductsRepository';

interface IRequest {
  name: string;
  price: number;
  quantity: number;
}

@injectable()
class CreateProductService {
  constructor(
    /** Damos um 'inject' de 'ProductsRepository' */
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
  ) {}

  public async execute({ name, price, quantity }: IRequest): Promise<Product> {
    /** Verificamos se esse produto já existe */
    const productExists = await this.productsRepository.findByName(name);

    /** Se o produto já existir, disparamos um erro */
    if (productExists) {
      throw new AppError('There is already a product with this name');
    }

    /** Caso não existir, então criamos o produto, passando 'name', 'price' e 'quantity' */
    const product = await this.productsRepository.create({
      name,
      price,
      quantity,
    });

    /** Retornamos o produto criado */
    return product;
  }
}

export default CreateProductService;
