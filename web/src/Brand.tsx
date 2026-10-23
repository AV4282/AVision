export default function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className="brand">
      <img
        className={compact ? "brand-mark compact" : "brand-mark"}
        src="/logo.svg"
        alt=""
      />
      <span className={compact ? "brand-name compact" : "brand-name"}>
        AVision
      </span>
    </div>
  )
}
