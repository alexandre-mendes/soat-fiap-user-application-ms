import { UserRepository } from "../../../../../src/application/repository/UserRepository";
import { User } from "../../../../../src/domain/entity/User";
import { FindUserByIdUseCase } from "../../../../../src/application/usecase/FindUserByIdUseCase";
import { DefaultFindUserByIdUseCase } from "../../../../../src/application/usecase/implementations/query/DefaultFindUserByIdUseCase";

describe('Testa consulta de usuário por id', () => {

    let findUserByIdUseCase: FindUserByIdUseCase;
    let mockUserRepository: jest.Mocked<UserRepository>;

    beforeEach(() => {
        mockUserRepository = {
            findByEmail: jest.fn(),
            findById: jest.fn(),
            save: jest.fn(),
            findAll: jest.fn()
        } as jest.Mocked<UserRepository>;

        findUserByIdUseCase = new DefaultFindUserByIdUseCase(mockUserRepository);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('Deve consultar usuário por id com sucesso', async () => {
        const id = '123';
        const user = new User('email@test.com', 'Alexandre', 'alexandre');
        user.id = id;
        mockUserRepository.findById.mockResolvedValueOnce(user);

        const result = await findUserByIdUseCase.execute(id);

        expect(result).toBeDefined();
        expect(result?.id).toEqual(id);
        expect(result?.email).toEqual('email@test.com');
        expect(result?.name).toEqual('Alexandre');
    });

    test('Deve lançar erro se usuário não existir', async () => {
    const id = 'notfound';
    mockUserRepository.findById.mockResolvedValueOnce(undefined);

    const result = await findUserByIdUseCase.execute(id);
    expect(result).toBeUndefined();
    });

    test('Deve tratar erro do repository', async () => {
        const id = 'error';
        mockUserRepository.findById.mockRejectedValueOnce(new Error('Erro de banco'));

        await expect(findUserByIdUseCase.execute(id)).rejects.toThrow('Erro de banco');
    });

    test('Deve consultar usuário com dados mínimos', async () => {
        const id = 'min';
        const user = new User('a@b.com', 'A', 'a');
        user.id = id;
        mockUserRepository.findById.mockResolvedValueOnce(user);

        const result = await findUserByIdUseCase.execute(id);

        expect(result).toBeDefined();
        expect(result?.id).toEqual(id);
        expect(result?.email).toEqual('a@b.com');
        expect(result?.name).toEqual('A');
    });
});
