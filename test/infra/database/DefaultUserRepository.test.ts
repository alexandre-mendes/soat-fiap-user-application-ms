import { UserRepository } from '../../../src/application/repository/UserRepository';
import { IUser } from '../../../src/infra/database/dynamo/UserDynamoDatabase';
import { IDatabase } from '../../../src/infra/database/dynamo/IDatabase';
import { DefaultUserRepository } from '../../../src/infra/database/DefaultUserRepository';

describe('Testa repository de usuário', () => {

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
