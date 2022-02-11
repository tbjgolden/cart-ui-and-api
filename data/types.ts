import { $ } from "data/_base";

export type JSONChild =
  | { [key: string]: JSONChild }
  | JSONChild[]
  | number
  | string
  | boolean
  | null;
export type JSONValue = { [key: string]: JSONChild } | JSONChild[];

export type StorableCredentials = {
  id: string;
  token: string;
  admin?: boolean;
};

export type ServerUser = {
  id: string;
  email: string;
  createdAt: string;
  salt: string;
  hash: string;
  token: string;
};
export type UserHiddenFields = "salt" | "hash" | "token";
export type ClientUser = Omit<ServerUser, UserHiddenFields>;
export const DatabaseUser = $<ServerUser, UserHiddenFields>("users", {
  uniqueFields: {
    email: 1,
    token: 1,
  },
  immutableFields: {
    salt: 1,
    hash: 1,
    createdAt: 1,
  },
  hiddenFields: {
    salt: 1,
    hash: 1,
    token: 1,
  },
  normalize: {
    email: (input: string): string => input.trim().toLowerCase(),
  },
  validation: {},
});

export type Errors = {
  UNAUTHORIZED_UNKNOWN?: boolean;
  UNAUTHORIZED_KNOWN?: boolean;
  NOT_FOUND?: boolean;
  METHOD_NOT_ALLOWED?: boolean;
  //
  INVALID_FIELDS?: string[];
};

export type Fetchable<T> = {
  value: T | null;
  errors: Errors;
};
