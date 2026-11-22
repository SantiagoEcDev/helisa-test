
import { Injectable } from "@nestjs/common";

import type {
  Account,
} from "../../domain/entities/account.entity.js";

import type {
  AccountRepository,
} from "../../domain/repositories/account.repository.js";

@Injectable()
export class InMemoryAccountRepository
  implements AccountRepository
{
  private readonly accounts = new Map<string, Account>();

  async findAll(): Promise<Account[]> {
    return [...this.accounts.values()];
  }

  async findByCode(code: string): Promise<Account | null> {
    return this.accounts.get(code) ?? null;
  }

  async hasChildren(code: string): Promise<boolean> {
    return [...this.accounts.values()].some(
      (account) => account.parentCode === code,
    );
  }

  async save(account: Account): Promise<void> {
    this.accounts.set(account.code, account);
  }

  async delete(code: string): Promise<void> {
    this.accounts.delete(code);
  }
}
