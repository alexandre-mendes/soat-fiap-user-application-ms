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
    let mockResponse: jest.Mocked<Response>;

    beforeEach(() => {
        mockResponse = { json: jest.fn(), send: jest.fn(), status: jest.fn() } as unknown as jest.Mocked<Response>;
        mockResponse.json.mockReturnValue(mockResponse)
        mockResponse.send.mockReturnValue(mockResponse)

        mockAddUserUseCase = { execute: jest.fn() } as jest.Mocked<AddUserUseCase>;
        mockFindUserByIdUseCase = { execute: jest.fn() } as jest.Mocked<FindUserByIdUseCase>;
        mockDeleteUserUseCase = { execute: jest.fn() } as jest.Mocked<DeleteUserUseCase>;

        userController = new UserController(mockAddUserUseCase, mockFindUserByIdUseCase, mockDeleteUserUseCase);
    });

    
    afterEach(() => {
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
        mockFindUserByIdUseCase.execute.mockResolvedValueOnce(undefined);

        await userController.findById({ body: {}, params: { id: 'notfound' } } as unknown as Request, mockResponse);

        expect(mockFindUserByIdUseCase.execute).toHaveBeenCalledWith('notfound');
        expect(mockResponse.json).toHaveBeenCalledWith(undefined);
        expect(mockResponse.status).toHaveBeenCalledWith(200);
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
