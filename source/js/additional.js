import { CARDS } from "./constants"

export function generateCard (hidden = false) {
  const initial = (Math.random() * 13 + 1) ^ 0
  const type = (Math.random() * CARDS.length + 1) ^ 0

  return { initial, type, hidden }
}

export function getCardInitialByRules (current, initial) {
  switch (initial) {
    case 1:
      return current < 21 ? 11 : 1
    case 11:
    case 12:
    case 13:
      return 10
    default:
      return initial
  }
}