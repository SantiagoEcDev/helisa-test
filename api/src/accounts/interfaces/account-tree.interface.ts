import { Account } from "./account.inteface.js";

export interface AccountTree extends Account {
  children: AccountTree[];
}