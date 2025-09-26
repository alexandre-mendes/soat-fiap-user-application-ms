import { UserRepository } from "../../../../../src/application/repository/UserRepository";
import { DefaultListUsersUseCase } from "../../../../../src/application/usecase/implementations/query/DefaultListUsersUseCase";
import { User } from "../../../../../src/domain/entity/User";

describe('Testa listagem de usuários', () => {
    let mockUserRepository: jest.Mocked<UserRepository>;
    let listUsersUseCase: DefaultListUsersUseCase;

    beforeEach(() => {
        mockUserRepository = {
            findByEmail: jest.fn(),
            save: jest.fn(),
            findById: jest.fn(),
            findAll: jest.fn()
        } as jest.Mocked<UserRepository>;
        listUsersUseCase = new DefaultListUsersUseCase(mockUserRepository);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('Deve listar usuários com sucesso', async () => {
        const user1 = new User('email1@test.com', 'Alexandre', 'senha1');
        user1.id = 'id1';
        const user2 = new User('email2@test.com', 'Maria', 'senha2');
        user2.id = 'id2';
        mockUserRepository.findAll.mockResolvedValueOnce([user1, user2]);
        const result = await listUsersUseCase.execute();
        expect(result).toHaveLength(2);
        expect(result[0].id).toEqual('id1');
        expect(result[0].name).toEqual('Alexandre');
        expect(result[0].email).toEqual('email1@test.com');
        expect(result[1].id).toEqual('id2');
        expect(result[1].name).toEqual('Maria');
        expect(result[1].email).toEqual('email2@test.com');
    });

    test('Deve retornar lista vazia se não houver usuários', async () => {
        mockUserRepository.findAll.mockResolvedValueOnce([]);
        const result = await listUsersUseCase.execute();
        expect(result).toEqual([]);
    });
});
