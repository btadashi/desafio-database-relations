import { Request, Response } from 'express';

import { container } from 'tsyringe';
import CreateProductService from '@modules/products/services/CreateProductService';

export default class ProductsController {
  public async create(request: Request, response: Response): Promise<Response> {
    /* Pegamos 'name', 'price' e 'quantity' do 'request.body' */
    const { name, price, quantity } = request.body;

    /** Instanciamos nosso 'service' 'CreateProductService'  */
    const createProduct = container.resolve(CreateProductService);

    /** Fazemos a criação do nosso produto, passando 'name', 'price' e 'quantity' */
    const product = await createProduct.execute({
      name,
      price,
      quantity,
    });

    /** Retornamos o produto */
    return response.json(product);
  }
}
