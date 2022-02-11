import { v4 as uuidv4 } from "uuid";
import Redis from "ioredis";
import { Fetchable } from "./types";

const client = new Redis({ showFriendlyErrorStack: true });

type Config<T extends { id: string }, U extends keyof Omit<T, "id">> = {
  uniqueFields: {
    [P in keyof Omit<T, "id">]?: 1;
  };
  immutableFields: {
    [P in keyof Omit<T, "id">]?: 1;
  };
  hiddenFields: {
    [P in U]?: 1;
  };
  normalize: {
    [Property in keyof Omit<T, "id">]?: (input: T[Property]) => T[Property];
  };
  validation: {
    [Property in keyof Omit<T, "id">]?: (input: unknown) => boolean;
  };
};

export enum DatabaseError {
  AlreadyExists = 0,
  DoesNotExist = 1,
  UniqueFieldAlreadyExists = 2,
  FindRequiresUniqueField = 3,
}

export type ValidationErrors = string[];

export const $ = <T extends { id: string }, U extends keyof Omit<T, "id">>(
  key: string,
  config: Partial<Config<T, U>> = {}
) => {
  const mergedConfig: Config<T, U> = {
    uniqueFields: {},
    immutableFields: {},
    hiddenFields: {},
    normalize: {},
    validation: {},
    ...config,
  };

  const normalizeFields = <V extends Partial<T> = Partial<T>>(obj: V): V => {
    const newObj: Partial<V> = {};
    for (const key in obj) {
      if (key in mergedConfig.normalize) {
        const normalize = mergedConfig.normalize[key] as any;
        if (typeof normalize === "function") {
          newObj[key] = normalize(obj[key]);
          continue;
        }
      }
      newObj[key] = obj[key];
    }
    return newObj as V;
  };

  const validateFields = (obj: T): ValidationErrors => {
    const errors: ValidationErrors = [];
    for (const key in obj) {
      if (key in mergedConfig.validation) {
        const validate = mergedConfig.validation[key] as any;
        if (typeof validate === "function") {
          if (!validate(obj[key])) {
            errors.push(key);
          }
        }
      }
    }
    return errors;
  };

  // TODO: function overloads, pass boolean to return client ready data
  const C = async (
    obj: Omit<T, "id">
  ): Promise<T | ValidationErrors | DatabaseError.UniqueFieldAlreadyExists> => {
    const value = normalizeFields({
      ...obj,
      id: uuidv4(),
    } as T);

    const invalidFields = validateFields(value);
    if (invalidFields.length > 0) {
      return invalidFields;
    }

    const uniqueFields = Object.keys(mergedConfig.uniqueFields);
    for (const uniqueField of uniqueFields) {
      if (uniqueField in value) {
        const serializedValue = JSON.stringify(
          value[uniqueField as keyof typeof value]
        );
        if (
          (await client.hget(`${key}:${uniqueField}`, serializedValue)) !== null
        ) {
          return DatabaseError.UniqueFieldAlreadyExists;
        }
      }
    }

    await client.hset(key, value.id, JSON.stringify(value));

    for (const uniqueField of uniqueFields) {
      if (uniqueField in value) {
        const serializedValue = JSON.stringify(
          value[uniqueField as keyof typeof value]
        );
        await client.hset(`${key}:${uniqueField}`, serializedValue, value.id);
      }
    }

    return value;
  };

  const R = async (id: string): Promise<T | DatabaseError.DoesNotExist> => {
    const value = await client.hget(key, id);
    return value === null ? DatabaseError.DoesNotExist : JSON.parse(value);
  };

  const U = async (
    id: string,
    changes: Partial<Omit<T, "id" | U>>
  ): Promise<T | ValidationErrors | DatabaseError.DoesNotExist> => {
    const prevValue = await R(id);
    if (prevValue === DatabaseError.DoesNotExist) {
      return DatabaseError.DoesNotExist;
    }

    const immutableFields = { id } as Partial<T>;
    for (const key in mergedConfig.immutableFields) {
      immutableFields[key as keyof typeof immutableFields] =
        prevValue[key as keyof typeof prevValue];
    }

    const value = normalizeFields({
      ...prevValue,
      ...changes,
      ...immutableFields,
    } as T);

    const invalidFields = validateFields(value);
    if (invalidFields.length > 0) {
      return invalidFields;
    }

    await client.hset(key, id, JSON.stringify(value));
    return value;
  };

  const D = async (id: string): Promise<T | DatabaseError.DoesNotExist> => {
    const prevValue = await R(id);
    if (prevValue === DatabaseError.DoesNotExist) {
      return DatabaseError.DoesNotExist;
    }
    // note: this will leave orphan data
    // this should be deleted by a cron job or similar
    await client.hdel(key, id);
    await client.hset(`deleted:${key}`, JSON.stringify(prevValue));
    return prevValue;
  };

  const FIND_BY = async <U extends keyof T>(
    uniqueField: U,
    uniqueValue: T[U]
  ): Promise<T | DatabaseError.DoesNotExist> => {
    const id = await client.hget(
      `${key}:${uniqueField}`,
      JSON.stringify(uniqueValue)
    );
    return id === null ? DatabaseError.DoesNotExist : R(id);
  };

  const ALL = async (): Promise<T[]> => {
    return Object.values(await client.hgetall(key)).map((json) =>
      JSON.parse(json)
    );
  };

  const CLIENT = (value: T): Fetchable<Omit<T, U>> => {
    const clientValue: Partial<T> = {};
    for (const _key of Object.keys(value)) {
      const key = _key as keyof typeof mergedConfig.hiddenFields;
      if (mergedConfig.hiddenFields[key] !== 1) {
        clientValue[key] = value[key];
      }
    }
    return {
      value: clientValue as Omit<T, U>,
      errors: {},
    };
  };

  const CLIENT_ALL = (values: T[]): Fetchable<Array<Omit<T, U>>> => {
    const clientValues: Array<Omit<T, U>> = [];
    for (const value of values) {
      const clientValue: Partial<T> = {};
      for (const _key of Object.keys(value)) {
        const key = _key as keyof typeof mergedConfig.hiddenFields;
        if (mergedConfig.hiddenFields[key] !== 1) {
          clientValue[key] = value[key];
        }
      }
      clientValues.push(clientValue as Omit<T, U>);
    }
    return {
      value: clientValues,
      errors: {},
    };
  };

  return {
    C,
    R,
    U,
    D,
    FIND_BY,
    ALL,
    CLIENT,
    CLIENT_ALL,
  };
};
