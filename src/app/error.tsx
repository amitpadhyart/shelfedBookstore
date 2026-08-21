"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { LinkButton } from "@/components/ui/link-button";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container py-24 text-center max-w-lg mx-auto">
      <p className="section-label mb-3">Dropped a page</p>
      <h1 className="font-display text-display-md text-ink dark:text-paper-soft">Something came loose.</h1>
      <p className="mt-3 font-body text-ink-soft dark:text-paper-soft/70">
        That page didn&apos;t load the way it should have. It&apos;s on us — try again, or head back to the shelves.
      </p>
      <div className="mt-8 flex items-center justify-center gap-3">
        <Button onClick={() => reset()}>Try again</Button>
        <LinkButton href="/" variant="secondary">
          Back to Shelfed
        </LinkButton>
      </div>
    </div>
  );
}
