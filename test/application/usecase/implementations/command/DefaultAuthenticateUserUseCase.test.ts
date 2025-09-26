import { UserRepository } from "../../../../../src/application/repository/UserRepository";
import { DefaultAuthenticateUserUseCase } from "../../../../../src/application/usecase/implementations/command/DefaultAuthenticateUserUseCase";
import { User } from "../../../../../src/domain/entity/User";
import jwt from "jsonwebtoken";
import { DomainError } from "../../../../../src/domain/error/DomainError";

describe('Testa autenticação de usuário', () => {
    let mockUserRepository: jest.Mocked<UserRepository>;
    let authenticateUserUseCase: DefaultAuthenticateUserUseCase;
    const jwtSecret = 'test-secret';

    beforeEach(() => {
        mockUserRepository = {
            findByEmail: jest.fn(),
            save: jest.fn(),
            findById: jest.fn(),
            findAll: jest.fn()
        } as jest.Mocked<UserRepository>;
        authenticateUserUseCase = new DefaultAuthenticateUserUseCase(mockUserRepository, jwtSecret);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('Deve autenticar usuário com sucesso e retornar token', async () => {
        const user = new User('email@test.com', 'Alexandre', 'senha123');
        user.id = 'user-id';
        mockUserRepository.findByEmail.mockResolvedValueOnce(user);
        // Senha correta
        const input = { email: 'email@test.com', password: 'senha123' };
        const result = await authenticateUserUseCase.execute(input);
        expect(result.id).toEqual('user-id');
        expect(result.name).toEqual('Alexandre');
        expect(result.email).toEqual('email@test.com');
        expect(result.token).toBeDefined();
        // Valida JWT
        const payload = jwt.verify(result.token, jwtSecret) as any;
        expect(payload.sub).toEqual('user-id');
        expect(payload.email).toEqual('email@test.com');
    });

    test('Deve lançar erro se usuário não existir', async () => {
        mockUserRepository.findByEmail.mockResolvedValueOnce(undefined);
        const input = { email: 'notfound@test.com', password: 'senha123' };
        await expect(authenticateUserUseCase.execute(input)).rejects.toThrow(DomainError);
    });

    test('Deve lançar erro se senha estiver incorreta', async () => {
        const user = new User('email@test.com', 'Alexandre', 'senha123');
        user.id = 'user-id';
        mockUserRepository.findByEmail.mockResolvedValueOnce(user);
        // Senha incorreta
        const input = { email: 'email@test.com', password: 'senhaErrada' };
        await expect(authenticateUserUseCase.execute(input)).rejects.toThrow(DomainError);
    });
});
