export interface ValidateTokenInput {
  token: string;
}

export interface ValidateTokenOutput {
  valid: boolean;
  decoded?: any;
  message?: string;
}

export interface ValidateTokenUseCase {
  execute(input: ValidateTokenInput): Promise<ValidateTokenOutput>;
}
