export default function SiteFooter({
  privacyPage = false,
}: {
  privacyPage?: boolean
}) {
  return (
    <footer className="site-footer" role="contentinfo" aria-label="Site footer">
      <span>AVision · Atlanta, Georgia</span>
      <a href="/privacy" aria-current={privacyPage ? "page" : undefined}>
        Privacy Policy
      </a>
    </footer>
  )
}
