"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

/** Builds a simple typographic placeholder cover so a missing image never breaks layout. */
function placeholderDataUrl(title: string, author: string) {
  const wrap = (text: string, max: number) => {
    const words = text.split(" ");
    const lines: string[] = [];
    let line = "";
    for (const w of words) {
      if ((line + " " + w).trim().length > max) {
        lines.push(line.trim());
        line = w;
      } else {
        line = (line + " " + w).trim();
      }
    }
    if (line) lines.push(line.trim());
    return lines.slice(0, 4);
  };
  const titleLines = wrap(title, 16);
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="400" height="600" viewBox="0 0 400 600">
      <rect width="400" height="600" fill="#E4DCC8"/>
      <rect x="16" y="16" width="368" height="568" fill="none" stroke="#221F1A" stroke-opacity="0.25" stroke-width="1.5"/>
      <text x="200" y="${260 - titleLines.length * 14}" font-family="Georgia, serif" font-size="26" fill="#221F1A" text-anchor="middle">
        ${titleLines
          .map((l, i) => `<tspan x="200" dy="${i === 0 ? 0 : 34}">${l.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</tspan>`)
          .join("")}
      </text>
      <text x="200" y="400" font-family="Georgia, serif" font-size="16" fill="#55503F" text-anchor="middle">${author
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")}</text>
    </svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

export function BookCover({
  src,
  title,
  author,
  className,
  sizes = "(max-width: 640px) 40vw, 220px",
  priority = false,
}: {
  src: string;
  title: string;
  author: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const [errored, setErrored] = useState(false);

  return (
    <div className={cn("relative overflow-hidden bg-paper-warm shadow-card", className)}>
      <Image
        src={errored ? placeholderDataUrl(title, author) : src}
        alt={`Cover of ${title} by ${author}`}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
        onError={() => setErrored(true)}
        unoptimized={errored}
      />
    </div>
  );
}
