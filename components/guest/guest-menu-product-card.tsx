"use client"

import { Heart, Minus, Plus } from "lucide-react"
import type { MouseEvent } from "react"

import { Button, Card, IconButton } from "@/components/design-system"
import type { MiraMode } from "@/components/design-system/tokens"

export type GuestMenuProductCardProps = {
  title: string
  description: string
  metadata: string
  image?: string
  favourite: boolean
  quantity: number
  busy?: boolean
  unavailable?: boolean
  actionLabel?: string
  detailsLabel?: string
  mode?: MiraMode
  onOpen: () => void
  onFavourite: () => void
  onQuickAdd: () => void
  onDecrease: () => void
}

/** Full Guest Menu presentation: compact row on mobile, approved card on desktop. */
export function GuestMenuProductCard({
  title,
  description,
  metadata,
  image,
  favourite,
  quantity,
  busy = false,
  unavailable = false,
  actionLabel = "Выбрать блюдо",
  detailsLabel = "Подробнее →",
  mode = "brand-dark",
  onOpen,
  onFavourite,
  onQuickAdd,
  onDecrease,
}: GuestMenuProductCardProps) {
  const isolate = (event: MouseEvent<HTMLElement>, action: () => void) => {
    event.preventDefault()
    event.stopPropagation()
    action()
  }

  return (
    <Card mode={mode} variant="interactive" className="guest-menu-product-card">
      <button
        type="button"
        className="guest-menu-product-open"
        aria-label={`Открыть: ${title}`}
        disabled={busy}
        onClick={onOpen}
      >
        {image ? (
          <img
            className="guest-menu-product-image"
            src={image}
            alt=""
            draggable={false}
          />
        ) : (
          <span className="guest-menu-product-image guest-menu-product-image-fallback" aria-hidden="true">
            M
          </span>
        )}
        <span className="guest-menu-product-content">
          <strong className="guest-menu-product-title">{title}</strong>
          <span className="guest-menu-product-description">{description}</span>
          <span className="guest-menu-product-metadata">{metadata}</span>
        </span>
      </button>

      <IconButton
        type="button"
        mode={mode}
        variant="ghost"
        size="m"
        className="guest-menu-product-favourite"
        aria-label={favourite ? `Убрать из избранного: ${title}` : `В избранное: ${title}`}
        aria-pressed={favourite}
        onClick={(event) => isolate(event, onFavourite)}
      >
        <Heart aria-hidden="true" fill={favourite ? "currentColor" : "none"} />
      </IconButton>

      <div className="guest-menu-product-mobile-actions">
        <Button
          type="button"
          mode={mode}
          variant="ghost"
          size="m"
          className="guest-menu-product-details"
          aria-label={`Подробнее: ${title}`}
          disabled={busy}
          onClick={(event) => isolate(event, onOpen)}
        >
          {detailsLabel}
        </Button>

        {quantity > 0 ? (
          <div className="guest-menu-product-stepper" role="group" aria-label={`Количество: ${title}`}>
            <IconButton
              type="button"
              mode={mode}
              variant="secondary"
              size="m"
              className="guest-menu-product-decrease"
              aria-label={`Уменьшить количество: ${title}`}
              disabled={busy || unavailable}
              onClick={(event) => isolate(event, onDecrease)}
            >
              <Minus aria-hidden="true" />
            </IconButton>
            <output aria-live="polite" aria-label={`Количество ${title}`}>
              {quantity}
            </output>
            <IconButton
              type="button"
              mode={mode}
              variant="primary"
              size="m"
              className="guest-menu-product-add"
              aria-label={`Увеличить количество: ${title}`}
              disabled={busy || unavailable || quantity >= 99}
              onClick={(event) => isolate(event, onQuickAdd)}
            >
              <Plus aria-hidden="true" />
            </IconButton>
          </div>
        ) : (
          <IconButton
            type="button"
            mode={mode}
            variant="primary"
            size="m"
            className="guest-menu-product-add"
            aria-label={`Добавить: ${title}`}
            disabled={busy || unavailable}
            onClick={(event) => isolate(event, onQuickAdd)}
          >
            <Plus aria-hidden="true" />
          </IconButton>
        )}
      </div>

      <Button
        type="button"
        mode={mode}
        variant="primary"
        size="l"
        fullWidth
        className="guest-menu-product-desktop-action"
        disabled={unavailable}
        onClick={onOpen}
      >
        {actionLabel}
      </Button>
    </Card>
  )
}
