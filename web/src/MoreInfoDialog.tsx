import { useEffect, useId, useState } from "react"
import { createPortal } from "react-dom"
import { Camera, Database, X } from "lucide-react"
import type { SourceInfo } from "./components/avision-map/types"
import useModalDialog from "./useModalDialog"
import { WELCOME_PHOTOS } from "./welcome-photos"

// Where the map's bundled data lives, with sources.json describing each file.
const DATA_URL = `${import.meta.env.BASE_URL}avision-map`

const longDate = (value: string | number) =>
  new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  })

/**
 * "More information", opened from the sidebar beside Help & resources. It
 * holds where the map's data comes from, which used to be a "Data sources"
 * button on the map itself, and who took the photos on the welcome screen.
 */
export default function MoreInfoDialog({ onClose, opener }: {
  onClose: () => void
  opener: HTMLElement
}) {
  const { dialogRef, closeRef } = useModalDialog({ onClose, opener })
  const titleId = useId()
  const descriptionId = useId()
  const [retrievedDate, setRetrievedDate] = useState("Date unavailable")
  const [dataSources, setDataSources] = useState<SourceInfo[]>([])

  // The list of sources ships with the map data, so it is read from there.
  useEffect(() => {
    const controller = new AbortController()
    fetch(`${DATA_URL}/sources.json`, { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : null))
      .then((source) => {
        if (controller.signal.aborted) return
        if (Array.isArray(source?.datasets)) {
          setDataSources(
            source.datasets.filter(
              (item: SourceInfo) =>
                typeof item?.label === "string" &&
                typeof item.url === "string" &&
                item.url.startsWith("https://") &&
                typeof item.description === "string" &&
                typeof item.dateNote === "string" &&
                !Number.isNaN(new Date(item.retrievedAt).valueOf()),
            ),
          )
        }
        const value = source?.retrievedDate ?? source?.retrievedAt
        if (value && !Number.isNaN(new Date(value).valueOf())) setRetrievedDate(longDate(value))
      })
      .catch(() => {})
    return () => controller.abort()
  }, [])

  return createPortal(
    <dialog
      ref={dialogRef}
      className="privacy-dialog more-info-dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onCancel={(event) => {
        event.preventDefault()
        event.stopPropagation()
        onClose()
      }}
      onPointerDown={(event) => event.stopPropagation()}
      onClick={(event) => event.stopPropagation()}
    >
      <header className="report-header privacy-header">
        <div>
          <p className="eyebrow">ABOUT THE MAP</p>
          <h2 id={titleId}>More information</h2>
          <p id={descriptionId}>Where the map’s data and the welcome photos come from.</p>
        </div>
        <button ref={closeRef} type="button" className="dialog-close" onClick={onClose} aria-label="Close more information">
          <X size={20} aria-hidden="true" />
        </button>
      </header>
      <div className="privacy-body">
        <section aria-label="Map data sources">
          <h3>
            <Database size={17} aria-hidden="true" /> Map data sources
          </h3>
          <p>
            Streets:{" "}
            <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">
              OpenStreetMap
            </a>
            . Soft and Street use the same tiles with different colors.
          </p>
          <p>
            Neighborhoods and station points:{" "}
            <a
              href="https://gis.atlantaga.gov/dpcd/rest/services/OpenDataService1/MapServer"
              target="_blank"
              rel="noreferrer"
            >
              City of Atlanta GIS
            </a>
            , downloaded {retrievedDate}. Individual features may have been
            updated earlier.
          </p>
          <p>
            The pilot outline is a team-defined GSU and MARTA area. It doesn’t
            show campus property lines or agency ownership.
          </p>
          {dataSources.map((source) => (
            <p key={source.id}>
              <a href={source.url} target="_blank" rel="noreferrer">
                {source.label}
              </a>
              , retrieved {longDate(source.retrievedAt)}. {source.dateNote} {source.description}
              {source.buildingList && (
                <>
                  {" "}
                  <a href={source.buildingList} target="_blank" rel="noreferrer">
                    GSU building list
                  </a>
                  .
                </>
              )}
            </p>
          ))}
          {!dataSources.length && (
            <p>
              Additional layer source details are unavailable right now. See the
              bundled sources.json for where each layer came from.
            </p>
          )}
        </section>
        <section aria-label="Photo credits">
          <h3>
            <Camera size={17} aria-hidden="true" /> Photo credits
          </h3>
          <p>The photos on the welcome screen, all free to use:</p>
          {WELCOME_PHOTOS.map((photo) => (
            <p key={photo.file}>
              {photo.label}:{" "}
              <a href={photo.link} target="_blank" rel="noreferrer">
                {photo.by}
              </a>
              ,{" "}
              {"termsLink" in photo ? (
                <a href={photo.termsLink} target="_blank" rel="noreferrer">
                  {photo.terms}
                </a>
              ) : (
                photo.terms
              )}
              .
            </p>
          ))}
        </section>
      </div>
    </dialog>,
    document.body,
  )
}
