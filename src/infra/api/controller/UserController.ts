import { Request, Response } from "express";
import { AddUserUseCase } from "../../../application/usecase/AddUserUseCase";
import { FindUserByIdUseCase } from "../../../application/usecase/FindUserByIdUseCase";
import { DeleteUserUseCase } from "../../../application/usecase/DeleteUserUseCase";
import { AuthenticateUserUseCase } from '../../../application/usecase/AuthenticateUserUseCase';

export class UserController {

    constructor(
        private addUserUseCase: AddUserUseCase,
        private findUserByIdUseCase: FindUserByIdUseCase,
        private deleteUserUseCase: DeleteUserUseCase,
        private authenticateUserUseCase: AuthenticateUserUseCase // novo parâmetro
    ) {
    }

    async findById(req: Request, res: Response) {
        const user = await this.findUserByIdUseCase.execute(req.params.id);
        return res.json(user).status(200);
    }

    async create(req: Request, res: Response) {
        const user = await this.addUserUseCase.execute(req.body);
        return res.json(user).status(201);
    }

    async delete(req: Request, res: Response) {
        const user = await this.deleteUserUseCase.execute(req.params.id);
        return res.send().status(204);
    }

    async authenticate(req: Request, res: Response) {
        const result = await this.authenticateUserUseCase.execute(req.body);
        return res.json(result).status(200);
    }
}
