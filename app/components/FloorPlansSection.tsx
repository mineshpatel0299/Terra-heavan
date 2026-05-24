"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ThreeDCarousel from "./ThreeDCarousel";

const floorPlanImages = [
  { src: "/images/floorplan1.png", title: "The Terrace Suite" },
  { src: "/images/floorplan2.png", title: "The Garden Villa" },
  { src: "/images/floorplan3.png", title: "The Sky Penthouse" },
  { src: "/images/floorplan4.png", title: "The Urban Studio" },
  { src: "/images/floorplan5.png", title: "The Heritage Loft" },
  { src: "/images/floorplan6.png", title: "The Duplex Estate" },
];

export default function FloorPlansSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const carouselContainerRef = useRef<HTMLDivElement>(null);
  const hologramRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Header decode animation
      const chars = headerRef.current?.querySelectorAll('.decode-text');
      if (chars) {
        gsap.from(chars, {
          opacity: 0,
          y: 30,
          rotateX: -60,
          stagger: 0.02,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });
      }

      // Carousel entrance with holographic reveal
      gsap.from(carouselContainerRef.current, {
        opacity: 0,
        scale: 0.8,
        rotateX: 20,
        filter: "blur(20px)",
        duration: 1.8,
        ease: "power4.out",
        scrollTrigger: {
          trigger: carouselContainerRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      });

      // Hologram pulse
      if (hologramRef.current) {
        gsap.to(hologramRef.current, {
          opacity: 0.3,
          scale: 1.1,
          duration: 2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }

      // Grid animation on scroll
      if (gridRef.current) {
        gsap.to(gridRef.current, {
          backgroundPosition: "100% 100%",
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const headingText = "Interactive Spatial Experience";

  return (
    <section
      ref={sectionRef}
      id="floor-plans"
      className="relative bg-charcoal py-32 overflow-hidden"
      style={{ perspective: "1500px" }}
    >
      {/* Holographic grid background */}
      <div
        ref={gridRef}
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(197, 160, 89, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(197, 160, 89, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      {/* Floating holographic orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            ref={i === 0 ? hologramRef : null}
            className="absolute rounded-full"
            style={{
              width: `${200 + i * 100}px`,
              height: `${200 + i * 100}px`,
              left: `${10 + i * 35}%`,
              top: `${20 + i * 20}%`,
              background: `radial-gradient(circle, rgba(197, 160, 89, ${0.08 - i * 0.02}) 0%, transparent 60%)`,
              filter: "blur(60px)",
              animation: `floatHologram ${6 + i * 2}s ease-in-out infinite`,
              animationDelay: `${i * 1}s`,
            }}
          />
        ))}
      </div>

      <div className="relative mx-auto max-w-7xl px-6 space-y-16">
        {/* Header with text decode effect */}
        <div ref={headerRef} className="space-y-5 text-center mb-20">
          <div className="flex items-center justify-center gap-4">
            <span className="h-px w-12 bg-gradient-to-r from-transparent to-white" aria-hidden />
            <p className="font-dm text-[10px] uppercase tracking-[0.6em] text-white">
              Floor Plans
            </p>
            <span className="h-px w-12 bg-gradient-to-l from-transparent to-white" aria-hidden />
          </div>
          <h2
            className="font-cormorant text-[clamp(36px,5vw,68px)] font-light leading-tight text-white"
            style={{ transformStyle: "preserve-3d" }}
          >
            {headingText.split("").map((char, i) => (
              <span
                key={i}
                className="decode-text inline-block"
                style={{
                  display: char === " " ? "inline" : "inline-block",
                  transformOrigin: "center bottom",
                }}
              >
                {char === " " ? "\u00A0" : char === "S" && i > 10 ? (
                  <em className="italic text-zc">{char}</em>
                ) : (
                  char
                )}
              </span>
            ))}
          </h2>
          <p className="mx-auto max-w-xl font-dm text-sm leading-relaxed text-white">
            Click and drag to explore our meticulously designed living spaces. Each layout is optimized for natural light and seamless flow.
          </p>
        </div>

        {/* Holographic carousel container */}
        <div
          ref={carouselContainerRef}
          className="relative w-full aspect-[16/9] min-h-[600px] flex items-center justify-center"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Holographic glow base */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at center, rgba(197, 160, 89, 0.1) 0%, transparent 70%)",
              filter: "blur(40px)",
            }}
          />

          {/* Holographic rings */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full border border-clay/10"
                style={{
                  width: `${300 + i * 150}px`,
                  height: `${300 + i * 150}px`,
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                  animation: `pulseRing ${4 + i}s ease-in-out infinite`,
                  animationDelay: `${i * 0.5}s`,
                }}
              />
            ))}
          </div>

          <ThreeDCarousel images={floorPlanImages} />
        </div>

        {/* Footer Info */}
        <div className="flex flex-col items-center justify-center gap-8 pt-12">
          <div className="flex flex-wrap justify-center gap-8 md:gap-12">
            {[
              { label: "Total Area", value: "2,400 sqft" },
              { label: "Bedrooms", value: "4 En-Suite" },
              { label: "Ceiling Height", value: "12 Feet" },
            ].map((stat, i) => (
              <div key={stat.label} className="contents">
                <div
                  className="group cursor-pointer text-center relative"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <p className="font-dm text-[9px] uppercase tracking-[0.4em] text-earth/40 transition-colors duration-300 group-hover:text-clay">
                    {stat.label}
                  </p>
                  <p className="font-cormorant text-2xl text-earth transition-all duration-300 group-hover:scale-105">
                    {stat.value}
                  </p>
                </div>
                {i < 2 && (
                  <div key={`divider-${i}`} className="hidden md:block w-px h-12 bg-gradient-to-b from-transparent via-stone/30 to-transparent" />
                )}
              </div>
            ))}
          </div>

          <button
            type="button"
            className="group relative mt-4 overflow-hidden rounded-full bg-charcoal px-12 py-4 font-dm text-[11px] font-semibold uppercase tracking-[0.4em] text-cream transition-all duration-500 hover:shadow-xl hover:shadow-clay/20"
          >
            <span className="relative z-10">Download Brochure</span>
            <div className="absolute inset-0 -translate-x-full bg-clay transition-transform duration-500 group-hover:translate-x-0" />
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes floatHologram {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-20px) scale(1.05);
          }
        }
        @keyframes pulseRing {
          0%, 100% {
            opacity: 0.3;
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            opacity: 0.6;
            transform: translate(-50%, -50%) scale(1.02);
          }
        }
      `}</style>
    </section >
  );
}
