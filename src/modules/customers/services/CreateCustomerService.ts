import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Customer from '../infra/typeorm/entities/Customer';
import ICustomersRepository from '../repositories/ICustomersRepository';

interface IRequest {
  name: string;
  email: string;
}

@injectable()
class CreateCustomerService {
  constructor(
    /** Damos um 'inject' de 'CustomersRepository' */
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ name, email }: IRequest): Promise<Customer> {
    /** Verificamos se o customer que vai ser criado já existe no banco de dados */
    const customerExists = await this.customersRepository.findByEmail(email);

    /** Se o 'customer' existir, então disparamos um erro */
    if (customerExists) {
      throw new AppError('This e-mail is already assigned to a customer');
    }

    /** Se o customer não existir, então criamos o 'customer' */
    const customer = await this.customersRepository.create({
      name,
      email,
    });

    /** Retornamos o 'customer' criado */
    return customer;
  }
}

export default CreateCustomerService;
