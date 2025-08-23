import { Output } from "./AddUserUseCase";

export interface FindUserByIdUseCase {
    execute(id: string): Promise<Output|undefined>;
}