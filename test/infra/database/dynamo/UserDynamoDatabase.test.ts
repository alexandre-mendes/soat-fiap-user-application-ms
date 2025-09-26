import { UserDynamoDatabase, IUser } from '../../../../src/infra/database/dynamo/UserDynamoDatabase';
import { DynamoDb } from '../../../../src/infra/database/dynamo/DynamoConfig';
import { DBQuery, DBCriteria, DBOperation } from '../../../../src/infra/database/dynamo/IDatabase';

describe('UserDynamoDatabase', () => {
    let dynamo: jest.Mocked<DynamoDb>;
    let db: UserDynamoDatabase;
    const user: IUser = {
        id: '1',
        name: 'Joao',
        email: 'a@a.com',
        password: 'senha',
        deleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    beforeEach(() => {
        dynamo = {
            getItem: jest.fn(),
            putItem: jest.fn(),
            deleteItem: jest.fn(),
            scanByField: jest.fn(),
            count: jest.fn(),
            // ...existing code...
        } as any;
        db = new UserDynamoDatabase(dynamo);
    });

    test('save deve chamar putItem e gerar id se não existir', async () => {
        const userNoId = { ...user, id: undefined };
        dynamo.putItem.mockResolvedValue(undefined);
        const result = await db.save(userNoId);
        expect(result.id).toBeDefined();
        expect(dynamo.putItem).toHaveBeenCalledWith('user', expect.objectContaining({ name: 'Joao' }));
    });

    test('update deve chamar save', async () => {
        dynamo.putItem.mockResolvedValue(undefined);
        const result = await db.update(user);
        expect(result).toEqual(user);
        expect(dynamo.putItem).toHaveBeenCalledWith('user', user);
    });

    test('deleteById deve chamar deleteItem', async () => {
        dynamo.deleteItem.mockResolvedValue(undefined);
        await db.deleteById('1');
        expect(dynamo.deleteItem).toHaveBeenCalledWith('user', { id: '1' });
    });

    test('findById deve chamar getItem', async () => {
        dynamo.getItem.mockResolvedValue(user);
        const result = await db.findById('1');
        expect(dynamo.getItem).toHaveBeenCalledWith('user', { id: '1' });
        expect(result).toEqual(user);
    });

    test('findByQuery deve retornar primeiro resultado', async () => {
        const query = new DBQuery();
        dynamo.scanByField.mockResolvedValue([user, { ...user, id: '2' }]);
        const result = await db.findByQuery(query);
        expect(result).toEqual(user);
    });

    test('findByQuery deve retornar null se não houver resultados', async () => {
        const query = new DBQuery();
        dynamo.scanByField.mockResolvedValue([]);
        const result = await db.findByQuery(query);
        expect(result).toBeNull();
    });

    test('findAllByQuery deve montar expressão e chamar scanByField', async () => {
        const query = new DBQuery();
        query.add(new DBCriteria('email', 'a@a.com', DBOperation.EQUALS));
        query.add(new DBCriteria('deleted', false, DBOperation.EQUALS));
        dynamo.scanByField.mockResolvedValue([user]);
        const result = await db.findAllByQuery(query);
        expect(dynamo.scanByField).toHaveBeenCalledWith(expect.objectContaining({
            tableName: 'user',
            filterExpression: expect.stringContaining('#k0 = :v0'),
            expressionValues: expect.objectContaining({ ':v0': 'a@a.com' }),
            expressionNames: expect.objectContaining({ '#k0': 'email' })
        }));
        expect(result).toEqual([user]);
    });

    test('findAllByQuery deve lançar erro para operação não suportada', async () => {
        const query = new DBQuery();
        query.andCriteria.push({ key: 'email', value: 'a@a.com', operation: 'UNSUPPORTED' } as any);
        await expect(db.findAllByQuery(query)).rejects.toThrow('Operação não suportada: UNSUPPORTED');
    });
});
