import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from "class-validator";
import type { AccountNature } from "../interfaces/account.inteface.js";


export class CreateAccountDto {
  @IsString()
  @Matches(/^(?:\d{1}|\d{2}|\d{4}|\d{6})$/, {
    message: "El código debe ser numérico y tener 1, 2, 4 o 6 dígitos",
  })
  code: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsIn(["DEBIT", "CREDIT"])
  nature?: AccountNature;
}