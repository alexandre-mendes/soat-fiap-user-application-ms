import { DBOperation, DBQuery, Filter, IDatabase } from "./IDatabase";
import { DynamoDb } from "./DynamoConfig";

export interface IUser {
  id?: string,
  name: string;
  email: string;
  password: string;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export class UserDynamoDatabase implements IDatabase<IUser> {

  constructor(private dynamo: DynamoDb) { }

  async save(entity: IUser): Promise<IUser> {
    if (!entity.id)
      entity.id = crypto.randomUUID();

    await this.dynamo.putItem('user', entity);
    return entity;
  }

  async update(entity: IUser): Promise<IUser> {
    return await this.save(entity);
  }

  async deleteById(id: string): Promise<void> {
    await this.dynamo.deleteItem('user', { id })
  }

  async findById(id: string): Promise<IUser | null> {
    return await this.dynamo.getItem('user', { id }) as IUser;
  }

  async findByQuery(query: DBQuery): Promise<IUser> {
    const results = await this.findAllByQuery(query);
    return results[0] ?? null;
  }

  async findAllByQuery(query: DBQuery): Promise<IUser[]> {
    const expressionParts: string[] = [];
    const expressionValues: Record<string, any> = {};
    const expressionNames: Record<string, string> = {};

    query.andCriteria.forEach((criteria, i) => {
      const valuePlaceholder = `:v${i}`;
      const keyAlias = `#k${i}`;

      expressionNames[keyAlias] = criteria.key;
      expressionValues[valuePlaceholder] = criteria.value;

      switch (criteria.operation) {
        case DBOperation.EQUALS:
          expressionParts.push(`${keyAlias} = ${valuePlaceholder}`);
          break;
        case DBOperation.NOT_EQUALS:
          expressionParts.push(`${keyAlias} <> ${valuePlaceholder}`);
          break;
        default:
          throw new Error(`Operação não suportada: ${criteria.operation}`);
      }
    });

    const filterExpression = expressionParts.join(' AND ');

    const result = await this.dynamo.scanByField<IUser>({
      tableName: 'user',
      filterExpression,
      expressionValues,
      expressionNames,
    });

    return result;
  }

}
