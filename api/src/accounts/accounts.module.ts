
import { Module } from "@nestjs/common";


import { InMemoryAccountRepository } from "./infrastructure/persistence/in-memory-account.repository.js";

import {
  ACCOUNT_REPOSITORY,
  type AccountRepository,
} from "./domain/repositories/account.repository.js";
import { AccountsController } from "./presentation/controllers/account.controller.js";
import { CreateAccountUseCase } from "./applications/uses-cases/create-account.use-case.js";
import { DeleteAccountUseCase } from "./applications/uses-cases/delete-account.use-case.js";
import { GetAccountsTreeUseCase } from "./applications/uses-cases/get-accounts-tree.use-case.js";

@Module({
  controllers: [AccountsController],
  providers: [
    {
      provide: ACCOUNT_REPOSITORY,
      useClass: InMemoryAccountRepository,
    },
    {
      provide: CreateAccountUseCase,
      useFactory: (repository: AccountRepository) =>
        new CreateAccountUseCase(repository),
      inject: [ACCOUNT_REPOSITORY],
    },
    {
      provide: GetAccountsTreeUseCase,
      useFactory: (repository: AccountRepository) =>
        new GetAccountsTreeUseCase(repository),
      inject: [ACCOUNT_REPOSITORY],
    },
    {
      provide: DeleteAccountUseCase,
      useFactory: (repository: AccountRepository) =>
        new DeleteAccountUseCase(repository),
      inject: [ACCOUNT_REPOSITORY],
    },
  ],
})
export class AccountsModule {}
