import { UserRepository } from '../../../src/application/repository/UserRepository';
import { IUser } from '../../../src/infra/database/dynamo/UserDynamoDatabase';
import { IDatabase } from '../../../src/infra/database/dynamo/IDatabase';
import { DefaultUserRepository } from '../../../src/infra/database/DefaultUserRepository';

describe('Testa repository de usuário', () => {
    test('Deve retornar todos os usuários', async () => {
        const user1 = { id: '1', name: 'Joao', email: 'a@a.com', password: 'senha1', deleted: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
        const user2 = { id: '2', name: 'Maria', email: 'b@b.com', password: 'senha2', deleted: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
        database.findAllByQuery.mockResolvedValue([user1, user2]);
        const result = await userRepository.findAll();
        expect(database.findAllByQuery).toHaveBeenCalledWith(expect.anything());
        expect(result).toHaveLength(2);
        expect(result[0].id).toEqual('1');
        expect(result[1].id).toEqual('2');
    });

    test('Deve retornar lista vazia se não houver usuários', async () => {
        database.findAllByQuery.mockResolvedValue([]);
        const result = await userRepository.findAll();
        expect(result).toEqual([]);
    });

    test('parseToDB deve converter entidade corretamente', () => {
        const entity = {
            id: '1',
            name: 'Joao',
            email: 'a@a.com',
            password: 'senha1',
            deleted: false,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        // @ts-ignore
        const repo = new DefaultUserRepository(database);
        // @ts-ignore
        const db = repo.parseToDB(entity);
        expect(db.id).toEqual(entity.id);
        expect(db.name).toEqual(entity.name);
        expect(db.email).toEqual(entity.email);
        expect(db.password).toEqual(entity.password);
        expect(db.deleted).toEqual(entity.deleted);
        expect(typeof db.createdAt).toBe('string');
        expect(typeof db.updatedAt).toBe('string');
    });

    test('parseToEntity deve converter db corretamente', () => {
        const db = {
            id: '1',
            name: 'Joao',
            email: 'a@a.com',
            password: 'senha1',
            deleted: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        // @ts-ignore
        const repo = new DefaultUserRepository(database);
        // @ts-ignore
        const entity = repo.parseToEntity(db);
        expect(entity.id).toEqual(db.id);
        expect(entity.name).toEqual(db.name);
        expect(entity.email).toEqual(db.email);
        expect(entity.password).toEqual(db.password);
        expect(entity.deleted).toEqual(db.deleted);
        expect(entity.createdAt instanceof Date).toBe(true);
        expect(entity.updatedAt instanceof Date).toBe(true);
    });

    let userRepository: UserRepository;
    let database: jest.Mocked<IDatabase<IUser>>;
    let user: any = { id: '123', name: 'Joao', email: 'a@a.com', password: 'senha123', deleted: false };

    beforeEach(() => {
        database = {
            save: jest.fn(),
            update: jest.fn(),
            deleteById: jest.fn(),
            findById: jest.fn(),
            findByQuery: jest.fn(),
            findAllByQuery: jest.fn(),
        } as jest.Mocked<IDatabase<IUser>>;

        userRepository = new DefaultUserRepository(database);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('Deve retornar usuário por id', async () => {
        database.findByQuery.mockResolvedValue(user);

        await userRepository.findById('123');

        expect(database.findByQuery).toHaveBeenCalledWith(expect.anything());
    });

    test('Deve retornar usuário por email', async () => {
        database.findByQuery.mockResolvedValue(user);

        await userRepository.findByEmail('a@a.com');

        expect(database.findByQuery).toHaveBeenCalledWith(expect.anything());
    });

    test('Deve salvar um usuário', async () => {
        database.save.mockResolvedValue(user);

        await userRepository.save(user);

        expect(database.save).toHaveBeenCalledWith(expect.anything());
    });

    test('Deve tratar erro do database ao buscar por id', async () => {
        database.findByQuery.mockRejectedValue(new Error('Erro de banco'));

        await expect(userRepository.findById('erro')).rejects.toThrow('Erro de banco');
    });

    test('Deve tratar erro do database ao salvar', async () => {
        database.save.mockRejectedValue(new Error('Erro ao salvar'));

        await expect(userRepository.save(user)).rejects.toThrow('Erro ao salvar');
    });
});
