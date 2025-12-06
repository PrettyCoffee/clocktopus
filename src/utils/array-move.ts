import { clamp } from "./clamp"

export const arrayMove = <T>(
  array: T[],
  oldIndex: number,
  newIndex: number
) => {
  const clampedIndex = clamp(newIndex, 0, array.length - 1)

  const newArray = [...array]
  const item = newArray.splice(oldIndex, 1)
  return [
    ...newArray.slice(0, clampedIndex),
    ...item,
    ...newArray.slice(clampedIndex),
  ]
}
