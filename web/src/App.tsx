import { useState } from "react";

import { AccountTree } from "./features/accounts/components/AccountTree";
import { CreateAccountForm } from "./features/accounts/components/CreateAccountForm";
import { useAccountsTree } from "./features/accounts/hooks/useAccountTree";

export default function App() {
  const { accounts, isLoading, error, refetch } = useAccountsTree();

  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleAccountCreated = () => {
    setSuccessMessage("La cuenta contable se creó correctamente.");
    refetch();
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Navegación superior */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-blue-700 text-xl font-bold text-white">
              A
            </div>

            <div>
              <p className="text-xl font-bold tracking-tight text-slate-900">
                aravia
              </p>
              <p className="text-[11px] font-medium text-slate-400">
                Gestión contable
              </p>
            </div>
          </div>

          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600">
            Catálogo contable
          </span>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="mx-auto max-w-7xl px-6 py-10">
        {/* Breadcrumb */}
        <nav
          aria-label="Ubicación actual"
          className="mb-6 text-xs font-medium text-slate-400"
        >
          Contabilidad
          <span className="mx-2 text-slate-300">/</span>
          <span className="text-slate-700">Catálogo de cuentas</span>
        </nav>

        {/* Encabezado */}
        <div className="mb-8 flex flex-wrap items-start justify-between gap-5">
          <div>
            <span className="mb-3 inline-flex items-center rounded-md bg-blue-50 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-blue-700 uppercase">
              Plan de cuentas
            </span>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Catálogo de cuentas
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Administra tu catálogo contable, registra nuevas cuentas y
              consulta su estructura jerárquica por clases, grupos, cuentas y
              subcuentas.
            </p>
          </div>

          <button
            type="button"
            onClick={refetch}
            disabled={isLoading}
            className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? "Actualizando..." : "Actualizar catálogo"}
          </button>
        </div>

        {/* Confirmación de creación */}
        {successMessage && (
          <div
            role="status"
            className="mb-6 flex items-center justify-between gap-4 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4"
          >
            <div>
              <p className="text-sm font-semibold text-emerald-800">
                Cuenta creada
              </p>

              <p className="mt-1 text-sm text-emerald-700">{successMessage}</p>
            </div>

            <button
              type="button"
              onClick={() => setSuccessMessage(null)}
              aria-label="Cerrar notificación"
              className="cursor-pointer rounded-lg px-2 py-1 text-sm font-semibold text-emerald-700 hover:bg-emerald-100"
            >
              Cerrar
            </button>
          </div>
        )}

        {/* Formulario y catálogo */}
        <section
          aria-label="Administración de cuentas contables"
          className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[360px_minmax(0,1fr)]"
        >
          {/* Formulario de creación */}
          <div className="min-w-0">
            <CreateAccountForm onCreated={handleAccountCreated} />
          </div>

          {/* Árbol del catálogo */}
          <div className="min-w-0">
            {isLoading ? (
              <div
                role="status"
                className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm"
              >
                <div className="mx-auto mb-5 h-1.5 w-32 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full w-1/2 animate-pulse rounded-full bg-blue-500" />
                </div>

                <h2 className="text-base font-semibold text-slate-800">
                  Cargando catálogo
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Estamos consultando la estructura de tus cuentas.
                </p>
              </div>
            ) : error ? (
              <div
                role="alert"
                className="rounded-2xl border border-red-200 bg-white px-6 py-14 text-center shadow-sm"
              >
                <span className="mb-4 inline-block rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
                  Error de conexión
                </span>

                <h2 className="text-lg font-semibold text-slate-900">
                  No pudimos cargar el catálogo
                </h2>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={refetch}
                  className="mt-6 cursor-pointer rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-800"
                >
                  Intentar nuevamente
                </button>
              </div>
            ) : (
              <AccountTree accounts={accounts} />
            )}
          </div>
        </section>

        {/* Pie de página */}
        <footer className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-6">
          <p className="text-xs text-slate-400">Aravia · Gestión contable</p>

          <p className="text-xs text-slate-400">Catálogo de cuentas</p>
        </footer>
      </main>
    </div>
  );
}
