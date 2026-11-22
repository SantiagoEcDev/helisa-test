import { useEffect, useState } from "react";

import type { AccountTreeNode } from "../types/account.types";
import { accountsService } from "../services/account.service";

export function useAccountsTree() {
  const [accounts, setAccounts] = useState<AccountTreeNode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadAccounts() {
      setIsLoading(true);
      setError(null);

      try {
        console.log("Consultando catálogos de cuentas...");
        const data = await accountsService.getTree(controller.signal);

        if (!controller.signal.aborted) {
          setAccounts(data);
        }
      } catch {
        if (!controller.signal.aborted) {
          setError("No se pudo cargar el catálogo de cuentas.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    void loadAccounts();

    return () => controller.abort();
  }, [retryKey]);

  const refetch = () => {
    setRetryKey((current) => current + 1);
  };

  return {
    accounts,
    isLoading,
    error,
    refetch,
  };
}
