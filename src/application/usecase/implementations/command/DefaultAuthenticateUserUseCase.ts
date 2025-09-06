import { AuthenticateUserUseCase, AuthenticateUserInput, AuthenticateUserOutput } from "../../AuthenticateUserUseCase";
import { UserRepository } from "../../../repository/UserRepository";
import { DomainError } from "../../../../domain/error/DomainError";
import jwt from "jsonwebtoken";

export class DefaultAuthenticateUserUseCase implements AuthenticateUserUseCase {

  constructor(private userRepository: UserRepository, private jwtSecret: string) {}

  async execute(input: AuthenticateUserInput): Promise<AuthenticateUserOutput> {
    const user = await this.userRepository.findByEmail(input.email);
    if (!user) {
      throw new DomainError("Usuário ou senha inválidos");
    }
    
    if (user.verifyPassword(input.password) === false) {
      throw new DomainError("Usuário ou senha inválidos");
    }
    // Gera JWT
    const token = jwt.sign({ sub: user.id, email: user.email }, this.jwtSecret, { expiresIn: '1h' });
    return {
      id: user.id || '',
      name: user.name,
      email: user.email,
      token
    };
  }
}
