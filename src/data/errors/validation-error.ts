export class ValidationError extends Error {
  constructor(reason: string) {
    super(`Erro de validação: ${reason}`);
  }
}
