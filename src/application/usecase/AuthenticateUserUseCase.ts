export interface AuthenticateUserInput {
  email: string;
  password: string;
}

export interface AuthenticateUserOutput {
  id: string;
  name: string;
  email: string;
  token: string;
}

export interface AuthenticateUserUseCase {
  execute(input: AuthenticateUserInput): Promise<AuthenticateUserOutput>;
}
