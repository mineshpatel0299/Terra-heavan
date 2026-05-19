"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const footerLinks = [
  { label: "Privacy", href: "#privacy" },
  { label: "Terms", href: "#terms" },
  { label: "Sitemap", href: "#sitemap" },
];

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const waveTextRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Footer rise from depth
      gsap.from(footerRef.current, {
        y: 100,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 95%",
          toggleActions: "play none none reverse",
        },
      });

      // Content stagger
      gsap.from(".footer-item", {
        y: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 90%",
          toggleActions: "play none none reverse",
        },
      });

      // Wave text animation
      const chars = waveTextRef.current?.querySelectorAll('.wave-char');
      if (chars) {
        gsap.to(chars, {
          y: -5,
          stagger: {
            each: 0.05,
            repeat: -1,
            yoyo: true,
          },
          duration: 1,
          ease: "sine.inOut",
        });
      }
    }, footerRef);

    return () => ctx.revert();
  }, []);

  const tagline = "Earthcrafted living, thoughtfully delivered.";

  return (
    <footer ref={footerRef} className="relative bg-charcoal px-6 py-16 overflow-hidden">
      {/* Subtle animated gradient */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background: "radial-gradient(ellipse at 50% 0%, rgba(197, 160, 89, 0.1), transparent 60%)",
        }}
      />

      <div ref={contentRef} className="relative mx-auto max-w-7xl">
        {/* Top rule with animation */}
        <div className="footer-item mb-10 h-px bg-gradient-to-r from-transparent via-clay/25 to-transparent" />

        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          {/* Logo */}
          <Link
            href="/"
            className="footer-item group flex items-center gap-0 font-dm text-[11px] font-light uppercase tracking-[0.65em] text-cream/70 transition-colors duration-300 hover:text-cream"
            aria-label="TerraHaven Home"
          >
            <span>TERRA</span>
            <span className="mx-1 h-3.5 w-px bg-current opacity-40" aria-hidden />
            <span>HAVEN</span>
          </Link>

          {/* Copyright */}
          <p className="footer-item font-dm text-[10px] uppercase tracking-[0.4em] text-cream/35">
            © 2026 TerraHaven Realty. All rights reserved.
          </p>

          {/* Nav links */}
          <div className="footer-item flex items-center gap-6">
            {footerLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="group relative font-dm text-[10px] uppercase tracking-[0.4em] text-cream/40 transition-colors duration-300 hover:text-clay"
              >
                <span>{link.label}</span>
                <span className="absolute bottom-0 left-0 h-px w-0 bg-clay transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom rule */}
        <div className="footer-item mt-10 h-px bg-gradient-to-r from-transparent via-clay/20 to-transparent" />

        {/* Wave animated tagline */}
        <p
          ref={waveTextRef}
          className="footer-item mt-6 text-center font-cormorant text-xs italic text-cream/20"
        >
          {tagline.split("").map((char, i) => (
            <span
              key={i}
              className="wave-char inline-block"
              style={{ display: char === " " ? "inline" : "inline-block" }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </p>
      </div>

      <span id="privacy" className="sr-only" />
      <span id="terms" className="sr-only" />
      <span id="sitemap" className="sr-only" />
    </footer>
  );
}
