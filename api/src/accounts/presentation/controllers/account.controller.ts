
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseFilters,
} from "@nestjs/common";


import { CreateAccountDto } from "../dto/create-account.dto.js";
import { AccountExceptionFilter } from "../filters/account-exception.filter.js";

import type {
  Account,
  AccountTree,
} from "../../domain/entities/account.entity.js";
import { CreateAccountUseCase } from "../../applications/uses-cases/create-account.use-case.js";
import { DeleteAccountUseCase } from "../../applications/uses-cases/delete-account.use-case.js";
import { GetAccountsTreeUseCase } from "../../applications/uses-cases/get-accounts-tree.use-case.js";

@Controller("accounts")
@UseFilters(AccountExceptionFilter)
export class AccountsController {
  constructor(
    private readonly createAccountUseCase: CreateAccountUseCase,
    private readonly getAccountsTreeUseCase: GetAccountsTreeUseCase,
    private readonly deleteAccountUseCase: DeleteAccountUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateAccountDto): Promise<Account> {
    return this.createAccountUseCase.execute(dto);
  }

  @Get("tree")
  findTree(): Promise<AccountTree[]> {
    return this.getAccountsTreeUseCase.execute();
  }

  @Delete(":code")
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param("code") code: string): Promise<void> {
    return this.deleteAccountUseCase.execute(code);
  }
}
