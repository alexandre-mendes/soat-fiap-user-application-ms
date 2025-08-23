import { Email } from "../../../src/domain/vo/Email";

describe('Testa criação de e-mail', () => {

    test('Deve criar email com sucesso', () => {
        expect(new Email('alexandre@fiap.com')).toBeDefined();
    });

    test('Deve acusar email inválido', () => {
        expect(() => new Email('alexandre@fiap')).toThrow('E-mail inválido.');
    });
});