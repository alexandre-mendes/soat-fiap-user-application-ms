import { DefaultDeleteUserUseCase } from "../../../../../src/application/usecase/implementations/command/DefaultDeleteUserUseCase";
import { UserRepository } from "../../../../../src/application/repository/UserRepository";
import { User } from "../../../../../src/domain/entity/User";
import { DomainError } from "../../../../../src/domain/error/DomainError";

describe('DefaultDeleteUserUseCase', () => {
    let mockUserRepository: jest.Mocked<UserRepository>;
    let deleteUserUseCase: DefaultDeleteUserUseCase;

    beforeEach(() => {
        mockUserRepository = {
            findById: jest.fn(),
            save: jest.fn(),
            findByEmail: jest.fn()
        } as jest.Mocked<UserRepository>;
        deleteUserUseCase = new DefaultDeleteUserUseCase(mockUserRepository);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('Deve excluir usuário logicamente com sucesso', async () => {
        const user = new User('email@test.com', 'Alexandre', '123456');
        mockUserRepository.findById.mockResolvedValueOnce(user);
        mockUserRepository.save.mockResolvedValueOnce(user);

        await deleteUserUseCase.execute('id');

        expect(user.deleted).toBe(true);
        expect(mockUserRepository.save).toHaveBeenCalledWith(user);
    });

    test('Deve lançar erro se usuário não existir', async () => {
        mockUserRepository.findById.mockResolvedValueOnce(undefined);
        await expect(deleteUserUseCase.execute('id')).rejects.toThrow(DomainError);
    });
});
