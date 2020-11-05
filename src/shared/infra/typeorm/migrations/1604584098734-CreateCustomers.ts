/** Importamos Table de dentro do 'typeorm', para que possamos criar as tabelas */
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateCustomers1604584098734
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    /** Damos um 'await' e depois um createTable dentro de queryRunner, instanciamos uma nova tabela
     * depois damos um nome a ela e criamos as nossas colunas */
    await queryRunner.createTable(
      new Table({
        name: 'customers',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'email',
            type: 'varchar',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    /** Damos um await e depois um 'dropTable' na nossa tabela 'customers' */
    await queryRunner.dropTable('customers');
  }
}
