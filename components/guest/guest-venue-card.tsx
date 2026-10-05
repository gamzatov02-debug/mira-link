"use client"

export type GuestVenueCardProps = {
  id: string
  name: string
  image: string
  category: string
  distance: string
  distanceMeters: number
  rating: string | number
  hours: string
  status?: string
  imageType?: string
  selected?: boolean
  onOpen: () => void
}

/** Canonical Guest discovery card for a venue result. */
export function GuestVenueCard({
  id,
  name,
  image,
  category,
  distance,
  distanceMeters,
  rating,
  hours,
  status,
  imageType,
  selected = false,
  onOpen,
}: GuestVenueCardProps) {
  return (
    <div
      data-venue-id={id}
      data-distance={distanceMeters}
      data-venue-image-type={imageType}
      className={`nearby-list-item ${selected ? "selected" : ""}`}
    >
      <button type="button" className="nearby-venue-card" aria-label={`О заведении ${name}`} onClick={onOpen}>
        <img className="nearby-venue-photo" src={image} alt="" />
        <span className="nearby-venue-content">
          <strong className="nearby-venue-name">{name}</strong>
          <span className="nearby-venue-meta">{category} · {distance} · ★ {rating}</span>
          <span className="nearby-venue-hours">{hours}{status ? ` · ${status}` : ""}</span>
          <span className="nearby-venue-action">О заведении →</span>
        </span>
      </button>
    </div>
  )
}
