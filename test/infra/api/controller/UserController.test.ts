import { AddUserUseCase } from '../../../../src/application/usecase/AddUserUseCase';
import { FindUserByIdUseCase } from '../../../../src/application/usecase/FindUserByIdUseCase';
import { DeleteUserUseCase } from '../../../../src/application/usecase/DeleteUserUseCase';
import { User } from '../../../../src/domain/entity/User';
import { UserController } from '../../../../src/infra/api/controller/UserController';
import { Response, Request } from 'express';

describe('Testa controller de usuário', () => {

    let userController: UserController;
    let mockAddUserUseCase: jest.Mocked<AddUserUseCase>;
    let mockFindUserByIdUseCase: jest.Mocked<FindUserByIdUseCase>;
    let mockDeleteUserUseCase: jest.Mocked<DeleteUserUseCase>;
    let mockAuthenticateUserUseCase: jest.Mocked<import('../../../../src/application/usecase/AuthenticateUserUseCase').AuthenticateUserUseCase>;
    let mockValidateTokenUseCase: jest.Mocked<import('../../../../src/application/usecase/ValidateTokenUseCase').ValidateTokenUseCase>;
    let mockListUsersUseCase: jest.Mocked<import('../../../../src/application/usecase/ListUsersUseCase').ListUsersUseCase>;
    let mockResponse: jest.Mocked<Response>;

    beforeEach(() => {
        mockResponse = {
            json: jest.fn(),
            send: jest.fn(),
            status: jest.fn()
        } as unknown as jest.Mocked<Response>;
        // Encadeamento status().json() e status().send()
        (mockResponse.status as jest.Mock).mockReturnValue(mockResponse);
        (mockResponse.json as jest.Mock).mockReturnValue(mockResponse);
        (mockResponse.send as jest.Mock).mockReturnValue(mockResponse);

        mockAddUserUseCase = { execute: jest.fn() } as jest.Mocked<AddUserUseCase>;
        mockFindUserByIdUseCase = { execute: jest.fn() } as jest.Mocked<FindUserByIdUseCase>;
        mockDeleteUserUseCase = { execute: jest.fn() } as jest.Mocked<DeleteUserUseCase>;
        mockAuthenticateUserUseCase = { execute: jest.fn() } as jest.Mocked<import('../../../../src/application/usecase/AuthenticateUserUseCase').AuthenticateUserUseCase>;
        mockValidateTokenUseCase = { execute: jest.fn() } as jest.Mocked<import('../../../../src/application/usecase/ValidateTokenUseCase').ValidateTokenUseCase>;
        mockListUsersUseCase = { execute: jest.fn() } as jest.Mocked<import('../../../../src/application/usecase/ListUsersUseCase').ListUsersUseCase>;

        userController = new UserController(
            mockAddUserUseCase,
            mockFindUserByIdUseCase,
            mockDeleteUserUseCase,
            mockAuthenticateUserUseCase,
            mockValidateTokenUseCase,
            mockListUsersUseCase
        );
    });

    
    afterEach(() => {
    });

    test('Deve autenticar usuário com sucesso', async () => {
        mockAuthenticateUserUseCase.execute.mockResolvedValueOnce({ id: 'id', name: 'Alexandre', email: 'alexandre@testmail.com', token: 'jwt-token' });
        const req = { body: { email: 'alexandre@testmail.com', password: '123456' } } as unknown as Request;
        await userController.authenticate(req, mockResponse);
        expect(mockAuthenticateUserUseCase.execute).toHaveBeenCalledWith({ email: 'alexandre@testmail.com', password: '123456' });
        expect(mockResponse.json).toHaveBeenCalledWith({ id: 'id', name: 'Alexandre', email: 'alexandre@testmail.com', token: 'jwt-token' });
        expect(mockResponse.status).toHaveBeenCalledWith(200);
    });

    test('Deve validar token com sucesso', async () => {
        mockValidateTokenUseCase.execute.mockResolvedValueOnce({ valid: true, decoded: { sub: 'id', email: 'alexandre@testmail.com' } });
        const req = { headers: { authorization: 'Bearer jwt-token' } } as unknown as Request;
        await userController.validateToken(req, mockResponse);
        expect(mockValidateTokenUseCase.execute).toHaveBeenCalledWith({ token: 'jwt-token' });
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith({ valid: true, decoded: { sub: 'id', email: 'alexandre@testmail.com' } });
    });

    test('Deve retornar erro 401 se token não informado', async () => {
        const req = { headers: {} } as unknown as Request;
        await userController.validateToken(req, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(401);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Token não informado' });
    });

    test('Deve retornar erro 401 se token inválido', async () => {
        mockValidateTokenUseCase.execute.mockResolvedValueOnce({ valid: false, message: 'Token inválido' });
        const req = { headers: { authorization: 'Bearer jwt-token' } } as unknown as Request;
        await userController.validateToken(req, mockResponse);
        expect(mockValidateTokenUseCase.execute).toHaveBeenCalledWith({ token: 'jwt-token' });
        expect(mockResponse.status).toHaveBeenCalledWith(401);
        expect(mockResponse.json).toHaveBeenCalledWith({ valid: false, message: 'Token inválido' });
    });

    test('Deve listar usuários com sucesso', async () => {
        mockListUsersUseCase.execute.mockResolvedValueOnce([
            { id: 'id1', name: 'Alexandre', email: 'alexandre@testmail.com' },
            { id: 'id2', name: 'Maria', email: 'maria@testmail.com' }
        ]);
        await userController.list({} as unknown as Request, mockResponse);
        expect(mockListUsersUseCase.execute).toHaveBeenCalled();
        expect(mockResponse.json).toHaveBeenCalledWith([
            { id: 'id1', name: 'Alexandre', email: 'alexandre@testmail.com' },
            { id: 'id2', name: 'Maria', email: 'maria@testmail.com' }
        ]);
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        jest.clearAllMocks();
    });

    test('Deve excluir usuário logicamente com sucesso', async () => {
        mockDeleteUserUseCase.execute.mockResolvedValueOnce();

        await userController.delete({ params: { id: 'id' } } as unknown as Request, mockResponse);

        expect(mockDeleteUserUseCase.execute).toHaveBeenCalledWith('id');
        expect(mockResponse.status).toHaveBeenCalledWith(204);
        expect(mockResponse.send).toHaveBeenCalled();
    });
    
    test('Deve executar consulta de usuário por id', async () => {
        mockFindUserByIdUseCase.execute.mockResolvedValueOnce(Promise.resolve({ id: 'id', name: 'Alexandre', email: 'alexandre@testmail.com', username: 'alexandre', password: '123456' }));

        await userController.findById({ body: {}, params: { id: 'id' } } as unknown as Request, mockResponse);

        expect(mockFindUserByIdUseCase.execute).toHaveBeenCalledWith('id');
        expect(mockResponse.json).toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenCalledWith(200);
    });

    test('Deve retornar undefined se usuário não existir', async () => {
    mockFindUserByIdUseCase.execute.mockRejectedValueOnce(new Error('Usuário não encontrado'));

    await expect(userController.findById({ body: {}, params: { id: 'notfound' } } as unknown as Request, mockResponse)).rejects.toThrow('Usuário não encontrado');
    });

    test('Deve salvar usuário com sucesso', async () => {
        mockAddUserUseCase.execute.mockResolvedValueOnce(Promise.resolve({ id: 'id', name: 'Alexandre', email: 'alexandre@testmail.com', username: 'alexandre', password: '123456' }));

        await userController.create({ body: { name: 'Alexandre', email: 'alexandre@testmail.com', username: 'alexandre', password: '123456' } } as unknown as Request, mockResponse);

        expect(mockAddUserUseCase.execute).toHaveBeenCalled();
        expect(mockResponse.json).toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenCalledWith(201);
    });

    test('Deve tratar erro ao consultar usuário por id', async () => {
        mockFindUserByIdUseCase.execute.mockRejectedValueOnce(new Error('Erro de banco'));

        await expect(userController.findById({ body: {}, params: { id: 'id' } } as unknown as Request, mockResponse)).rejects.toThrow('Erro de banco');
    });

    test('Deve tratar erro ao salvar usuário', async () => {
        mockAddUserUseCase.execute.mockRejectedValueOnce(new Error('Erro ao salvar'));

        await expect(userController.create({ body: { name: 'Alexandre', email: 'alexandre@testmail.com', username: 'alexandre', password: '123456' } } as unknown as Request, mockResponse)).rejects.toThrow('Erro ao salvar');
    });
});
