export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;
export type JsonObject = { [key: string]: JsonValue | undefined };
export type JsonArray = JsonValue[];

export interface CsnRoot {
  definitions?: Record<string, CsnDefinition>;
  [key: string]: JsonValue | undefined;
}

export interface CsnDefinition {
  kind?: string;
  elements?: Record<string, CsnElement>;
  query?: CsnQuery;
  [key: string]: JsonValue | undefined;
}

export interface CsnElement {
  type?: string;
  key?: boolean;
  length?: number;
  precision?: number;
  scale?: number;
  notNull?: boolean;
  [key: string]: JsonValue | undefined;
}

export interface CsnQuery {
  SELECT?: CsnSelect;
  [key: string]: JsonValue | undefined;
}

export interface CsnSelect {
  from?: JsonValue;
  columns?: JsonArray;
  [key: string]: JsonValue | undefined;
}
