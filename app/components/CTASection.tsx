"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const words = ["Ready", "to", "Find", "Your", "Perfect", "Place?"];

export default function CTASection() {
  const sectionRef = useRef<HTMLElement>(null);
  const buttonRef  = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Horizontal line expand
      gsap.fromTo(".cta-rule",
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.4,
          ease: "expo.inOut",
          transformOrigin: "left center",
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
        }
      );

      // Eyebrow fade-up
      gsap.fromTo(".cta-eyebrow",
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0, duration: 1.0, ease: "expo.out", delay: 0.2,
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
        }
      );

      // Word-by-word clip-path reveal
      gsap.fromTo(".cta-word",
        { clipPath: "inset(0 100% 0 0)" },
        {
          clipPath: "inset(0 0% 0 0)",
          duration: 0.9,
          ease: "expo.out",
          stagger: 0.1,
          scrollTrigger: { trigger: sectionRef.current, start: "top 72%" },
        }
      );

      // Subtext + button slide-up
      gsap.fromTo(".cta-sub",
        { opacity: 0, y: 24 },
        {
          opacity: 1, y: 0, duration: 1.0, ease: "expo.out", delay: 0.3,
          scrollTrigger: { trigger: sectionRef.current, start: "top 68%" },
        }
      );

      // Magnetic button
      const btn = buttonRef.current;
      if (btn) {
        const onMove = (e: MouseEvent) => {
          const r = btn.getBoundingClientRect();
          gsap.to(btn, {
            x: (e.clientX - r.left - r.width / 2) * 0.28,
            y: (e.clientY - r.top - r.height / 2) * 0.28,
            duration: 0.35, ease: "power2.out",
          });
        };
        const onLeave = () => {
          gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" });
        };
        btn.addEventListener("mousemove", onMove);
        btn.addEventListener("mouseleave", onLeave);
        return () => {
          btn.removeEventListener("mousemove", onMove);
          btn.removeEventListener("mouseleave", onLeave);
        };
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-charcoal px-6 py-28 md:py-36"
    >
      {/* Subtle grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `linear-gradient(rgba(197,160,89,1) 1px, transparent 1px), linear-gradient(90deg, rgba(197,160,89,1) 1px, transparent 1px)`,
          backgroundSize: "72px 72px",
        }}
      />

      {/* Corner marks */}
      <div className="pointer-events-none absolute inset-6 rounded-3xl border border-clay/10 hidden md:block" />

      {/* Top rule */}
      <div
        className="cta-rule mx-auto mb-16 h-px max-w-5xl bg-gradient-to-r from-transparent via-clay/40 to-transparent"
        style={{ transformOrigin: "left center" }}
      />

      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center gap-8 text-center">
        <div className="flex flex-col items-center gap-7">
          {/* Eyebrow */}
          <div className="cta-eyebrow flex items-center gap-4">
            <span className="h-px w-10 bg-clay/40" />
            <span className="font-dm text-[10px] uppercase tracking-[0.6em] text-clay">
              Ready to move forward?
            </span>
          </div>

          {/* Heading — word-by-word clip reveal */}
          <h2 className="font-cormorant text-[clamp(24px,4vw,56px)] font-light leading-[1.05] text-warm-white whitespace-nowrap">
            {words.map((word, i) => (
              <span key={i} className="cta-word mr-[0.25em] pr-[3px] inline-block last:mr-0">
                {word === "Perfect" || word === "Place?" ? (
                  <em className="text-clay" style={{ fontStyle: "italic" }}>{word}</em>
                ) : word}
              </span>
            ))}
          </h2>

          {/* Sub-line */}
          <p className="cta-sub font-dm text-[13px] leading-relaxed text-warm-white/50 max-w-sm">
            Our specialists are standing by — from the first viewing to the final key handover.
          </p>

          {/* Button */}
          <div className="cta-sub">
            <Link
              ref={buttonRef}
              href="#contact"
              className="group relative inline-flex items-center gap-4 overflow-hidden rounded-full border border-clay/30 px-10 py-4 font-dm text-[11px] font-medium uppercase tracking-[0.45em] text-warm-white transition-colors duration-500 hover:border-clay hover:text-charcoal"
              style={{ willChange: "transform" }}
            >
              {/* fill layer */}
              <div className="absolute inset-0 -translate-x-full bg-clay transition-transform duration-500 ease-out group-hover:translate-x-0" />
              <span className="relative z-10">Schedule Consultation</span>
              <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom rule */}
      <div className="cta-rule mx-auto mt-16 h-px max-w-5xl bg-gradient-to-r from-transparent via-clay/30 to-transparent" />
    </section>
  );
}
