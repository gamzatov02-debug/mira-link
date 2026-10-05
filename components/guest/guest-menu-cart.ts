import type { CartItem, Product } from "@/lib/domain/model"

export function productRequiresRequiredModifier(product: Product) {
  return product.modifiers.some((modifier) => modifier.required === true)
}

export function baseProductQuantity(items: CartItem[], productId: string) {
  return items
    .filter((item) => item.productId === productId && item.modifierIds.length === 0 && item.comment === "")
    .reduce((total, item) => total + item.quantity, 0)
}

export function withBaseProductQuantity(items: CartItem[], productId: string, nextQuantity: number) {
  const normalized = Math.max(0, Math.min(99, nextQuantity))
  let inserted = false
  const next = items.reduce<CartItem[]>((result, item) => {
    if (item.productId === productId && item.modifierIds.length === 0 && item.comment === "") {
      if (!inserted && normalized > 0) {
        result.push({ ...item, quantity: normalized })
        inserted = true
      }
      return result
    }
    result.push(item)
    return result
  }, [])

  if (!inserted && normalized > 0) {
    next.push({ productId, quantity: normalized, modifierIds: [], comment: "" })
  }
  return next
}
