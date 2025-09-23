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
import { AuthenticateUserUseCase } from '../../application/usecase/AuthenticateUserUseCase';
import { DefaultAuthenticateUserUseCase } from '../../application/usecase/implementations/command/DefaultAuthenticateUserUseCase';
import { ValidateTokenUseCase } from '../../application/usecase/ValidateTokenUseCase';
import { DefaultValidateTokenUseCase } from '../../application/usecase/implementations/command/DefaultValidateTokenUseCase';
import { ListUsersUseCase } from '../../application/usecase/ListUsersUseCase';
import { DefaultListUsersUseCase } from '../../application/usecase/implementations/query/DefaultListUsersUseCase';
import { CreateAdminIfEmpty } from "./create-admin-if-empty";
import { MetricsController } from "../api/controller/MetricsController";


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
const jwtSecret = process.env.JWT_SECRET || 'dev-secret';
const authenticateUserUseCase: AuthenticateUserUseCase = new DefaultAuthenticateUserUseCase(userRepository, jwtSecret);
const validateTokenUseCase: ValidateTokenUseCase = new DefaultValidateTokenUseCase(jwtSecret);
const listUsersUseCase: ListUsersUseCase = new DefaultListUsersUseCase(userRepository);

/*
    Controllers
*/
const userController = new UserController(addUserUseCase, findUserByIdUseCase, deleteUserUseCase, authenticateUserUseCase, validateTokenUseCase, listUsersUseCase);
const metricsController = new MetricsController();
/*
    Scripts
*/
const createAdminIfEmpty = new CreateAdminIfEmpty(listUsersUseCase, addUserUseCase);
createAdminIfEmpty.createAdminIfEmpty();

export { userController, metricsController, validateTokenUseCase };
