"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export default function GlobalEffects() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    // Detect touch device
    if (window.matchMedia("(pointer: coarse)").matches) {
      setIsTouch(true);
      return;
    }

    const cursor = cursorRef.current;
    const cursorDot = cursorDotRef.current;
    const spotlight = spotlightRef.current;
    if (!cursor || !cursorDot || !spotlight) return;

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let rafId: number;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Spotlight follows instantly
      spotlight.style.background = `radial-gradient(600px circle at ${mouseX}px ${mouseY}px, rgba(197, 160, 89, 0.08), transparent 40%)`;
    };

    const handleMouseEnter = () => {
      gsap.to([cursor, cursorDot], { opacity: 1, duration: 0.3 });
    };

    const handleMouseLeave = () => {
      gsap.to([cursor, cursorDot], { opacity: 0, duration: 0.3 });
    };

    // Smooth cursor animation
    const animate = () => {
      const dx = mouseX - cursorX;
      const dy = mouseY - cursorY;

      cursorX += dx * 0.15;
      cursorY += dy * 0.15;

      cursor.style.transform = `translate3d(${cursorX - 20}px, ${cursorY - 20}px, 0)`;
      cursorDot.style.transform = `translate3d(${mouseX - 4}px, ${mouseY - 4}px, 0)`;

      rafId = requestAnimationFrame(animate);
    };

    // Interactive element detection
    const handleElementHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = target.closest("a, button, [role='button'], input, textarea, .interactive");

      if (isInteractive) {
        setIsHovering(true);
        gsap.to(cursor, {
          scale: 2,
          borderColor: "rgba(197, 160, 89, 0.5)",
          duration: 0.3,
        });
      } else {
        setIsHovering(false);
        gsap.to(cursor, {
          scale: 1,
          borderColor: "rgba(197, 160, 89, 0.8)",
          duration: 0.3,
        });
      }
    };

    document.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mousemove", handleElementHover, { passive: true });
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);
    rafId = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mousemove", handleElementHover);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(rafId);
    };
  }, []);

  if (isTouch) return null;

  return (
    <>
      {/* Spotlight overlay */}
      <div
        ref={spotlightRef}
        className="pointer-events-none fixed inset-0 z-[9998]"
        style={{
          background: "radial-gradient(600px circle at 50% 50%, rgba(197, 160, 89, 0.08), transparent 40%)",
        }}
      />

      {/* Custom cursor - outer ring */}
      <div
        ref={cursorRef}
        className="pointer-events-none fixed top-0 left-0 z-[9999] h-10 w-10 rounded-full border border-clay/80 opacity-0 mix-blend-difference"
        style={{ willChange: "transform" }}
      />

      {/* Custom cursor - dot */}
      <div
        ref={cursorDotRef}
        className="pointer-events-none fixed top-0 left-0 z-[9999] h-2 w-2 rounded-full bg-clay opacity-0"
        style={{ willChange: "transform" }}
      />
    </>
  );
}
