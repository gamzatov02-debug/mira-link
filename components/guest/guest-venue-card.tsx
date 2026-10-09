"use client"

import {ChevronRight} from "lucide-react"
import styles from "./guest-venue-card.module.css"

export type GuestVenueCardProps = {
  id: string
  name: string
  image: string
  category: string
  distance: string
  distanceMeters: number
  distanceReliable?: boolean
  rating: string | number
  hours: string
  status?: string
  imageType?: string
  selected?: boolean
  onSelect?: () => void
  onOpen: () => void
  onMenu?: () => void
  onDelivery?: () => void
}

/** Canonical Guest discovery card for a venue result. */
export function GuestVenueCard({
  id,
  name,
  image,
  category,
  distance,
  distanceMeters,
  distanceReliable = false,
  rating,
  hours,
  status,
  imageType,
  selected = false,
  onSelect,
  onOpen,
  onMenu,
  onDelivery,
}: GuestVenueCardProps) {
  return (
    <div
      data-venue-id={id}
      data-distance={Math.round(distanceMeters)}
      data-venue-image-type={imageType}
      className={`nearby-list-item ${styles.card} ${selected ? styles.selected : ""}`}
    >
      <button type="button" className={styles.select} aria-label={`Выбрать ${name} на карте`} aria-pressed={selected} onClick={onSelect ?? onOpen}>
        <img className={styles.photo} src={image} alt="" />
        <span className={styles.content}>
          <strong className={styles.name}>{name}</strong>
          <span className={styles.meta}>{category} · ★ {rating}{distanceReliable ? ` · ${distance}` : ""}</span>
          <span className={styles.hours}>{hours}{status ? ` · ${status}` : ""}</span>
        </span>
      </button>
      <div className={styles.actions}>
        <button type="button" onClick={onOpen}>Подробнее <ChevronRight aria-hidden/></button>
        {onMenu&&<button type="button" onClick={onMenu}>Меню</button>}
        {onDelivery&&<button type="button" onClick={onDelivery}>Доставка</button>}
      </div>
    </div>
  )
}
