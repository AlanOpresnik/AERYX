"use client";

import { useEffect, useState } from "react";

export default function HeroTitle({ words }: { words: string[] }) {
  const [wordIndex, setWordIndex] = useState(0);
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[wordIndex];

    let timeout: NodeJS.Timeout;

    if (!isDeleting) {
      if (text !== currentWord) {
        timeout = setTimeout(() => {
          setText(currentWord.slice(0, text.length + 1));
        }, 90);
      } else {
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, 1500);
      }
    } else {
      if (text !== "") {
        timeout = setTimeout(() => {
          setText(currentWord.slice(0, text.length - 1));
        }, 50);
      } else {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % words.length);
      }
    }

    return () => clearTimeout(timeout);
  }, [text, isDeleting, wordIndex, words]);

  return (
    <span className="inline-block min-w-[10ch] text-red-400">
      {text}
      <span className="animate-pulse">|</span>
    </span>
  );
}