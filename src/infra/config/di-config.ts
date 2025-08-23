import { Delete } from "@aws-sdk/client-dynamodb";
import { UserRepository } from "../../application/repository/UserRepository";
import { AddUserUseCase } from '../../application/usecase/AddUserUseCase';
import { FindUserByIdUseCase } from "../../application/usecase/FindUserByIdUseCase";
import { DefaultAddUserUseCase } from "../../application/usecase/implementations/command/DefaultAddUserUseCase";
import { DefaultFindUserByIdUseCase } from "../../application/usecase/implementations/query/DefaultFindUserByIdUseCase";
import { UserController } from "../api/controller/UserController";
import { DefaultUserRepository } from "../database/DefaultUserRepository";
import { DynamoDb } from "../database/dynamo/DynamoConfig";
import { IDatabase } from "../database/dynamo/IDatabase";
import { IUser, UserDynamoDatabase } from "../database/dynamo/UserDynamoDatabase";
import { DeleteUserUseCase } from "../../application/usecase/DeleteUserUseCase";
import { DefaultDeleteUserUseCase } from "../../application/usecase/implementations/command/DefaultDeleteUserUseCase";


/*
    Dynamo
*/
const dynamo = new DynamoDb();

/*
    IDatabase - Dynamo
*/
const userDatabase: IDatabase<IUser> = new UserDynamoDatabase(dynamo)

/*
    Repositories
*/
const userRepository: UserRepository = new DefaultUserRepository(userDatabase);

/*
    Use Cases
*/
const addUserUseCase: AddUserUseCase = new DefaultAddUserUseCase(userRepository);
const findUserByIdUseCase: FindUserByIdUseCase = new DefaultFindUserByIdUseCase(userRepository);
const deleteUserUseCase: DeleteUserUseCase = new DefaultDeleteUserUseCase(userRepository); 

/*
    Controllers
*/
const userController = new UserController(addUserUseCase, findUserByIdUseCase, deleteUserUseCase);

export { userController };
