import { Module } from "@nestjs/common";
import { AccountsService } from "../service/accounts.service.js";
import { AccountsController } from "../controllers/account.controller.js";


@Module({
  controllers: [AccountsController],
  providers: [AccountsService],
})
export class AccountsModule {}