
import type {
  Account,
  CreateAccountInput,
} from "../../domain/entities/account.entity.js";

import {
  getAccountLevel,
  getParentCode,
} from "../../domain/entities/account.entity.js";
import { AccountAlreadyExistsError, AccountParentNotFoundError, InvalidAccountError } from "../../domain/errors/account.error.js";

import type {
  AccountRepository,
} from "../../domain/repositories/account.repository.js";



export class CreateAccountUseCase {
  constructor(
    private readonly repository: AccountRepository,
  ) {}

  async execute(input: CreateAccountInput): Promise<Account> {
    const { code, nature } = input;
    const name = input.name.trim();

    // 1. Validar código
    if (!/^\d+$/.test(code)) {
      throw new InvalidAccountError(
        "El código debe ser numérico",
      );
    }

    const level = getAccountLevel(code);

    if (!level) {
      throw new InvalidAccountError(
        "El código debe tener 1, 2, 4 o 6 dígitos",
      );
    }

    // 2. Validar nombre
    if (!name) {
      throw new InvalidAccountError(
        "El nombre de la cuenta es obligatorio",
      );
    }

    // 3. Verificar duplicados
    const existingAccount =
      await this.repository.findByCode(code);

    if (existingAccount) {
      throw new AccountAlreadyExistsError(code);
    }

    // 4. Resolver padre y naturaleza
    const parentCode = getParentCode(code);
    let accountNature: Account["nature"];

    if (parentCode === null) {
      if (nature !== "DEBIT" && nature !== "CREDIT") {
        throw new InvalidAccountError(
          "Las clases deben tener naturaleza DEBIT o CREDIT",
        );
      }

      accountNature = nature;
    } else {
      if (nature !== undefined) {
        throw new InvalidAccountError(
          "Las cuentas hijas heredan la naturaleza del padre",
        );
      }

      const parent =
        await this.repository.findByCode(parentCode);

      if (!parent) {
        throw new AccountParentNotFoundError(parentCode);
      }

      accountNature = parent.nature;
    }

    // 5. Construir entidad
    const account: Account = {
      code,
      name,
      level,
      parentCode,
      nature: accountNature,
    };

    // 6. Persistir
    await this.repository.save(account);

    return account;
  }
}
