import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";



import { ApiError } from "../../../shared/lib/api";
import { createAccountSchema, type CreateAccountFormValues } from "../schemas/create-account-schema";
import { accountsService } from "../services/account.service";

interface CreateAccountFormProps {
  onCreated: () => void;
}

const inputClassName =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10";

const labelClassName = "mb-2 block text-sm font-semibold text-slate-700";

function getErrorField(message: string): keyof CreateAccountFormValues | null {
  const normalized = message.toLowerCase();

  if (/naturaleza|nature/.test(normalized)) {
    return "nature";
  }

  if (/nombre|name/.test(normalized)) {
    return "name";
  }

  if (/código|codigo|code|padre|duplicad|ya existe/.test(normalized)) {
    return "code";
  }

  return null;
}

export function CreateAccountForm({ onCreated }: CreateAccountFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<CreateAccountFormValues>({
    resolver: zodResolver(createAccountSchema),
    defaultValues: {
      code: "",
      name: "",
      nature: "",
    },
  });

  const code = watch("code");
  const isClass = /^\d$/.test(code.trim());

  const onSubmit = async (values: CreateAccountFormValues) => {
    setServerError(null);

    try {
      const payload = {
        code: values.code.trim(),
        name: values.name.trim(),
        ...(values.code.trim().length === 1
          ? { nature: values.nature as "DEBIT" | "CREDIT" }
          : {}),
      };

      await accountsService.createAccount(payload);

      reset();
      onCreated();
    } catch (error) {
      if (error instanceof ApiError) {
        const generalMessages: string[] = [];

        for (const message of error.messages) {
          const field = getErrorField(message);

          if (field) {
            setError(field, {
              type: "server",
              message,
            });
          } else {
            generalMessages.push(message);
          }
        }

        if (generalMessages.length > 0) {
          setServerError(generalMessages.join(". "));
        }

        return;
      }

      setServerError(
        "No se pudo conectar con el servidor. Inténtalo nuevamente.",
      );
    }
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-6 py-5">
        <h2 className="text-lg font-semibold tracking-tight text-slate-900">
          Nueva cuenta
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Completa la información para registrar una cuenta contable.
        </p>
      </div>

      <form
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 p-6"
      >
        {/* Código */}
        <div>
          <label htmlFor="account-code" className={labelClassName}>
            Código de la cuenta
            <span className="ml-1 text-red-500">*</span>
          </label>

          <input
            id="account-code"
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="Ej. 1105"
            aria-invalid={!!errors.code}
            aria-describedby={errors.code ? "code-error" : "code-help"}
            {...register("code", {
              onChange: () => {
                clearErrors("code");
              },
            })}
            className={`${inputClassName} ${
              errors.code
                ? "border-red-400 focus:border-red-500 focus:ring-red-500/10"
                : ""
            }`}
          />

          {errors.code ? (
            <p
              id="code-error"
              role="alert"
              className="mt-2 text-xs text-red-600"
            >
              {errors.code.message}
            </p>
          ) : (
            <p id="code-help" className="mt-2 text-xs leading-5 text-slate-400">
              Utiliza 1, 2, 4 o 6 dígitos numéricos.
            </p>
          )}
        </div>

        {/* Nombre */}
        <div>
          <label htmlFor="account-name" className={labelClassName}>
            Nombre de la cuenta
            <span className="ml-1 text-red-500">*</span>
          </label>

          <input
            id="account-name"
            type="text"
            placeholder="Ej. Caja general"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
            {...register("name", {
              onChange: () => clearErrors("name"),
            })}
            className={`${inputClassName} ${
              errors.name
                ? "border-red-400 focus:border-red-500 focus:ring-red-500/10"
                : ""
            }`}
          />

          {errors.name && (
            <p
              id="name-error"
              role="alert"
              className="mt-2 text-xs text-red-600"
            >
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Naturaleza */}
        <div>
          <label
            htmlFor={isClass ? "account-nature" : undefined}
            className={labelClassName}
          >
            Naturaleza
            {isClass && <span className="ml-1 text-red-500">*</span>}
          </label>

          {isClass ? (
            <>
              <select
                id="account-nature"
                aria-invalid={!!errors.nature}
                aria-describedby={errors.nature ? "nature-error" : undefined}
                {...register("nature", {
                  onChange: () => clearErrors("nature"),
                })}
                className={inputClassName}
              >
                <option value="">Selecciona una naturaleza</option>
                <option value="DEBIT">Débito</option>
                <option value="CREDIT">Crédito</option>
              </select>

              {errors.nature && (
                <p
                  id="nature-error"
                  role="alert"
                  className="mt-2 text-xs text-red-600"
                >
                  {errors.nature.message}
                </p>
              )}
            </>
          ) : (
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-sm font-medium text-slate-600">
                Naturaleza heredada
              </p>
              <p className="mt-1 text-xs leading-5 text-slate-400">
                Las cuentas hijas heredan automáticamente la naturaleza de su
                cuenta padre.
              </p>
            </div>
          )}
        </div>

        {/* Error general */}
        {serverError && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700"
          >
            {serverError}
          </div>
        )}

        {/* Acciones */}
        <div className="border-t border-slate-100 pt-5">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full cursor-pointer rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
          </button>

          <p className="mt-3 text-center text-xs leading-5 text-slate-400">
            Las cuentas deben registrarse siguiendo su estructura jerárquica.
          </p>
        </div>
      </form>
    </section>
  );
}
