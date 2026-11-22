export type AccountNature = "DEBIT" | "CREDIT";

export type AccountLevel =
  | "CLASS"
  | "GROUP"
  | "ACCOUNT"
  | "SUBACCOUNT";

export interface Account {
  code: string;
  name: string;
  level: AccountLevel;
  parentCode: string | null;
  nature: AccountNature;
}