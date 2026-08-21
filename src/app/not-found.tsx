import { LinkButton } from "@/components/ui/link-button";

export default function NotFound() {
  return (
    <div className="container py-24 text-center max-w-lg mx-auto">
      <p className="section-label mb-3">Page 404</p>
      <h1 className="font-display text-display-md text-ink dark:text-paper-soft">
        This shelf is empty.
      </h1>
      <p className="mt-3 font-body text-ink-soft dark:text-paper-soft/70">
        We looked, but there&apos;s nothing at that address. It might have moved, or never existed at all.
      </p>
      <div className="mt-8">
        <LinkButton href="/catalog">Back to the catalog</LinkButton>
      </div>
    </div>
  );
}
