"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Compass, Home, Key, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { GlowCard } from "@/components/ui/spotlight-card";

const features = [
  {
    title: "Curated Properties",
    description:
      "Hand-picked residences that honour local terroir, sustainability, and enduring craftsmanship.",
    Icon: Home,
    accent: "Thoughtfully selected",
    image: "/images/features/curated.png",
    stat: "200+",
    statLabel: "Properties",
  },
  {
    title: "Verified Listings",
    description:
      "Every opportunity is vetted, documented, and staged with absolute transparency.",
    Icon: ShieldCheck,
    accent: "100% authenticated",
    image: "/images/features/verified.png",
    stat: "100%",
    statLabel: "Authenticated",
  },
  {
    title: "End-to-End Support",
    description:
      "Concierge-level guidance from site visits to ownership handover and beyond.",
    Icon: Key,
    accent: "Full lifecycle care",
    image: "/images/features/support.png",
    stat: "24/7",
    statLabel: "Concierge",
  },
  {
    title: "Neighbourhood Insights",
    description:
      "Hyper-local intelligence on schools, culture, connectivity, and future value corridors.",
    Icon: Compass,
    accent: "Data-informed living",
    image: "/images/features/neighborhood.png",
    stat: "50+",
    statLabel: "Locations",
  },
];

export default function FeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Header entrance
      gsap.from(".feat-header-line", {
        y: 80,
        opacity: 0,
        rotationZ: 1.5,
        duration: 1.4,
        stagger: 0.15,
        ease: "power4.out",
        scrollTrigger: {
          trigger: headerRef.current,
          start: "top 85%",
        },
      });

      // Cards staggered entrance
      gsap.from(".feature-glow-card", {
        y: 60,
        opacity: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: "expo.out",
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      // Image scale reveal per card
      gsap.from(".card-image", {
        scale: 1.15,
        duration: 1.6,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="features"
      className="relative overflow-hidden bg-charcoal py-32 px-6"
    >
      {/* Subtle grain overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Clay ambient glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 h-[700px] w-[700px] rounded-full blur-[180px] opacity-[0.08] z-0"
        style={{ background: "radial-gradient(circle, #c5a059 0%, transparent 70%)" }}
      />

      <div className="relative mx-auto max-w-7xl z-10">
        {/* Header */}
        <div ref={headerRef} className="mb-20 text-center">
          <div className="mb-6 inline-flex items-center gap-3 overflow-hidden">
            <div className="h-px w-8 bg-clay/50 feat-header-line" />
            <span className="font-dm text-[10px] uppercase tracking-[0.5em] text-clay feat-header-line">
              The Experience
            </span>
            <div className="h-px w-8 bg-clay/50 feat-header-line" />
          </div>

          <h2 className="font-cormorant text-[clamp(40px,5vw,72px)] font-light leading-[1.1] text-warm-white">
            <div className="overflow-hidden pb-2">
              <div className="feat-header-line">Refining the Art of <span className="italic text-clay">Modern Living</span></div>
            </div>
            <div className="overflow-hidden pb-2">
              
            </div>
          </h2>

          <p className="feat-header-line mt-6 font-dm text-base text-stone/60 max-w-lg mx-auto leading-relaxed">
            Four pillars that set a new standard in residential real estate — crafted for those who expect more.
          </p>
        </div>

        {/* 2×2 GlowCard Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8"
        >
          {features.map((feature) => (
            <GlowCard
              key={feature.title}
              glowColor="orange"
              customSize
              className="feature-glow-card group w-full min-h-[420px] flex flex-col overflow-hidden cursor-pointer"
            >
              {/* Image layer */}
              <div className="absolute inset-0 z-0 overflow-hidden rounded-2xl">
                <Image
                  src={feature.image}
                  alt={feature.title}
                  fill
                  className="card-image object-cover opacity-25 transition-opacity duration-700 group-hover:opacity-35"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/65 to-transparent" />
              </div>

              {/* Content */}
              <div className="relative z-10 flex flex-col justify-between h-full p-8 pt-10">
                {/* Top — icon + stat */}
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-clay/10 border border-clay/20 backdrop-blur-sm">
                    <feature.Icon className="h-5 w-5 text-clay" strokeWidth={1.5} />
                  </div>

                  <div className="text-right">
                    <div className="font-cormorant text-3xl font-light text-clay leading-none">
                      {feature.stat}
                    </div>
                    <div className="font-dm text-[9px] uppercase tracking-[0.3em] text-stone/50 mt-0.5">
                      {feature.statLabel}
                    </div>
                  </div>
                </div>

                {/* Bottom — text block */}
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 rounded-full border border-clay/20 bg-clay/5 px-3 py-1">
                    <div className="h-1 w-1 rounded-full bg-clay" />
                    <span className="font-dm text-[9px] uppercase tracking-[0.35em] text-clay/80">
                      {feature.accent}
                    </span>
                  </div>

                  <h3 className="font-cormorant text-[clamp(26px,2.5vw,36px)] font-light leading-tight text-warm-white">
                    {feature.title}
                  </h3>

                  <p className="font-dm text-sm leading-relaxed text-stone/60 max-w-xs">
                    {feature.description}
                  </p>

                  <button className="group/btn mt-2 flex items-center gap-3 text-[9px] uppercase tracking-[0.3em] text-clay transition-colors hover:text-warm-white cursor-pointer">
                    <span className="relative overflow-hidden inline-block pb-0.5">
                      <span className="inline-block transition-transform duration-500 group-hover/btn:-translate-y-[150%]">
                        Explore Detail
                      </span>
                      <span className="absolute left-0 top-0 inline-block translate-y-[150%] transition-transform duration-500 group-hover/btn:translate-y-0 text-warm-white font-medium">
                        Explore Detail
                      </span>
                    </span>
                    <div className="h-px w-5 bg-clay transition-all duration-500 group-hover/btn:w-10 group-hover/btn:bg-warm-white" />
                  </button>
                </div>
              </div>
            </GlowCard>
          ))}
        </div>
      </div>
    </section>
  );
}
