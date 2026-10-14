"use client"

import type { ReactNode } from "react"

import { BottomSheet } from "@/components/design-system"
import type { MiraMode } from "@/components/design-system/tokens"
import { useGuestTheme } from "@/components/guest-theme"
import { MiraButton as Button, MiraInput as Input } from "@/components/mira"
import { ProductImage, ProductInfo } from "@/components/mira-domain-ui"
import type { Modifier, Product } from "@/lib/domain/model"
import { formatMoney } from "@/lib/domain/selectors"
import { themeStyle } from "@/lib/guest-theme"

export type GuestProductDetailProps = {
  product: Product | null
  open: boolean
  description: string
  mode?: MiraMode
  modifierIds: string[]
  quantity: number
  comment: string
  busy?: boolean
  canSubmit: boolean
  submitLabel: string
  secondaryAction?: ReactNode
  feedback?: ReactNode
  onOpenChange: (open: boolean) => void
  onModifierChange: (modifier: Modifier, checked: boolean) => void
  onDecrease: () => void
  onIncrease: () => void
  onCommentChange: (comment: string) => void
  onSubmit: () => void
}

/** Canonical Guest product detail presentation. Callers keep ownership of cart/domain actions. */
export function GuestProductDetail({
  product,
  open,
  description,
  mode = "brand-dark",
  modifierIds,
  quantity,
  comment,
  busy = false,
  canSubmit,
  submitLabel,
  secondaryAction,
  feedback,
  onOpenChange,
  onModifierChange,
  onDecrease,
  onIncrease,
  onCommentChange,
  onSubmit,
}: GuestProductDetailProps) {
  const theme = useGuestTheme()
  const total = product
    ? (product.price + product.modifiers
        .filter((modifier) => modifierIds.includes(modifier.id))
        .reduce((sum, modifier) => sum + modifier.price, 0)) * quantity
    : 0

  return (
    <BottomSheet
      mode={mode}
      presentation="responsive-dialog"
      title={product?.name ?? "Блюдо"}
      open={open}
      onOpenChange={onOpenChange}
      description={description}
      className={theme ? "guest-theme" : undefined}
      style={theme ? themeStyle(theme) : undefined}
      overlayStyle={theme ? { background: theme.colors.overlay } : undefined}
    >
      {product && (
        <>
          <ProductImage product={product} className="dish-detail-image" />
          <ProductInfo product={product} />
          <p>{formatMoney(product.price)} · {product.weight}</p>
          {product.modifiers.map((modifier) => (
            <label className="check-row" key={modifier.id}>
              <input
                type={modifier.required ? "radio" : "checkbox"}
                name={modifier.group}
                checked={modifierIds.includes(modifier.id)}
                onChange={(event) => onModifierChange(modifier, event.target.checked)}
              />
              {modifier.name} {modifier.required ? "· обязательно" : ""} · {formatMoney(modifier.price)}
            </label>
          ))}
          <div className="product-purchase">
            <div className="quantity-stepper" aria-label="Количество блюда">
              <Button className="outline" aria-label="Уменьшить количество" disabled={quantity <= 1} onClick={onDecrease}>−</Button>
              <output>{quantity}</output>
              <Button className="outline" aria-label="Увеличить количество" disabled={quantity >= 99} onClick={onIncrease}>+</Button>
            </div>
            <Input label="Комментарий к блюду" value={comment} onChange={(event) => onCommentChange(event.target.value)} />
            <Button className="product-sticky-cta" disabled={!canSubmit} loading={busy} onClick={onSubmit}>
              {submitLabel}<span className="product-cta-price"> · {formatMoney(total)}</span>
            </Button>
            <p className="product-price">{formatMoney(total)}</p>
          </div>
          {secondaryAction}
          {feedback}
        </>
      )}
    </BottomSheet>
  )
}
