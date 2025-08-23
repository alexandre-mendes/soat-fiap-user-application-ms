import { DomainError } from "../../../../domain/error/DomainError";
import { UserRepository } from "../../../repository/UserRepository";
import { DeleteUserUseCase } from "../../DeleteUserUseCase";

export class DefaultDeleteUserUseCase implements DeleteUserUseCase {
    
    constructor(private userRepository: UserRepository) { }

    async execute(id: string): Promise<void> {
        const userFound = await this.userRepository.findById(id);

        if (!userFound) {
            throw new DomainError('Usuário não encontrado.');
        }

        userFound.delete();
        await this.userRepository.save(userFound);
    }
}