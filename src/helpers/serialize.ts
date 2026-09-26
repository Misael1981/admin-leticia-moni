import { Prisma } from "@misael1981/physio-database"

export type Serialized<T> = T extends Prisma.Decimal
  ? number
  : T extends Date
    ? string
    : T extends (infer U)[]
      ? Serialized<U>[]
      : T extends object
        ? { [K in keyof T]: Serialized<T[K]> }
        : T

export function serialize<T>(data: T): Serialized<T> {
  if (data === null || data === undefined) return data as Serialized<T>

  if (data instanceof Prisma.Decimal) {
    return Number(data) as Serialized<T>
  }

  if (data instanceof Date) {
    return data.toISOString() as Serialized<T>
  }

  if (Array.isArray(data)) {
    return data.map(serialize) as Serialized<T>
  }

  if (typeof data === "object") {
    return Object.fromEntries(
      Object.entries(data).map(([k, v]) => [k, serialize(v)]),
    ) as Serialized<T>
  }

  return data as Serialized<T>
}
