import { UserRepository } from "../../../../../src/application/repository/UserRepository";
import { AddUserUseCase } from "../../../../../src/application/usecase/AddUserUseCase";
import { DefaultAddUserUseCase } from "../../../../../src/application/usecase/implementations/command/DefaultAddUserUseCase";
import { User } from "../../../../../src/domain/entity/User";

describe('Testa inclusão de usuário', () => {

    let addUserUseCase: AddUserUseCase;
    let mockUserRepository: jest.Mocked<UserRepository>;

    beforeEach(() => {
            mockUserRepository = {
                findByEmail: jest.fn(),
                save: jest.fn(),
                findById: jest.fn(),
                findAll: jest.fn()
            } as jest.Mocked<UserRepository>;

        addUserUseCase = new DefaultAddUserUseCase(mockUserRepository);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('Deve incluir usuário com sucesso', async () => {
        mockUserRepository.findByEmail.mockResolvedValue(undefined);
        mockUserRepository.save.mockImplementationOnce((user: User) => Promise.resolve(user))

        const input = {
            name: 'Alexandre',
            email: 'alexandre@mail.com',
            password: '123456'
        }

        const result = await addUserUseCase.execute(input)

        expect(result.name).toEqual(input.name)
        expect(result.email).toEqual(input.email)
        expect(result.id).toBeDefined()
    })

    test('Não deve permitir cadastro com email já existente', async () => {
        mockUserRepository.findByEmail.mockResolvedValue(new User('alexandre@testmail.com', 'Alexandre', '123456'));

        const input = {
            name: 'Alexandre',
            email: 'alexandre@testmail.com',
            password: '123456'
        }

        await expect(addUserUseCase.execute(input)).rejects.toThrow('Já existe um usuário com este email.');
    })

    test('Não deve permitir cadastro sem campos obrigatórios', async () => {
        mockUserRepository.findByEmail.mockResolvedValue(undefined);

        const inputs = [
            { name: '', email: 'alexandre@testmail.com', password: '123456' },
            { name: 'Alexandre', email: '', password: '123456' },
            { name: 'Alexandre', email: 'alexandre@testmail.com', password: '' }
        ];

        for (const input of inputs) {
            await expect(addUserUseCase.execute(input)).rejects.toThrow();
        }
    })

    test('Não deve permitir cadastro com email inválido', async () => {
        mockUserRepository.findByEmail.mockResolvedValue(undefined);

        const input = {
            cpf: '12345678900',
            name: 'Alexandre',
            email: 'email-invalido',
            password: '123456'
        }

        await expect(addUserUseCase.execute(input)).rejects.toThrow();
    })
})
