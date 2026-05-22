"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const stats = [
  { value: "200+", label: "Curated Homes" },
  { value: "15yr", label: "Market Expertise" },
  { value: "98%", label: "Client Retention" },
];

export default function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);

  const targetTimeRef = useRef(0);
  const rafIdRef = useRef(0);

  // Video scrub on scroll
  useEffect(() => {
    const video = videoRef.current;
    const wrapper = wrapperRef.current;
    const heroContent = heroContentRef.current;
    if (!video || !wrapper || !heroContent) return;

    gsap.registerPlugin(ScrollTrigger);

    let videoRafId: number;

    const tick = () => {
      if (video.readyState >= 2 && video.duration > 0) {
        const target = targetTimeRef.current;
        const delta = target - video.currentTime;
        if (Math.abs(delta) > 0.013) {
          if (typeof (video as unknown as { fastSeek(n: number): void }).fastSeek === "function") {
            (video as unknown as { fastSeek(n: number): void }).fastSeek(target);
          } else {
            video.currentTime = target;
          }
        }
      }
      videoRafId = requestAnimationFrame(tick);
    };
    videoRafId = requestAnimationFrame(tick);

    let scrubTrigger: ScrollTrigger | null = null;

    const setupScrub = () => {
      if (scrubTrigger) return;
      scrubTrigger = ScrollTrigger.create({
        trigger: wrapper,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.5,
        onUpdate: (self) => {
          if (video.duration > 0) {
            targetTimeRef.current = self.progress * video.duration;
          }
          if (progressFillRef.current) {
            progressFillRef.current.style.height = `${self.progress * 100}%`;
          }
          if (hintRef.current) {
            hintRef.current.style.opacity = self.progress >= 0.04 ? "0" : "1";
          }
        },
      });
    };

    // Hide all text initially — visible only mid-scroll
    gsap.set(
      [".hero-eyebrow", ".hero-line-1", ".hero-line-2", ".hero-stats"],
      { opacity: 0, y: 32 }
    );

    if (video.readyState >= 1) {
      setupScrub();
    } else {
      video.addEventListener("loadedmetadata", setupScrub);
    }

    // Text reveal — fires when user reaches ~85% of the 400vh scroll
    const revealTl = gsap.timeline({
      paused: true,
      defaults: { ease: "expo.out" },
    });

    revealTl
      .to(".hero-eyebrow", { opacity: 1, y: 0, duration: 1.0 })
      .to(".hero-line-1",  { opacity: 1, y: 0, duration: 1.2 }, "-=0.7")
      .to(".hero-line-2",  { opacity: 1, y: 0, duration: 1.2 }, "-=1.0")
      .to(".hero-stats",   { opacity: 1, y: 0, duration: 0.8 }, "-=0.6");

    // "50% top" = halfway through the 400vh scroll
    ScrollTrigger.create({
      trigger: wrapper,
      start: "50% top",
      toggleActions: "play none none reverse",
      onEnter: () => revealTl.play(),
      onLeaveBack: () => revealTl.reverse(),
    });

    return () => {
      cancelAnimationFrame(videoRafId);
      video.removeEventListener("loadedmetadata", setupScrub);
      scrubTrigger?.kill();
      revealTl.kill();
    };
  }, []);

  return (
    <section ref={wrapperRef} data-hero-section className="relative h-[400vh] w-full">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Video */}
        <video
          ref={videoRef}
          src="https://res.cloudinary.com/djicxkd9u/video/upload/q_auto/f_auto/v1775629700/gg_nnsczj.mp4"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ transform: "translateZ(0)", willChange: "transform" }}
          muted
          playsInline
          preload="auto"
        />

        {/* Overlays */}
        <div className="pointer-events-none absolute inset-0 z-10" aria-hidden>
          {/* Main vignette — heavier centre darkening for text legibility */}
          <div
            className="absolute inset-0"
            style={{
              background: [
                "linear-gradient(to bottom, rgba(17,17,17,0.72) 0%, rgba(17,17,17,0.25) 40%, rgba(17,17,17,0.25) 60%, rgba(17,17,17,0.80) 100%)",
                "radial-gradient(ellipse 80% 70% at 50% 50%, rgba(17,17,17,0.15) 0%, rgba(17,17,17,0.65) 100%)",
              ].join(", "),
            }}
          />
          {/* Side fade */}
          <div
            className="absolute inset-0 hidden md:block"
            style={{
              boxShadow:
                "inset 120px 0 180px -80px rgba(0,0,0,0.45), inset -120px 0 180px -80px rgba(0,0,0,0.45)",
            }}
          />
        </div>

        {/* Corner accents */}
        <div className="pointer-events-none absolute inset-0 z-20 hidden md:block" aria-hidden>
          <div className="absolute top-8 left-8 h-14 w-14 border-t border-l border-clay/25" />
          <div className="absolute top-8 right-8 h-14 w-14 border-t border-r border-clay/25" />
          <div className="absolute bottom-8 left-8 h-14 w-14 border-b border-l border-clay/25" />
          <div className="absolute bottom-8 right-8 h-14 w-14 border-b border-r border-clay/25" />
        </div>

        {/* Hero content */}
        <div className="absolute inset-0 z-30 flex items-center justify-center px-6 text-center">
          <div
            ref={heroContentRef}
            className="mx-auto w-full max-w-5xl space-y-7 px-4 pt-16 sm:px-10"
          >
            {/* Eyebrow */}
            <div className="hero-eyebrow flex items-center justify-center gap-5">
              <span className="h-px w-16 bg-gradient-to-r from-transparent to-clay/50" aria-hidden />
              <span className="font-dm text-[10px] font-medium uppercase tracking-[0.65em] text-clay">
                Real Estate Redefined
              </span>
              <span className="h-px w-16 bg-gradient-to-l from-transparent to-clay/50" aria-hidden />
            </div>

            {/* Heading */}
            <h1
              className="font-cormorant text-[clamp(48px,7.5vw,116px)] font-light leading-[0.95] text-warm-white"
              style={{ textShadow: "0 2px 40px rgba(0,0,0,0.4)" }}
            >
              <div className="hero-line-1 block">Where Earth</div>
              <div className="hero-line-2 block mt-1">
                Meets <em className="text-clay" >Elegance</em>
              </div>
            </h1>


            {/* Stats row */}
            <div className="hero-stats pt-6 flex items-center justify-center gap-10 md:gap-16">
              {stats.map((s, i) => (
                <div key={s.label} className="flex flex-col items-center gap-1">
                  {i > 0 && (
                    <div className="absolute -left-5 md:-left-8 top-1/2 h-6 w-px -translate-y-1/2 bg-clay/20 hidden md:block" />
                  )}
                  <span className="font-cormorant text-2xl font-light text-clay leading-none">
                    {s.value}
                  </span>
                  <span className="font-dm text-[9px] uppercase tracking-[0.4em] text-warm-white/40">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll progress — right side */}
        <div
          className="pointer-events-none absolute right-8 top-1/2 hidden -translate-y-1/2 flex-col items-center gap-4 md:flex z-30"
          aria-hidden
        >
          <div className="relative h-[120px] w-px overflow-hidden bg-warm-white/10">
            <div
              ref={progressFillRef}
              className="absolute top-0 w-full bg-gradient-to-b from-clay to-clay/50"
              style={{ height: "0%", transition: "height 0.1s linear" }}
            />
          </div>
          <span
            className="font-dm text-[8px] uppercase tracking-[0.5em] text-warm-white/30"
            style={{ writingMode: "vertical-rl" }}
          >
            Scroll
          </span>
        </div>

        {/* Scroll hint — bottom centre */}
        <div
          ref={hintRef}
          className="pointer-events-none absolute bottom-10 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex z-30"
          style={{ opacity: 1, transition: "opacity 0.6s ease" }}
          aria-hidden
        >
          <div className="h-10 w-px bg-gradient-to-b from-clay/60 to-transparent animate-pulse" />
          <span className="font-dm text-[8px] uppercase tracking-[0.6em] text-warm-white/35">
            Scroll
          </span>
        </div>
      </div>
    </section>
  );
}
