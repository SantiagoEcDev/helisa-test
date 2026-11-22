import { useState } from "react";

import { ApiError } from "../../../shared/lib/api";
import type { AccountTreeNode as AccountNode } from "../types/account.types";

interface AccountTreeNodeProps {
  account: AccountNode;
  depth: number;
  expandedCodes: Set<string>;
  onToggle: (code: string) => void;
  onDelete: (code: string) => Promise<void>;
  deletingCode: string | null;
}

const levelLabels = {
  CLASS: "Clase",
  GROUP: "Grupo",
  ACCOUNT: "Cuenta",
  SUBACCOUNT: "Subcuenta",
} as const;

export function AccountTreeNode({
  account,
  depth,
  expandedCodes,
  onToggle,
  onDelete,
  deletingCode,
}: AccountTreeNodeProps) {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const [deleteError, setDeleteError] = useState<string | null>(null);

  const hasChildren = account.children.length > 0;
  const isExpanded = expandedCodes.has(account.code);
  const isRoot = depth === 0;
  const isDebit = account.nature === "DEBIT";
  const isDeleting = deletingCode === account.code;
  const isBusy = deletingCode !== null;

  const handleDelete = async () => {
    setDeleteError(null);

    try {
      await onDelete(account.code);
      setShowConfirmation(false);
    } catch (error) {
      if (error instanceof ApiError) {
        setDeleteError(error.messages.join(". "));
      } else {
        setDeleteError("No se pudo eliminar la cuenta. Inténtalo nuevamente.");
      }
    }
  };

  const rowClassName = `
    group flex min-w-0 flex-1 items-center rounded-xl
    border border-transparent px-4 py-3.5
    text-left transition-colors duration-200
    ${
      isRoot
        ? "bg-slate-50/80 hover:bg-slate-100"
        : "hover:border-slate-100 hover:bg-slate-50"
    }
  `;

  const content = (
    <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-3">
        <span
          aria-hidden="true"
          className={`flex size-7 shrink-0 items-center justify-center rounded-lg border text-sm font-medium ${
            hasChildren
              ? "border-slate-200 bg-white text-slate-600"
              : "border-transparent bg-slate-50 text-slate-300"
          }`}
        >
          {hasChildren ? (isExpanded ? "−" : "+") : "·"}
        </span>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span
              className={`font-mono text-sm font-semibold ${
                isRoot ? "text-blue-700" : "text-slate-800"
              }`}
            >
              {account.code}
            </span>

            <span
              className={`text-sm ${
                isRoot
                  ? "font-semibold text-slate-900"
                  : "font-medium text-slate-700"
              }`}
            >
              {account.name}
            </span>
          </div>

          <p className="mt-1 text-xs text-slate-400">
            {levelLabels[account.level]}
          </p>
        </div>
      </div>

      <span
        className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
          isDebit ? "bg-blue-50 text-blue-700" : "bg-amber-50 text-amber-700"
        }`}
      >
        {isDebit ? "Débito" : "Crédito"}
      </span>
    </div>
  );

  return (
    <li>
      <div className="flex min-w-0 items-center gap-2">
        {/* Información de la cuenta */}
        {hasChildren ? (
          <button
            type="button"
            aria-expanded={isExpanded}
            onClick={() => onToggle(account.code)}
            className={`${rowClassName} cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-500`}
            style={{
              paddingLeft: `${depth * 24 + 16}px`,
            }}
          >
            {content}
          </button>
        ) : (
          <div
            className={rowClassName}
            style={{
              paddingLeft: `${depth * 24 + 16}px`,
            }}
          >
            {content}
          </div>
        )}

        {/* Acción de eliminación */}
        <div className="shrink-0 pr-3">
          {hasChildren ? (
            <span
              title="No se puede eliminar una cuenta con hijas"
              className="text-xs text-slate-400"
            >
              Tiene hijas
            </span>
          ) : (
            <button
              type="button"
              disabled={isBusy}
              onClick={() => {
                setDeleteError(null);
                setShowConfirmation((current) => !current);
              }}
              className="cursor-pointer rounded-lg border border-red-100 px-3 py-2 text-xs font-medium text-red-600 transition-colors hover:border-red-200 hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-red-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Eliminar
            </button>
          )}
        </div>
      </div>

      {/* Confirmación de eliminación */}
      {showConfirmation && !hasChildren && (
        <div
          className="my-2 mr-3 rounded-xl border border-red-200 bg-red-50/60 p-4"
          style={{
            marginLeft: `${depth * 24 + 16}px`,
          }}
        >
          <p className="text-sm font-semibold text-slate-900">
            ¿Eliminar esta cuenta?
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-600">
            Se eliminará la cuenta {account.code} — {account.name}. Esta acción
            no se puede deshacer.
          </p>

          {deleteError && (
            <p
              role="alert"
              className="mt-3 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs text-red-700"
            >
              {deleteError}
            </p>
          )}

          <div className="mt-4 flex flex-wrap justify-end gap-2">
            <button
              type="button"
              disabled={isBusy}
              onClick={() => {
                setShowConfirmation(false);
                setDeleteError(null);
              }}
              className="cursor-pointer rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              Cancelar
            </button>

            <button
              type="button"
              disabled={isBusy}
              onClick={() => void handleDelete()}
              className="cursor-pointer rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-red-700 focus-visible:outline-2 focus-visible:outline-red-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isDeleting ? "Eliminando..." : "Confirmar eliminación"}
            </button>
          </div>
        </div>
      )}

      {/* Cuentas hijas */}
      {hasChildren && isExpanded && (
        <ul className="space-y-0.5">
          {account.children.map((child) => (
            <AccountTreeNode
              key={child.code}
              account={child}
              depth={depth + 1}
              expandedCodes={expandedCodes}
              onToggle={onToggle}
              onDelete={onDelete}
              deletingCode={deletingCode}
            />
          ))}
        </ul>
      )}
    </li>
  );
}
