
import { AccountHasChildrenError, AccountNotFoundError } from "../../domain/errors/account.error.js";
import type {
  AccountRepository,
} from "../../domain/repositories/account.repository.js";


export class DeleteAccountUseCase {
  constructor(
    private readonly repository: AccountRepository,
  ) {}

  async execute(code: string): Promise<void> {
    const account = await this.repository.findByCode(code);

    if (!account) {
      throw new AccountNotFoundError(code);
    }

    const hasChildren = await this.repository.hasChildren(code);

    if (hasChildren) {
      throw new AccountHasChildrenError(code);
    }

    await this.repository.delete(code);
  }
}
