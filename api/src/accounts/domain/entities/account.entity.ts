
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

export interface AccountTree extends Account {
  children: AccountTree[];
}

export interface CreateAccountInput {
  code: string;
  name: string;
  nature?: AccountNature;
}

const LEVEL_BY_LENGTH: Record<number, AccountLevel> = {
  1: "CLASS",
  2: "GROUP",
  4: "ACCOUNT",
  6: "SUBACCOUNT",
};

const PARENT_LENGTH: Record<number, number> = {
  2: 1,
  4: 2,
  6: 4,
};

export function getAccountLevel(code: string): AccountLevel | null {
  return LEVEL_BY_LENGTH[code.length] ?? null;
}

export function getParentCode(code: string): string | null {
  const length = PARENT_LENGTH[code.length];

  return length === undefined
    ? null
    : code.slice(0, length);
}
