
import { z } from "zod";

export const createAccountSchema = z
  .object({
    code: z
      .string()
      .trim()
      .regex(/^(?:\d{1}|\d{2}|\d{4}|\d{6})$/, {
        message:
          "El código debe tener 1, 2, 4 o 6 dígitos numéricos.",
      }),

    name: z
      .string()
      .trim()
      .min(1, "El nombre es obligatorio."),

    nature: z.union([
      z.literal(""),
      z.enum(["DEBIT", "CREDIT"]),
    ]),
  })
  .superRefine((data, ctx) => {
    const isClass = data.code.length === 1;

    if (isClass && !data.nature) {
      ctx.addIssue({
        code: "custom",
        path: ["nature"],
        message: "Selecciona la naturaleza de la clase.",
      });
    }

    if (!isClass && data.nature) {
      ctx.addIssue({
        code: "custom",
        path: ["nature"],
        message:
          "La naturaleza se hereda de la cuenta padre.",
      });
    }
  });

export type CreateAccountFormValues = z.infer<
  typeof createAccountSchema
>;
