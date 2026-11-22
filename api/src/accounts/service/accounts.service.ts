import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Account, AccountLevel } from "../interfaces/account.inteface.js";
import { CreateAccountDto } from "../dto/create-account.dto.js";



@Injectable()
export class AccountsService {
  private readonly accounts: Account[] = [];

  create(dto: CreateAccountDto): Account {
    const { code, nature } = dto;
    const name = dto.name.trim();

    // 1. Validar el nombre
    if (!name) {
      throw new BadRequestException(
        "El nombre no puede estar vacío",
      );
    }

    // 2. Validar que el código no exista
    const exists = this.accounts.some(
      (account) => account.code === code,
    );

    if (exists) {
      throw new ConflictException(
        `La cuenta con código ${code} ya existe`,
      );
    }

    // 3. Determinar el nivel de la cuenta
    const level = this.getLevel(code);

    // 4. Obtener el código del padre
    const parentCode = this.getParentCode(code);

    // 5. Resolver la naturaleza
    let accountNature: Account["nature"];

    if (parentCode === null) {
      if (!nature) {
        throw new BadRequestException(
          "Las cuentas de nivel clase deben tener una naturaleza",
        );
      }

      accountNature = nature;
    } else {
      if (nature !== undefined) {
        throw new BadRequestException(
          "La naturaleza de una cuenta hija se hereda de su padre",
        );
      }

      const parent = this.accounts.find(
        (account) => account.code === parentCode,
      );

      if (!parent) {
        throw new NotFoundException(
          `La cuenta padre ${parentCode} no existe`,
        );
      }

      accountNature = parent.nature;
    }

    // 6. Crear la cuenta
    const account: Account = {
      code,
      name,
      level,
      parentCode,
      nature: accountNature,
    };

    // 7. Guardar en memoria
    this.accounts.push(account);

    return account;
  }

  private getLevel(code: string): AccountLevel {
    const levels: Record<number, AccountLevel> = {
      1: "CLASS",
      2: "GROUP",
      4: "ACCOUNT",
      6: "SUBACCOUNT",
    };

    const level = levels[code.length];

    if (!level) {
      throw new BadRequestException(
        "Longitud de código inválida",
      );
    }

    return level;
  }

  private getParentCode(code: string): string | null {
    const parentLengths: Record<number, number> = {
      2: 1,
      4: 2,
      6: 4,
    };

    const parentLength = parentLengths[code.length];

    if (!parentLength) {
      return null;
    }

    return code.slice(0, parentLength);
  }
}