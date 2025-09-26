import { DefaultValidateTokenUseCase } from "../../../../../src/application/usecase/implementations/command/DefaultValidateTokenUseCase";
import jwt from "jsonwebtoken";

describe('Testa validação de token', () => {
    const jwtSecret = 'test-secret';
    let validateTokenUseCase: DefaultValidateTokenUseCase;

    beforeEach(() => {
        validateTokenUseCase = new DefaultValidateTokenUseCase(jwtSecret);
    });

    test('Deve validar token JWT válido', async () => {
        const payload = { sub: 'user-id', email: 'email@test.com' };
        const token = jwt.sign(payload, jwtSecret, { expiresIn: '1h' });
        const input = { token };
        const result = await validateTokenUseCase.execute(input);
        expect(result.valid).toBe(true);
        expect(result.decoded.sub).toEqual('user-id');
        expect(result.decoded.email).toEqual('email@test.com');
    });

    test('Deve retornar inválido para token JWT incorreto', async () => {
        const input = { token: 'token-invalido' };
        const result = await validateTokenUseCase.execute(input);
        expect(result.valid).toBe(false);
        expect(result.message).toEqual('Token inválido');
    });

    test('Deve retornar inválido para token JWT expirado', async () => {
        const payload = { sub: 'user-id', email: 'email@test.com' };
        // Token expira imediatamente
        const token = jwt.sign(payload, jwtSecret, { expiresIn: 0 });
        const input = { token };
        // Aguarda 1ms para garantir expiração
        await new Promise(res => setTimeout(res, 1));
        const result = await validateTokenUseCase.execute(input);
        expect(result.valid).toBe(false);
        expect(result.message).toEqual('Token inválido');
    });
});
