import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';

import Order from '@modules/orders/infra/typeorm/entities/Order';
import Product from '@modules/products/infra/typeorm/entities/Product';

/** Adicionamos um 'decorator' 'Entity' dizendo que essa classe está relacionada com a tabela 'orders_products' */
/** Para cada uma das "colunas", passamos um 'decorator' */
@Entity('orders_products')
class OrdersProducts {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** Teremos uma relação 'many-to-one', em que podemos ter várias 'orders_products' para uma 'order' */
  /** Dentro do 'many-to_one', passamos a tabela 'Order', passamos apelido 'order', em que para cada 'order', pegamos a
   * 'order_products' */
  /** Aqui vai ser exatamente o reverso do que temos em 'Order.ts', referente ao 'order_products' */
  /** Já passamos que o relacionamento vai ser através do 'order_id' */
  @ManyToOne(() => Order, order => order.order_products)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  /** Teremos um relacionamento 'many-to-one', pois várias 'orders_products' pode ter um 'produto'  */
  /** Já passamos que o relacionamento vai ser através do 'product_id' */
  @ManyToOne(() => Product, product => product.order_products)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column()
  product_id: string;

  @Column()
  order_id: string;

  @Column('decimal')
  price: number;

  @Column('int')
  quantity: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default OrdersProducts;
