import { UserRepository } from "../../../repository/UserRepository";
import { ListUsersUseCase, ListUsersOutput } from "../../ListUsersUseCase";

export class DefaultListUsersUseCase implements ListUsersUseCase {
    
  constructor(private userRepository: UserRepository) {}

  async execute(): Promise<ListUsersOutput[]> {
    const users = await this.userRepository.findAll();
    return users.map(u => ({
      id: u.id || '',
      name: u.name,
      email: u.email
    }));
  }
}
