const toString = (data: unknown) => {
  if (!data) return ""

  switch (typeof data) {
    case "object":
      return JSON.stringify(data, null, 2)
    case "string":
    case "number":
    case "boolean":
    case "bigint":
      return String(data)
    default:
      throw new Error("Value could not be converted to string")
  }
}

const createBlobUrl = (content: unknown) => {
  const fileContent = toString(content)
  const file = new Blob([fileContent])
  return URL.createObjectURL(file)
}

export const download = (fileName: string, content: unknown) => {
  const blobUrl = createBlobUrl(content)
  const link = document.createElement("a")

  link.href = blobUrl
  link.download = fileName

  document.body.appendChild(link)

  link.dispatchEvent(
    new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      view: window,
    })
  )

  document.body.removeChild(link)
}
