import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from "@nestjs/common";
import { AccountsService } from "../service/accounts.service.js";
import { CreateAccountDto } from "../dto/create-account.dto.js";


@Controller("accounts")
export class AccountsController {
  constructor(
    private readonly accountsService: AccountsService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateAccountDto) {
    return this.accountsService.create(dto);
  }
}