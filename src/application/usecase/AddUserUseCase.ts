
export interface AddUserUseCase {
    execute(input: Input): Promise<Output>;
}

export interface Input {
    name: string,
    email: string, 
    password: string,
}

export interface Output {
    id: string,
    name: string,
    email: string
}