import { apiGet, apiPost } from "../../../shared/lib/api";
import type { Account, AccountNature, AccountTreeNode } from "../types/account.types";

export interface CreateAccountInput {
  code: string;
  name: string;
  nature?: AccountNature;
}

export const accountsService = {
  getTree(signal?: AbortSignal): Promise<AccountTreeNode[]> {
    return apiGet<AccountTreeNode[]>("/accounts/tree", signal);
  },
  createAccount(data: CreateAccountInput): Promise<Account> {
    return apiPost<Account, CreateAccountInput>("/accounts", data);
  },
};
