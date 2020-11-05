import { Request, Response } from 'express';

import CreateCustomerService from '@modules/customers/services/CreateCustomerService';

import { container } from 'tsyringe';

export default class CustomersController {
  public async create(request: Request, response: Response): Promise<Response> {
    /** Pegamos o nome e o email do 'request.body' */
    const { name, email } = request.body;

    /** Instanciamos nosso service através do container, que vai olhar para dentro do container, ver se vai precisar de alguma
     * injeção e vai injetar para nós o que vamos precisar.  */
    const createCustomer = container.resolve(CreateCustomerService);

    /** Chamamos aqui o nosso service, que por sua vez, vai fazer a crição de um 'customer', em que passamos o 'name' e 'email'  */
    const customer = await createCustomer.execute({
      name,
      email,
    });

    /** Retornamos o 'customer' */
    return response.json(customer);
  }
}
