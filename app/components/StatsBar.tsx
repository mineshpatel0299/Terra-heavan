"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const stats = [
  { label: "Properties Sold", value: 2400, suffix: "+", prefix: "" },
  { label: "Client Satisfaction", value: 98, suffix: "%", prefix: "" },
  { label: "Years Experience", value: 15, suffix: "+", prefix: "" },
  { label: "Expert Agents", value: 50, suffix: "+", prefix: "" },
];

export default function StatsBar() {
  const sectionRef = useRef<HTMLElement>(null);
  const cubeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const hasAnimated = useRef(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Section entrance
      gsap.from(sectionRef.current, {
        opacity: 0,
        y: 50,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });

      // Slot machine animation
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 75%",
        onEnter: () => {
          if (hasAnimated.current) return;
          hasAnimated.current = true;

          stats.forEach((stat, index) => {
            const cube = cubeRefs.current[index];
            if (!cube) return;

            // Animate cube rotation
            gsap.to(cube, {
              rotateX: 720 + (Math.random() * 360),
              duration: 2 + index * 0.3,
              ease: "power4.out",
              onUpdate: function() {
                const progress = this.progress();
                const currentValue = Math.floor(progress * stat.value);
                const faces = cube.querySelectorAll('.stat-face');
                faces.forEach((face, i) => {
                  const faceValue = Math.min(stat.value, Math.max(0, currentValue + i - 1));
                  face.textContent = `${stat.prefix}${faceValue.toLocaleString("en-IN")}${stat.suffix}`;
                });
              },
              onComplete: () => {
                // Snap to final
                gsap.to(cube, {
                  rotateX: 0,
                  duration: 0.6,
                  ease: "back.out(1.7)",
                });
              }
            });
          });
        },
      });

      // Hover tilt effect
      cubeRefs.current.forEach((cube) => {
        if (!cube) return;

        cube.addEventListener("mouseenter", () => {
          gsap.to(cube, {
            rotateY: 15,
            scale: 1.05,
            duration: 0.4,
            ease: "power2.out",
          });
        });

        cube.addEventListener("mouseleave", () => {
          gsap.to(cube, {
            rotateY: 0,
            scale: 1,
            duration: 0.4,
            ease: "power2.out",
          });
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative overflow-hidden bg-sand py-24 px-6"
      style={{ perspective: "1000px" }}
    >
      {/* Animated background lines */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute h-px w-full bg-gradient-to-r from-transparent via-clay/10 to-transparent"
            style={{
              top: `${20 + i * 15}%`,
              animation: `slideLine ${8 + i * 2}s linear infinite`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </div>

      {/* Top rule */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-clay/40 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-clay/40 to-transparent" />

      <div className="relative mx-auto max-w-6xl">
        {/* Section header */}
        <div className="mb-16 text-center">
          <div className="flex items-center justify-center gap-4">
            <span className="h-px w-12 bg-clay/40" aria-hidden />
            <p className="font-dm text-[10px] uppercase tracking-[0.6em] text-clay/70">
              Our Track Record
            </p>
            <span className="h-px w-12 bg-clay/40" aria-hidden />
          </div>
        </div>

        {/* 3D Slot machine stats */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-6">
          {stats.map(({ label, value, suffix, prefix }, index) => (
            <div
              key={label}
              className="group flex flex-col items-center gap-4 text-center"
            >
              {/* 3D Cube container */}
              <div
                ref={(el) => { cubeRefs.current[index] = el; }}
                className="relative h-24 w-full cursor-pointer"
                style={{
                  transformStyle: "preserve-3d",
                  perspective: "600px",
                }}
              >
                {/* Front face */}
                <div
                  className="stat-face absolute inset-0 flex items-center justify-center font-cormorant text-[clamp(36px,5vw,56px)] font-light leading-none text-clay"
                  style={{
                    backfaceVisibility: "hidden",
                    textShadow: "0 0 30px rgba(197, 160, 89, 0.3)",
                  }}
                >
                  {prefix}0{suffix}
                </div>

                {/* Back face */}
                <div
                  className="stat-face absolute inset-0 flex items-center justify-center font-cormorant text-[clamp(36px,5vw,56px)] font-light leading-none text-clay/30"
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateX(180deg)",
                  }}
                >
                  {prefix}0{suffix}
                </div>

                {/* Top face */}
                <div
                  className="stat-face absolute inset-0 flex items-center justify-center font-cormorant text-[clamp(36px,5vw,56px)] font-light leading-none text-clay/50"
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateX(90deg) translateZ(48px)",
                  }}
                >
                  {prefix}0{suffix}
                </div>

                {/* Bottom face */}
                <div
                  className="stat-face absolute inset-0 flex items-center justify-center font-cormorant text-[clamp(36px,5vw,56px)] font-light leading-none text-clay/50"
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateX(-90deg) translateZ(48px)",
                  }}
                >
                  {prefix}0{suffix}
                </div>

                {/* Glow effect */}
                <div
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    background: "radial-gradient(ellipse at center, rgba(197, 160, 89, 0.15) 0%, transparent 70%)",
                  }}
                />
              </div>

              <div className="space-y-1">
                <p className="font-dm text-[10px] uppercase tracking-[0.5em] text-earth/50">
                  {label}
                </p>
                <div className="mx-auto h-px w-8 bg-clay/20" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes slideLine {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </section>
  );
}
