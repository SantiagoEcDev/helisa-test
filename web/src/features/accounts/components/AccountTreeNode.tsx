import type { AccountTreeNode as AccountNode } from "../types/account.types";

interface AccountTreeNodeProps {
  account: AccountNode;
  depth: number;
  expandedCodes: Set<string>;
  onToggle: (code: string) => void;
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
}: AccountTreeNodeProps) {
  const hasChildren = account.children.length > 0;
  const isExpanded = expandedCodes.has(account.code);
  const isRoot = depth === 0;
  const isDebit = account.nature === "DEBIT";

  const content = (
    <div className="flex min-w-0 flex-1 items-center justify-between gap-4">
      <div className="flex min-w-0 items-center gap-3">
        {/* Indicador de expansión */}
        <span
          aria-hidden="true"
          className={`
            flex size-7 shrink-0 items-center justify-center
            rounded-lg border text-sm font-medium
            transition-all duration-200
            ${
              hasChildren
                ? "border-slate-200 bg-white text-slate-600 group-hover:border-blue-200 group-hover:text-blue-600"
                : "border-transparent bg-slate-50 text-slate-300"
            }
          `}
        >
          {hasChildren ? (isExpanded ? "−" : "+") : "·"}
        </span>

        {/* Información de la cuenta */}
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span
              className={`
                font-mono text-sm font-semibold tracking-tight
                ${isRoot ? "text-blue-700" : "text-slate-800"}
              `}
            >
              {account.code}
            </span>

            <span
              className={`
                text-sm
                ${
                  isRoot
                    ? "font-semibold text-slate-900"
                    : "font-medium text-slate-700"
                }
              `}
            >
              {account.name}
            </span>
          </div>

          <p className="mt-1 text-xs text-slate-400">
            {levelLabels[account.level]}
          </p>
        </div>
      </div>

      {/* Naturaleza */}
      <span
        className={`
          shrink-0 rounded-full px-3 py-1
          text-xs font-medium
          ${isDebit ? "bg-blue-50 text-blue-700" : "bg-amber-50 text-amber-700"}
        `}
      >
        {isDebit ? "Débito" : "Crédito"}
      </span>
    </div>
  );

  const rowClassName = `
    group flex w-full items-center rounded-xl
    border border-transparent px-4 py-3.5
    text-left transition-colors duration-200
    ${
      isRoot
        ? "bg-slate-50/80 hover:bg-slate-100"
        : "hover:border-slate-100 hover:bg-slate-50"
    }
  `;

  return (
    <li>
      {hasChildren ? (
        <button
          type="button"
          aria-expanded={isExpanded}
          aria-label={`${isExpanded ? "Contraer" : "Expandir"} ${account.name}`}
          onClick={() => onToggle(account.code)}
          className={`${rowClassName} cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500`}
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
            />
          ))}
        </ul>
      )}
    </li>
  );
}
