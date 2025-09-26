import { DynamoDb } from '../../../../src/infra/database/dynamo/DynamoConfig';
import { GetCommand, PutCommand, DeleteCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient, ListTablesCommand, CreateTableCommand } from '@aws-sdk/client-dynamodb';

describe('DynamoDb', () => {
    let dynamo: DynamoDb;
    beforeEach(() => {
        // Mock environment variables
        process.env.AWS_REGION = 'us-east-1';
        process.env.AWS_DYNAMO_ENDPOINT = 'http://localhost:8000';
        process.env.AWS_ACCESS_KEY_ID = 'fake';
        process.env.AWS_SECRET_ACCESS_KEY = 'fake';
        process.env.AWS_SESSION_TOKEN = 'fake';
    });

    test('deve instanciar DynamoDb e chamar createTableIfNotExists', async () => {
        const spy = jest.spyOn(DynamoDb.prototype as any, 'createTableIfNotExists').mockResolvedValue();
        dynamo = new DynamoDb();
        expect(spy).toHaveBeenCalledWith('user');
        spy.mockRestore();
    });

    test('getItem deve chamar GetCommand', async () => {
        dynamo = new DynamoDb();
        const sendSpy = jest.spyOn(dynamo['client'], 'send').mockResolvedValue({ Item: { id: '1', name: 'Joao' } });
        const result = await dynamo.getItem('user', { id: '1' });
        expect(sendSpy).toHaveBeenCalledWith(expect.any(GetCommand));
        expect(result).toEqual({ id: '1', name: 'Joao' });
        sendSpy.mockRestore();
    });

    test('putItem deve chamar PutCommand', async () => {
        dynamo = new DynamoDb();
        const sendSpy = jest.spyOn(dynamo['client'], 'send').mockResolvedValue({});
        await dynamo.putItem('user', { id: '1', name: 'Joao' });
        expect(sendSpy).toHaveBeenCalledWith(expect.any(PutCommand));
        sendSpy.mockRestore();
    });

    test('deleteItem deve chamar DeleteCommand', async () => {
        dynamo = new DynamoDb();
        const sendSpy = jest.spyOn(dynamo['client'], 'send').mockResolvedValue({});
        await dynamo.deleteItem('user', { id: '1' });
        expect(sendSpy).toHaveBeenCalledWith(expect.any(DeleteCommand));
        sendSpy.mockRestore();
    });

    test('scanByField deve chamar ScanCommand e retornar itens', async () => {
        dynamo = new DynamoDb();
        const sendSpy = jest.spyOn(dynamo['client'], 'send').mockResolvedValue({ Items: [{ id: '1' }, { id: '2' }] });
        const result = await dynamo.scanByField({
            tableName: 'user',
            filterExpression: 'id = :id',
            expressionValues: { ':id': '1' }
        });
        expect(sendSpy).toHaveBeenCalledWith(expect.any(ScanCommand));
        expect(result).toEqual([{ id: '1' }, { id: '2' }]);
        sendSpy.mockRestore();
    });

    test('count deve chamar ScanCommand e retornar contagem', async () => {
        dynamo = new DynamoDb();
        const sendSpy = jest.spyOn(dynamo['client'], 'send').mockResolvedValue({ Count: 5 });
        const result = await dynamo.count('user');
        expect(sendSpy).toHaveBeenCalledWith(expect.any(ScanCommand));
        expect(result).toEqual(5);
        sendSpy.mockRestore();
    });

    test('createTableIfNotExists deve criar tabela se não existir', async () => {
        dynamo = new DynamoDb();
        const ddbSpy = jest.spyOn(dynamo['ddbClient'], 'send');
        // Simula tabela não existente
        ddbSpy.mockResolvedValueOnce({ TableNames: [] });
        ddbSpy.mockResolvedValueOnce({}); // CreateTableCommand
        await (dynamo as any).createTableIfNotExists('user2');
        expect(ddbSpy).toHaveBeenCalledWith(expect.any(ListTablesCommand));
        expect(ddbSpy).toHaveBeenCalledWith(expect.any(CreateTableCommand));
        ddbSpy.mockRestore();
    });

    test('createTableIfNotExists não cria tabela se já existir', async () => {
        dynamo = new DynamoDb();
        const ddbSpy = jest.spyOn(dynamo['ddbClient'], 'send');
        ddbSpy.mockResolvedValueOnce({ TableNames: ['user'] });
        await (dynamo as any).createTableIfNotExists('user');
        expect(ddbSpy).toHaveBeenCalledWith(expect.any(ListTablesCommand));
        ddbSpy.mockRestore();
    });
});
