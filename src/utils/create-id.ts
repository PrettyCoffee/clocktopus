const symbols = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"

const symbol = () => {
  const index = Math.round(Math.random() * (symbols.length - 1))
  return symbols[index]
}

export const createId = (type: "uuid" | "mini") =>
  ({
    mini: () => `${symbol()}${symbol()}${symbol()}${symbol()}${symbol()}`,
    uuid: () => crypto.randomUUID(),
  })[type]()
