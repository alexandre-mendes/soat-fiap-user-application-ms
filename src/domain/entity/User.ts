import { DomainError } from "../error/DomainError";
import { Email } from "../vo/Email";
const crypto = require('crypto');

export class User {
    private _id: string | undefined;
    private _email: Email;
    private _name: string;
    private _password: string;
    private _deleted: boolean;
    private _createdAt: Date;
    private _updatedAt: Date;

    constructor(email: string, name: string, password: string) {
        if (!email)
            throw new DomainError('O email é obrigatório');
        if (!name)
            throw new DomainError('O nome é obrigatório');
        if (!password)
            throw new DomainError('A senha é obrigatória');

        this._email = new Email(email);
        this._name = name;
        this._password = this.hashPassword(password);
        this._deleted = false;
        this._createdAt = new Date();
        this._updatedAt = new Date();
    }

    public delete() {
        this._deleted = true;
        this._updatedAt = new Date();
    }

    private hashPassword(password: string) {
        const salt = crypto.randomBytes(16).toString('hex');
        const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
        return `${salt}:${hash}`;
    }

    public verifyPassword(password: string): boolean {
        console.log('Verifying password for user:', this._password);
        const [salt, hash] = this._password.split(":");
        const inputHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
        console.log('Input hash:', inputHash);
        return inputHash === hash;
    }

    get password() {
        return this._password;
    }

    set password(password: string) {
        this._password = password;
    }

    get id() {
        return this._id;
    }

    set id(id: string | undefined) {
        this._id = id;
    }

    get email() {
        return this._email.value;
    }

    get name() {
        return this._name;
    }

    get createdAt() {
        return this._createdAt;
    }

    get updatedAt() {
        return this._updatedAt;
    }

    get deleted() { 
        return this._deleted;
    }

    set deleted(value: boolean) {
        this._deleted = value;
    }

    set updatedAt(value: Date) {
        this._updatedAt = value;
    }

    set createdAt(value: Date) {
        this._createdAt = value;
    }
}