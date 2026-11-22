
export class AccountDomainError extends Error {
  constructor(
    message: string,
    public readonly code: string,
  ) {
    super(message);
    this.name = new.target.name;
  }
}

export class InvalidAccountError extends AccountDomainError {
  constructor(message: string) {
    super(message, "INVALID_ACCOUNT");
  }
}

export class AccountAlreadyExistsError extends AccountDomainError {
  constructor(code: string) {
    super(
      `La cuenta con código ${code} ya existe`,
      "ACCOUNT_ALREADY_EXISTS",
    );
  }
}

export class AccountNotFoundError extends AccountDomainError {
  constructor(code: string) {
    super(
      `La cuenta con código ${code} no existe`,
      "ACCOUNT_NOT_FOUND",
    );
  }
}

export class AccountParentNotFoundError extends AccountDomainError {
  constructor(code: string) {
    super(
      `La cuenta padre ${code} no existe`,
      "ACCOUNT_PARENT_NOT_FOUND",
    );
  }
}

export class AccountHasChildrenError extends AccountDomainError {
  constructor(code: string) {
    super(
      `No se puede eliminar la cuenta ${code} porque tiene cuentas hijas`,
      "ACCOUNT_HAS_CHILDREN",
    );
  }
}
