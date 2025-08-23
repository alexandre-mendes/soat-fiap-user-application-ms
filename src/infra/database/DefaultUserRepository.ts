import { UserRepository } from "../../application/repository/UserRepository";
import { User } from "../../domain/entity/User";
import { IUser } from "./dynamo/UserDynamoDatabase";
import { DBCriteria, DBOperation, DBQuery, IDatabase } from "./dynamo/IDatabase";

export class DefaultUserRepository implements UserRepository {

    constructor(private database: IDatabase<IUser>) { }

    async findById(id: string): Promise<User | undefined> {
        const query = new DBQuery();
        query.add(new DBCriteria('id', id, DBOperation.EQUALS));
        query.add(new DBCriteria('deleted', false, DBOperation.EQUALS));
        const finded = await this.database.findByQuery(query);

        if (finded)
            return this.parseToEntity(finded);
        return undefined;
    }

    async save(user: User): Promise<User> {
        const db = this.parseToDB(user);
        const saved = await this.database.save(db);
        return this.parseToEntity(saved as IUser);
    }

    async findByEmail(email: string): Promise<User | undefined> {
        const query = new DBQuery();
        query.add(new DBCriteria('email', email, DBOperation.EQUALS));
        query.add(new DBCriteria('deleted', false, DBOperation.EQUALS));
        const finded = await this.database.findByQuery(query);

        if (finded)
            return this.parseToEntity(finded);
        return undefined;
    }

    private parseToDB(entity: User) {
        return { id: entity.id, name: entity.name, email: entity.email, password: entity.password } as IUser;
    }

    private parseToEntity(db: IUser) {
        const entity = new User(db.email, db.name, db.password);
        entity.id = db.id;
        return entity;
    }

}