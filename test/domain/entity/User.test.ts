import { User } from "../../../src/domain/entity/User";

describe('Entidade Usuário', () => {
    const emailValido = "test@example.com";
    const nomeValido = "Test User";
    const senhaValida = "securepassword";

    it('deve lançar erro se a senha estiver ausente', () => {
        expect(() => new User(emailValido, nomeValido, ""))
            .toThrow('A senha é obrigatória');
    });
    it('deve criar um Usuário com dados válidos', () => {
        const user = new User(emailValido, nomeValido, senhaValida);
        expect(user.email).toBe(emailValido);
        expect(user.name).toBe(nomeValido);
        expect(user.password).toBeDefined();
        expect(user.id).toBeUndefined();
        expect(user.deleted).toBe(false);
        expect(user.createdAt).toBeInstanceOf(Date);
        expect(user.updatedAt).toBeInstanceOf(Date);
    });

    it('deve marcar usuário como deletado', () => {
        const user = new User(emailValido, nomeValido, senhaValida);
        expect(user.deleted).toBe(false);
        user.delete();
        expect(user.deleted).toBe(true);
        expect(user.updatedAt).toBeInstanceOf(Date);
    });

    it('deve definir e obter o id', () => {
        const user = new User(emailValido, nomeValido, senhaValida);
        user.id = "123";
        expect(user.id).toBe("123");
    });

    it('deve lançar erro se o email estiver ausente', () => {
        expect(() => new User("", nomeValido, senhaValida))
            .toThrow('O email é obrigatório');
    });

    it('deve lançar erro se o nome estiver ausente', () => {
        expect(() => new User(emailValido, "", senhaValida))
            .toThrow('O nome é obrigatório');
    });

    it('deve lançar erro se o email for inválido', () => {
        expect(() => new User("email-invalido", nomeValido, senhaValida))
            .toThrow();
    });
});