const symbols = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"

const symbol = () => {
  const index = Math.round(Math.random() * (symbols.length - 1))
  return symbols[index]
}

const createSymbols = (length: number) =>
  Array.from({ length }, () => symbol()).join("")

export const createId = (type: "uuid" | "mini") =>
  ({
    mini: () => createSymbols(10),
    uuid: () => crypto.randomUUID(),
  })[type]()
