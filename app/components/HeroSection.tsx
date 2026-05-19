"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const phases = [
  "LAYING FOUNDATION",
  "RAISING STRUCTURE",
  "APPLYING FACADE",
  "CONSTRUCTION COMPLETE",
];

export default function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const phaseRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const particleCanvasRef = useRef<HTMLCanvasElement>(null);
  const depthMapRef = useRef<HTMLDivElement>(null);

  const targetTimeRef = useRef(0);
  const rafIdRef = useRef(0);
  const currentPhaseRef = useRef(-1);
  const hintShownRef = useRef(true);

  // Particle system
  useEffect(() => {
    const canvas = particleCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    interface Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      depth: number;
    }

    const particles: Particle[] = [];
    const particleCount = 35;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.5 + 0.2,
        depth: Math.random(),
      });
    }

    let frameCount = 0;
    const animate = () => {
      frameCount++;
      // Render every 2nd frame for performance (30fps)
      if (frameCount % 2 === 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach((p) => {
          p.x += p.speedX;
          p.y += p.speedY;

          if (p.x < 0) p.x = canvas.width;
          if (p.x > canvas.width) p.x = 0;
          if (p.y < 0) p.y = canvas.height;
          if (p.y > canvas.height) p.y = 0;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(197, 160, 89, ${p.opacity * (0.5 + p.depth * 0.5)})`;
          ctx.fill();
        });

        // Draw connections
        particles.forEach((p1, i) => {
          if (i % 3 !== 0) return; // Skip some connections for performance
          particles.slice(i + 1).forEach((p2) => {
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 120) {
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = `rgba(197, 160, 89, ${0.15 * (1 - distance / 120)})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          });
        });
      }

      rafIdRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafIdRef.current);
    };
  }, []);

  // Main scroll and video effects
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

    const setPhase = (index: number) => {
      if (index === currentPhaseRef.current) return;
      phaseRefs.current.forEach((el, i) => {
        if (el) {
          gsap.to(el, {
            opacity: i === index ? 1 : 0,
            y: i === index ? 0 : 20,
            duration: 0.5,
            ease: "power2.out",
          });
        }
      });
      currentPhaseRef.current = index;
    };

    let scrubTrigger: ScrollTrigger | null = null;
    const mm = gsap.matchMedia();

    const setupScrub = () => {
      if (scrubTrigger) return;

      phaseRefs.current.forEach((el, i) => {
        if (el) {
          gsap.set(el, { opacity: i === 0 ? 1 : 0, y: i === 0 ? 0 : 20 });
        }
      });
      currentPhaseRef.current = 0;

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

          setPhase(Math.min(phases.length - 1, Math.floor(self.progress / 0.25)));

          if (hintRef.current) {
            if (self.progress >= 0.05 && hintShownRef.current) {
              hintShownRef.current = false;
              hintRef.current.style.opacity = "0";
              hintRef.current.style.pointerEvents = "none";
            } else if (self.progress < 0.05 && !hintShownRef.current) {
              hintShownRef.current = true;
              hintRef.current.style.opacity = "1";
            }
          }

          // Depth map parallax
          if (depthMapRef.current) {
            const depth = self.progress * 100;
            depthMapRef.current.style.transform = `translateZ(${depth}px)`;
            depthMapRef.current.style.opacity = `${0.1 + self.progress * 0.3}`;
          }
        },
      });
    };

    if (video.readyState >= 1) {
      setupScrub();
    } else {
      video.addEventListener("loadedmetadata", setupScrub);
    }

    mm.add("(min-width: 768px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapper,
          start: "top top",
          end: () => `+=${wrapper.offsetHeight * 0.45}`,
          scrub: 1.2,
        },
      });

      // Cinematic dispersal
      tl.to(heroContent, {
        scale: 1.35,
        z: 400,
        rotateX: -25,
        rotateY: 10,
        opacity: 0,
        filter: "blur(30px)",
        ease: "power2.inOut",
      }, 0);

      tl.to(".hero-line-1", {
        x: -200,
        y: -100,
        rotation: -15,
        opacity: 0,
        ease: "power1.out",
      }, 0);

      tl.to(".hero-line-2", {
        x: 200,
        y: 80,
        rotation: 15,
        opacity: 0,
        ease: "power1.out",
      }, 0);

      tl.to(".hero-eyebrow", {
        y: -200,
        opacity: 0,
        letterSpacing: "1em",
        ease: "power1.in",
      }, 0);

      tl.to(".hero-subtitle", {
        y: 150,
        opacity: 0,
        filter: "blur(10px)",
        ease: "power1.in",
      }, 0.05);

      tl.to(".hero-cta", {
        scale: 0.5,
        y: 250,
        rotateX: -45,
        opacity: 0,
        ease: "power1.in",
      }, 0.1);

      // Particle explosion on scroll
      tl.to(particleCanvasRef.current, {
        opacity: 0,
        scale: 1.5,
      }, 0.3);

      return () => tl.kill();
    });

    const entryTl = gsap.timeline({
      defaults: { ease: "expo.out" },
      delay: 0.3,
    });

    entryTl.fromTo(
      heroContent,
      { opacity: 0, scale: 0.85, y: 60, rotateX: 15 },
      { opacity: 1, scale: 1, y: 0, rotateX: 0, duration: 2 }
    );

    entryTl.from(
      ".hero-line-1, .hero-line-2",
      {
        y: 100,
        opacity: 0,
        rotationX: 45,
        stagger: 0.2,
        duration: 1.8,
      },
      "-=1.6"
    );

    entryTl.from(
      ".hero-eyebrow",
      {
        y: 30,
        opacity: 0,
        letterSpacing: "0em",
        duration: 1.4,
      },
      "-=1.2"
    );

    entryTl.from(
      ".hero-subtitle",
      {
        y: 20,
        opacity: 0,
        duration: 1.2,
      },
      "-=1"
    );

    entryTl.from(
      ".hero-cta",
      {
        y: 40,
        opacity: 0,
        scale: 0.9,
        duration: 1.2,
      },
      "-=0.8"
    );

    entryTl.from(
      particleCanvasRef.current,
      {
        opacity: 0,
        duration: 2,
      },
      "-=2"
    );

    return () => {
      cancelAnimationFrame(videoRafId);
      video.removeEventListener("loadedmetadata", setupScrub);
      scrubTrigger?.kill();
      mm.revert();
      entryTl.kill();
    };
  }, []);

  return (
    <section ref={wrapperRef} data-hero-section className="relative h-[400vh] w-full">
      <div className="sticky top-0 h-screen w-full overflow-hidden" style={{ perspective: "1500px" }}>
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

        {/* Particle overlay */}
        <canvas
          ref={particleCanvasRef}
          className="pointer-events-none absolute inset-0 z-30 opacity-70"
          style={{ mixBlendMode: "screen" }}
        />

        {/* Depth map layer */}
        <div
          ref={depthMapRef}
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            background: "radial-gradient(ellipse at center, transparent 0%, rgba(197, 160, 89, 0.1) 50%, rgba(28, 28, 27, 0.4) 100%)",
            transformStyle: "preserve-3d",
          }}
        />

        {/* Overlays */}
        <div className="pointer-events-none absolute inset-0 z-20" aria-hidden>
          <div
            className="absolute inset-0"
            style={{
              background: [
                "linear-gradient(to bottom, rgba(28,28,27,0.9) 0%, transparent 30%, transparent 70%, rgba(28,28,27,0.9) 100%)",
                "radial-gradient(ellipse at center, transparent 20%, rgba(28,28,27,0.8) 100%)",
              ].join(", "),
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              boxShadow: "inset 150px 0 200px -80px rgba(0,0,0,0.5), inset -150px 0 200px -80px rgba(0,0,0,0.5), inset 0 0 300px 100px rgba(0,0,0,0.4)",
            }}
          />
        </div>

        {/* Animated grid lines */}
        <div className="pointer-events-none absolute inset-0 z-15 opacity-20">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(rgba(197, 160, 89, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(197, 160, 89, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: "100px 100px",
            }}
          />
        </div>

        {/* Corner decorations */}
        <div className="pointer-events-none absolute inset-0 z-30 hidden md:block" aria-hidden>
          <div className="absolute top-8 left-8 h-16 w-16 border-t-2 border-l-2 border-clay/30" />
          <div className="absolute top-8 right-8 h-16 w-16 border-t-2 border-r-2 border-clay/30" />
          <div className="absolute bottom-8 left-8 h-16 w-16 border-b-2 border-l-2 border-clay/30" />
          <div className="absolute bottom-8 right-8 h-16 w-16 border-b-2 border-r-2 border-clay/30" />
        </div>

        {/* Hero content */}
        <div
          className="absolute inset-0 flex items-center justify-center px-6 text-center"
          style={{ perspective: "1200px", transformStyle: "preserve-3d" }}
        >
          <div
            ref={heroContentRef}
            className="relative z-20 mx-auto w-full max-w-5xl space-y-8 px-4 pt-16 text-sand sm:px-10"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className="hero-eyebrow flex items-center justify-center gap-5" style={{ transform: "translateZ(50px)" }}>
              <span className="h-px w-16 bg-gradient-to-r from-transparent to-clay/60" aria-hidden />
              <span className="font-dm text-[11px] font-semibold uppercase tracking-[0.6em] text-clay drop-shadow-lg">
                Real Estate Redefined
              </span>
              <span className="h-px w-16 bg-gradient-to-l from-transparent to-clay/60" aria-hidden />
            </div>

            <h1 className="font-cormorant text-[clamp(42px,7vw,120px)] font-bold leading-[0.95] text-sand " style={{ transform: "translateZ(100px)" }}>
              <div className="hero-line-1 inline-block transition-transform duration-300" style={{ transformStyle: "preserve-3d" }}>
                Where Earth
              </div>
              <div className="hero-line-2 mt-2 inline-block transition-transform duration-300" style={{ transformStyle: "preserve-3d" }}>
                Meets <em className="italic text-clay">Elegance</em>
              </div>
            </h1>

            {/* <p className="hero-subtitle mx-auto max-w-lg font-dm text-[13px] font-medium uppercase tracking-[0.35em] text-sand/90 drop-shadow-lg" style={{ transform: "translateZ(75px)" }}>
              Scroll to witness architecture assemble before your eyes
            </p> */}

            <div className="hero-cta pt-4" style={{ transform: "translateZ(60px)" }}>
              {/* <Link
                href="#floor-plans"
                className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-clay px-10 py-4 font-dm text-[12px] font-bold uppercase tracking-[0.4em] text-cream transition-all duration-500 hover:bg-clay-dark hover:gap-5 hover:shadow-2xl hover:shadow-clay/30"
              >
                <span className="relative z-10">Discover Homes</span>
                <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">→</span>
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              </Link> */}
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div
          className="pointer-events-none absolute right-8 top-1/2 hidden -translate-y-1/2 flex-col items-center gap-4 md:flex"
          aria-hidden
        >
          <span
            className="font-dm text-[9px] uppercase tracking-[0.5em] text-sand/50"
            style={{ writingMode: "vertical-rl" }}
          >
            Build Progress
          </span>
          <div className="relative h-[140px] w-[3px] overflow-hidden rounded-full bg-sand/15">
            <div
              ref={progressFillRef}
              className="absolute top-0 w-full rounded-full bg-gradient-to-b from-clay to-clay/70"
              style={{ height: "0%", boxShadow: "0 0 20px rgba(197, 160, 89, 0.5)" }}
            />
          </div>
          <span
            className="font-dm text-[9px] uppercase tracking-[0.5em] text-sand/50"
            style={{ writingMode: "vertical-rl" }}
          >
            0-100%
          </span>
        </div>

        {/* Phase text */}
        <div
          className="pointer-events-none absolute bottom-12 left-1/2 hidden h-8 w-80 -translate-x-1/2 items-center justify-center md:flex"
          aria-hidden
        >
          {phases.map((phase, index) => (
            <span
              key={phase}
              ref={(el) => { phaseRefs.current[index] = el; }}
              className="absolute font-dm text-[10px] uppercase tracking-[0.6em] text-clay"
              style={{ textShadow: "0 0 20px rgba(197, 160, 89, 0.5)" }}
            >
              {phase}
            </span>
          ))}
        </div>

        {/* Scroll hint */}
        <div
          ref={hintRef}
          className="pointer-events-none absolute bottom-24 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex"
          style={{ opacity: 1, transition: "opacity 0.4s ease" }}
          aria-hidden
        >
          <span className="font-dm text-[10px] uppercase tracking-[0.5em] text-sand/60">
            Scroll to Build
          </span>
          <div className="scroll-hint-line" />
        </div>
      </div>
    </section>
  );
}
