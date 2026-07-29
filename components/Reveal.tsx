"use client";

import React, { useEffect, useRef } from "react";

type RevealProps = {
  children: React.ReactNode;
  /** Extra transition delay in ms — use for staggered lists. */
  delay?: number;
  className?: string;
};

/**
 * Scroll-reveal wrapper: content fades and rises into view the first time it
 * enters the viewport.
 *
 * Elements start visible in the server HTML (SEO / no-JS safe) and are only
 * hidden on mount if they're still below the fold, so above-the-fold content
 * never flashes. Respects prefers-reduced-motion.
 */
const Reveal = ({ children, delay = 0, className = "" }: RevealProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Already on screen — leave it alone.
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return;

    el.style.transitionDelay = `${delay}ms`;
    el.classList.add("reveal-hidden");

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("reveal-visible");
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={`reveal ${className}`}>
      {children}
    </div>
  );
};

export default Reveal;
