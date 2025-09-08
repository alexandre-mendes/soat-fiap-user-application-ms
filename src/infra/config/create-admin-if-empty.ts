import { AddUserUseCase } from "../../application/usecase/AddUserUseCase";
import { ListUsersUseCase } from "../../application/usecase/ListUsersUseCase";


export class CreateAdminIfEmpty {

  constructor(private listUsersUseCase: ListUsersUseCase,
    private addUserUseCase: AddUserUseCase) { }

  async createAdminIfEmpty() {
    try {
      // Tenta listar usuários
      const users = await this.listUsersUseCase.execute();
      if (users.length === 0) {
        const admin = await this.addUserUseCase.execute({
          name: 'Admin',
          email: 'admin@admin.com',
          password: 'admin123'
        });
        console.log('Usuário admin criado:', admin);
      } else {
        console.log('Usuários já existem na base. Nenhum admin criado.');
      }
    } catch (err) {
      console.error('Erro ao criar admin:', err);
    }
  }
}



