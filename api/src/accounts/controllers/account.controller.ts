
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from "@nestjs/common";

import { AccountsService } from "../service/accounts.service.js";
import { CreateAccountDto } from "../dto/create-account.dto.js";
import type { AccountTree } from "../interfaces/account-tree.interface.js";
import type { Account } from "../interfaces/account.inteface.js";

@Controller("accounts")
export class AccountsController {
  constructor(
    private readonly accountsService: AccountsService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateAccountDto): Account {
    return this.accountsService.create(dto);
  }

  @Get("tree")
  findTree(): AccountTree[] {
    return this.accountsService.findTree();
  }
}
