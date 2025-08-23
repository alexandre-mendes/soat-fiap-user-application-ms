import { User } from "../../domain/entity/User";

export interface UserRepository {
    findById(id: string): Promise<User|undefined>;
    save(user: User): Promise<User>;
    findByEmail(email: string): Promise<User|undefined>;
}