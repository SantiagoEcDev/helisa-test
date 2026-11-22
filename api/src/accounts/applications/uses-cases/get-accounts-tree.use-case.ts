
import type {
  AccountTree,
} from "../../domain/entities/account.entity.js";

import type {
  AccountRepository,
} from "../../domain/repositories/account.repository.js";

export class GetAccountsTreeUseCase {
  constructor(
    private readonly repository: AccountRepository,
  ) {}

  async execute(): Promise<AccountTree[]> {
    const accounts = await this.repository.findAll();

    const sortedAccounts = [...accounts].sort((a, b) =>
      a.code.localeCompare(b.code),
    );

    const accountMap = new Map<string, AccountTree>();
    const roots: AccountTree[] = [];

    // Crear nodos independientes
    for (const account of sortedAccounts) {
      accountMap.set(account.code, {
        ...account,
        children: [],
      });
    }

    // Construir relaciones
    for (const account of sortedAccounts) {
      const node = accountMap.get(account.code)!;

      if (account.parentCode === null) {
        roots.push(node);
        continue;
      }

      const parent = accountMap.get(account.parentCode);

      if (parent) {
        parent.children.push(node);
      }
    }

    return roots;
  }
}
