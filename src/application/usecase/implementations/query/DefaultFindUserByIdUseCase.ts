import { UserRepository } from "../../../repository/UserRepository";
import { Output } from "../../AddUserUseCase";
import { FindUserByIdUseCase } from "../../FindUserByIdUseCase";

export class DefaultFindUserByIdUseCase implements FindUserByIdUseCase {

    constructor(private userRepository: UserRepository) {}
    
    async execute(id: string): Promise<Output | undefined> {
        const user = await this.userRepository.findById(id);

        if (!user) {
            return undefined
        }

        return {
            id: user.id || '',
            name: user.name,
            email: user.email
        }
    }
}