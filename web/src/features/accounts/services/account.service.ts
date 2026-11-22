import { apiGet } from "../../../shared/lib/api";
import type { AccountTreeNode } from "../types/account.types";

export const accountsService = { 
  getTree(signal?: AbortSignal): Promise<AccountTreeNode[]> {
    return apiGet<AccountTreeNode[]>("/accounts/tree", signal);
  },
};
