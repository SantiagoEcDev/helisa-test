import { useMemo, useState } from "react";

import { AccountTreeNode } from "./AccountTreeNode";
import type { AccountTreeNode as AccountNode } from "../types/account.types";

interface AccountTreeProps {
  accounts: AccountNode[];
}

function flattenAccounts(accounts: AccountNode[]): AccountNode[] {
  return accounts.flatMap((account) => [
    account,
    ...flattenAccounts(account.children),
  ]);
}

export function AccountTree({ accounts }: AccountTreeProps) {
  const allAccounts = useMemo(() => flattenAccounts(accounts), [accounts]);

  const expandableCodes = useMemo(
    () =>
      allAccounts
        .filter((account) => account.children.length > 0)
        .map((account) => account.code),
    [allAccounts],
  );

  const [expandedCodes, setExpandedCodes] = useState<Set<string>>(
    () => new Set(expandableCodes),
  );

  const totalAccounts = allAccounts.length;

  const totalClasses = allAccounts.filter(
    (account) => account.level === "CLASS",
  ).length;

  const totalLevels = new Set(allAccounts.map((account) => account.level)).size;

  const toggleAccount = (code: string) => {
    setExpandedCodes((current) => {
      const next = new Set(current);

      if (next.has(code)) {
        next.delete(code);
      } else {
        next.add(code);
      }

      return next;
    });
  };

  const expandAll = () => {
    setExpandedCodes(new Set(expandableCodes));
  };

  const collapseAll = () => {
    setExpandedCodes(new Set());
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Encabezado */}
      <div className="border-b border-slate-100 px-6 py-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-slate-900">
              Árbol de cuentas
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Explora la estructura contable organizada por niveles.
            </p>
          </div>

          <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
            {totalAccounts} cuentas
          </span>
        </div>

        {/* Estadísticas y acciones */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600">
              {totalClasses} clases
            </span>

            <span className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600">
              {totalLevels} niveles
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={expandAll}
              disabled={expandedCodes.size === expandableCodes.length}
              className="cursor-pointer rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Expandir todo
            </button>

            <button
              type="button"
              onClick={collapseAll}
              disabled={expandedCodes.size === 0}
              className="cursor-pointer rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Colapsar todo
            </button>
          </div>
        </div>
      </div>

      {/* Encabezado de columnas */}
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-6 py-3">
        <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
          Cuenta contable
        </span>

        <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
          Naturaleza
        </span>
      </div>

      {/* Contenido */}
      <div className="px-3 py-3">
        {accounts.length > 0 ? (
          <ul className="space-y-1">
            {accounts.map((account) => (
              <AccountTreeNode
                key={account.code}
                account={account}
                depth={0}
                expandedCodes={expandedCodes}
                onToggle={toggleAccount}
              />
            ))}
          </ul>
        ) : (
          <div className="px-6 py-16 text-center">
            <p className="text-sm font-medium text-slate-700">
              No hay cuentas registradas
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Las cuentas aparecerán aquí cuando sean creadas.
            </p>
          </div>
        )}
      </div>

      {/* Pie */}
      <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 bg-slate-50/40 px-6 py-4">
        <span className="text-xs text-slate-400">
          Catálogo de cuentas contables
        </span>

        <span className="text-xs font-medium text-slate-500">
          {totalAccounts} cuentas registradas
        </span>
      </footer>
    </section>
  );
}
