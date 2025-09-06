import { ValidateTokenUseCase, ValidateTokenInput, ValidateTokenOutput } from "../../ValidateTokenUseCase";
import jwt from "jsonwebtoken";

export class DefaultValidateTokenUseCase implements ValidateTokenUseCase {
  constructor(private jwtSecret: string) {}

  async execute(input: ValidateTokenInput): Promise<ValidateTokenOutput> {
    try {
      const decoded = jwt.verify(input.token, this.jwtSecret);
      return { valid: true, decoded };
    } catch (err) {
      return { valid: false, message: 'Token inválido' };
    }
  }
}
