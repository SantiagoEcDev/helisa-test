import { Module } from "@nestjs/common";
import { AccountsModule } from "./accounts/accounts.module.js";

@Module({
  imports: [AccountsModule],
})
export class AppModule {}