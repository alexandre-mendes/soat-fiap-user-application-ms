import { User } from "../../../../domain/entity/User";
import { DomainError } from "../../../../domain/error/DomainError";
import { UserRepository } from "../../../repository/UserRepository";
import { AddUserUseCase, Input, Output } from "../../AddUserUseCase";

export class DefaultAddUserUseCase implements AddUserUseCase {
    
    constructor(private userRepository: UserRepository) {}
    
    async execute(input: Input): Promise<Output> {
        const userByEmail = await this.userRepository.findByEmail(input.email);

        if (userByEmail) {
            throw new DomainError('Já existe um usuário com este email.');
        }

        const user = new User(input.email, input.name, input.password);
        const saved = await this.userRepository.save(user);
        
        return {
            id: saved.id || '',
            name: saved.name,
            email: saved.email
        }
    }
}