import { useState } from "react";
import { accountsService } from "../services/account.service";

export function useDeleteAccount() {
  const [deletingCode, setDeletingCode] = useState<string | null>(null);

  const deleteAccount = async (code: string): Promise<void> => {
    if (deletingCode !== null) {
      return;
    }

    setDeletingCode(code);

    try {
      await accountsService.deleteAccount(code);
    } finally {
      setDeletingCode(null);
    }
  };

  return {
    deleteAccount,
    deletingCode,
  };
}
