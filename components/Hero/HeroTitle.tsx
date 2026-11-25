"use client";

import { useEffect, useState } from "react";

export default function HeroTitle({ words }: { words: string[] }) {
  const [wordIndex, setWordIndex] = useState(0);
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    // Con movimiento reducido, mostrar la primera palabra fija
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setText(words[0]);
      return;
    }

    const currentWord = words[wordIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting) {
      if (text !== currentWord) {
        timeout = setTimeout(() => {
          setText(currentWord.slice(0, text.length + 1));
        }, 90);
      } else {
        timeout = setTimeout(() => setIsDeleting(true), 1600);
      }
    } else if (text !== "") {
      timeout = setTimeout(() => {
        setText(currentWord.slice(0, text.length - 1));
      }, 45);
    } else {
      setIsDeleting(false);
      setWordIndex((prev) => (prev + 1) % words.length);
    }

    return () => clearTimeout(timeout);
  }, [text, isDeleting, wordIndex, words]);

  return (
    <span className="inline-block min-w-[10ch] text-accent">
      {/* El lector de pantalla lee todas las palabras una vez, no la animación */}
      <span className="sr-only">{words.join(", ")}</span>
      <span aria-hidden="true">
        {text}
        <span className="ml-[0.04em] inline-block w-[0.06em] animate-pulse bg-current align-[-0.08em] text-transparent">
          |
        </span>
      </span>
    </span>
  );
}
