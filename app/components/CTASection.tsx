"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function CTASection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const textScrambleRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const floatingShapeRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Text scramble effect
  const scrambleText = useCallback((element: HTMLElement, finalText: string) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    let iteration = 0;
    const interval = setInterval(() => {
      element.innerText = finalText
        .split("")
        .map((_, index) => {
          if (index < iteration) {
            return finalText[index];
          }
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join("");

      if (iteration >= finalText.length) {
        clearInterval(interval);
      }
      iteration += 1 / 2;
    }, 30);
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Heading wave entrance
      const chars = headingRef.current?.querySelectorAll('.wave-char');
      if (chars) {
        gsap.from(chars, {
          y: 100,
          opacity: 0,
          rotationX: -90,
          stagger: {
            each: 0.05,
            from: "center",
          },
          duration: 1,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: headingRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        });
      }

      // Floating shapes parallax
      floatingShapeRefs.current.forEach((shape, i) => {
        if (!shape) return;
        gsap.to(shape, {
          y: `${-50 * (i + 1)}`,
          rotation: 360 * (i % 2 === 0 ? 1 : -1),
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1 + i * 0.5,
          },
        });
      });

      // Button magnetic effect
      const button = buttonRef.current;
      if (button) {
        button.addEventListener('mousemove', (e) => {
          const rect = button.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;

          gsap.to(button, {
            x: x * 0.3,
            y: y * 0.3,
            duration: 0.3,
            ease: "power2.out",
          });
        });

        button.addEventListener('mouseleave', () => {
          gsap.to(button, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: "elastic.out(1, 0.3)",
          });
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Mouse parallax for background
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      setMousePos({
        x: (e.clientX - rect.left) / rect.width - 0.5,
        y: (e.clientY - rect.top) / rect.height - 0.5,
      });
    };

    const section = sectionRef.current;
    section?.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => section?.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const headingText = "Ready to Find Your Perfect Place?";

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-32 px-6"
      style={{ perspective: "1200px" }}
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-sand via-cream to-sand">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `radial-gradient(circle at ${50 + mousePos.x * 20}% ${50 + mousePos.y * 20}%, rgba(197, 160, 89, 0.15), transparent 50%)`,
          }}
        />
      </div>

      {/* Floating morphing shapes */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            ref={(el) => { floatingShapeRefs.current[i] = el; }}
            className="absolute"
            style={{
              width: `${100 + i * 50}px`,
              height: `${100 + i * 50}px`,
              left: `${10 + i * 25}%`,
              top: `${20 + (i % 2) * 40}%`,
              background: `linear-gradient(${45 + i * 30}deg, rgba(197, 160, 89, ${0.1 - i * 0.02}), transparent)`,
              borderRadius: i % 2 === 0 ? "60% 40% 30% 70% / 60% 30% 70% 40%" : "30% 60% 70% 40% / 50% 60% 30% 60%",
              animation: `morph${i} ${8 + i * 2}s ease-in-out infinite`,
            }}
          />
        ))}
      </div>

      {/* Grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(197, 160, 89, 1) 1px, transparent 1px), linear-gradient(90deg, rgba(197, 160, 89, 1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Corner accents */}
      <div className="pointer-events-none absolute inset-8 border border-clay/10 rounded-3xl" />

      {/* Content */}
      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center gap-8 text-center">
        {/* Eyebrow */}
        <div className="flex items-center gap-4">
          <span className="h-px w-12 bg-gradient-to-r from-transparent to-clay/50" />
          <p className="font-dm text-[10px] uppercase tracking-[0.6em] text-clay/80">
            Ready to move forward?
          </p>
          <span className="h-px w-12 bg-gradient-to-l from-transparent to-clay/50" />
        </div>

        {/* Kinetic typography heading */}
        <h2
          ref={headingRef}
          className="font-cormorant text-[clamp(28px,6vw,56px)] font-light leading-[1.1] text-charcoal max-w-l"
          style={{ transformStyle: "preserve-3d" }}
        >
          {headingText.split("").map((char, i) => (
            <span
              key={i}
              className="wave-char inline-block"
              style={{
                display: char === " " ? "inline" : "inline-block",
                transformOrigin: "center bottom",
              }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </h2>

        {/* Subtext with scramble effect */}
        <p className="max-w-l font-dm text-sm leading-relaxed text-earth/60">
          Our team of specialists is standing by to guide you home.
        </p>

        {/* Magnetic CTA Button */}
        <Link
          ref={buttonRef}
          href="#contact"
          className="group relative mt-4 inline-flex items-center gap-3 overflow-hidden rounded-full bg-charcoal px-10 py-4 font-dm text-[11px] font-semibold uppercase tracking-[0.4em] text-cream transition-all duration-500 hover:shadow-2xl hover:shadow-clay/30"
          style={{ willChange: "transform" }}
        >
          <span className="relative z-10">Schedule Consultation</span>
          <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">→</span>

          {/* Button fill animation */}
          <div className="absolute inset-0 -translate-x-full bg-clay transition-transform duration-500 group-hover:translate-x-0" />

          {/* Ripple effect */}
          <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="absolute inset-0 animate-ping rounded-full bg-clay/20" style={{ animationDuration: "2s" }} />
          </div>
        </Link>
      </div>

      {/* Decorative bottom line */}
      <div className="absolute bottom-12 left-1/2 h-px w-32 -translate-x-1/2 bg-gradient-to-r from-transparent via-clay/40 to-transparent" />

      <style jsx>{`
        @keyframes morph0 {
          0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
          50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
        }
        @keyframes morph1 {
          0%, 100% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
          50% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
        }
        @keyframes morph2 {
          0%, 100% { border-radius: 50% 50% 20% 80% / 25% 80% 20% 75%; }
          50% { border-radius: 25% 75% 50% 50% / 50% 50% 50% 50%; }
        }
        @keyframes morph3 {
          0%, 100% { border-radius: 25% 75% 50% 50% / 50% 50% 50% 50%; }
          50% { border-radius: 50% 50% 20% 80% / 25% 80% 20% 75%; }
        }
      `}</style>
    </section>
  );
}
