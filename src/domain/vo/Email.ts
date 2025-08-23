import { DomainError } from "../error/DomainError";

export class Email {

    constructor(readonly value: string) {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!regex.test(value))
            throw new DomainError('E-mail inválido.')
    }
}