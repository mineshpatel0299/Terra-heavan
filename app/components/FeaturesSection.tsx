"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Compass, Home, Key, ShieldCheck } from "lucide-react";
import Image from "next/image";

const features = [
  {
    title: "Curated Properties",
    description:
      "Hand-picked residences that honour local terroir, sustainability, and enduring craftsmanship.",
    Icon: Home,
    accent: "Thoughtfully selected",
    image: "/images/features/curated.png",
  },
  {
    title: "Verified Listings",
    description:
      "Every opportunity is vetted, documented, and staged with absolute transparency.",
    Icon: ShieldCheck,
    accent: "100% authenticated",
    image: "/images/features/verified.png",
  },
  {
    title: "End-to-End Support",
    description:
      "Concierge-level guidance from site visits to ownership handover and beyond.",
    Icon: Key,
    accent: "Full lifecycle care",
    image: "/images/features/support.png",
  },
  {
    title: "Neighbourhood Insights",
    description:
      "Hyper-local intelligence on schools, culture, connectivity, and future value corridors.",
    Icon: Compass,
    accent: "Data-informed living",
    image: "/images/features/neighborhood.png",
  },
];

export default function FeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const cleanupFns: (() => void)[] = [];

    const ctx = gsap.context(() => {
      // Premium Header Entrance
      gsap.from(".header-line", {
        y: 100,
        opacity: 0,
        rotationZ: 2,
        duration: 1.4,
        stagger: 0.15,
        ease: "power4.out",
        scrollTrigger: {
          trigger: headerRef.current,
          start: "top 85%",
        },
      });

      // Cards and Images entrance
      cardRefs.current.forEach((card, index) => {
        if (!card) return;
        const imageWrapper = imageRefs.current[index];
        if (!imageWrapper) return;

        const imageContainer = imageWrapper.querySelector(".image-clip-container");
        const image = imageWrapper.querySelector("img");
        const badge = imageWrapper.querySelector(".feature-badge");
        const contentElements = card.querySelectorAll(".content-elem");
        const isEven = index % 2 === 0;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        });

        // Advanced Image Reveal (Diagonal Clip Path)
        if (imageContainer) {
          gsap.set(imageContainer, { 
            clipPath: isEven ? "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)" : "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)" 
          });
        }
        if (image) gsap.set(image, { scale: 1.5, transformOrigin: "center center" });
        
        if (imageContainer) {
          tl.to(imageContainer, {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            duration: 1.8,
            ease: "expo.inOut",
          });
        }
        
        if (image) {
          tl.to(image, {
            scale: 1,
            duration: 1.8,
            ease: "power3.out",
          }, "-=1.8");
        }
        
        // Staggered text reveal
        gsap.set(contentElements, { y: 40, opacity: 0 });
        tl.to(contentElements, {
          y: 0,
          opacity: 1,
          duration: 1.2,
          stagger: 0.15,
          ease: "expo.out",
        }, "-=1.2");

        // Line expansion
        const line = card.querySelector(".content-line");
        if (line) {
          gsap.set(line, { scaleX: 0, transformOrigin: "left center" });
          tl.to(line, {
             scaleX: 1,
             duration: 1.2,
             ease: "power4.out"
          }, "-=1.4");
        }

        // Badge bounce
        if (badge) {
          gsap.set(badge, { scale: 0, opacity: 0, rotation: -15 });
          tl.to(badge, {
            scale: 1,
            opacity: 1,
            rotation: 0,
            duration: 1.2,
            ease: "elastic.out(1, 0.5)",
          }, "-=1.0");
        }

        // Parallax effect on scroll inside container
        if (image) {
          gsap.to(image, {
            yPercent: 10,
            ease: "none",
            scrollTrigger: {
              trigger: imageWrapper,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.5,
            },
          });
        }
      });

      // 3D Hover Tilt Effect
      imageRefs.current.forEach((wrapper) => {
        if (!wrapper) return;
        const container = wrapper.querySelector(".image-clip-container");
        const image = wrapper.querySelector("img");
        const badge = wrapper.querySelector(".feature-badge");
        
        const handleMouseMove = (e: MouseEvent) => {
          const rect = wrapper.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          
          const xPercent = (x / rect.width - 0.5) * 2;
          const yPercent = (y / rect.height - 0.5) * 2;
          
          if (container) {
            gsap.to(container, {
              rotationY: xPercent * 6,
              rotationX: -yPercent * 6,
              duration: 0.8,
              ease: "power2.out",
              transformPerspective: 1000,
            });
          }
          
          if (image) {
             gsap.to(image, {
               x: xPercent * -10,
               y: yPercent * -10,
               scale: 1.05,
               duration: 0.8,
               ease: "power2.out"
             });
          }

          if (badge) {
             gsap.to(badge, {
               x: xPercent * 20,
               y: yPercent * 20,
               z: 40,
               duration: 0.8,
               ease: "power2.out"
             });
          }
        };
        
        const handleMouseLeave = () => {
          if (container) {
            gsap.to(container, {
              rotationY: 0,
              rotationX: 0,
              duration: 1.5,
              ease: "elastic.out(1, 0.4)",
            });
          }
          if (image) {
             gsap.to(image, {
               x: 0,
               y: 0,
               scale: 1,
               duration: 1.5,
               ease: "elastic.out(1, 0.4)"
             });
          }
          if (badge) {
             gsap.to(badge, {
               x: 0,
               y: 0,
               z: 0,
               duration: 1.5,
               ease: "elastic.out(1, 0.4)"
             });
          }
        };

        wrapper.addEventListener("mousemove", handleMouseMove);
        wrapper.addEventListener("mouseleave", handleMouseLeave);
        
        cleanupFns.push(() => {
          wrapper.removeEventListener("mousemove", handleMouseMove);
          wrapper.removeEventListener("mouseleave", handleMouseLeave);
        });
      });
    }, sectionRef);

    return () => {
      ctx.revert();
      cleanupFns.forEach(fn => fn());
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="features"
      className="relative overflow-hidden bg-[#faf9f6] py-32 px-6"
    >
      {/* Background Decorative Elements */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div 
          className="absolute h-[600px] w-[600px] rounded-full blur-[120px] transition-opacity duration-1000"
          style={{
            background: "radial-gradient(circle, rgba(197, 160, 89, 0.05) 0%, transparent 70%)",
            left: `${mousePosition.x - 300}px`,
            top: `${mousePosition.y - 300}px`,
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl z-10">
        {/* Header Section */}
        <div ref={headerRef} className="mb-24 text-center">
          <div className="mb-6 inline-flex items-center gap-3 overflow-hidden">
            <div className="h-px w-8 bg-clay/40 header-line" />
            <span className="font-dm text-[10px] uppercase tracking-[0.5em] text-clay header-line">
              The Experience
            </span>
            <div className="h-px w-8 bg-clay/40 header-line" />
          </div>
          <h2 className="font-cormorant text-[clamp(40px,5vw,72px)] font-light leading-[1.1] text-charcoal">
            <div className="overflow-hidden pb-2"><div className="header-line">Refining the Art of</div></div>
            <div className="overflow-hidden pb-2"><div className="header-line"><span className="italic text-clay">Modern Living</span></div></div>
          </h2>
        </div>

        {/* Features Grid - Alternating Layout */}
        <div className="space-y-32 md:space-y-48">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`flex flex-col items-center gap-12 md:flex-row ${
                index % 2 === 1 ? "md:flex-row-reverse" : ""
              }`}
            >
              {/* Image Tilt Wrapper */}
              <div 
                ref={(el) => { imageRefs.current[index] = el; }}
                className="relative aspect-[4/5] w-full md:w-1/2 lg:w-3/5"
                style={{ perspective: "1000px" }}
              >
                {/* Clip-path and Overflow container */}
                <div className="image-clip-container relative h-full w-full overflow-hidden rounded-2xl shadow-2xl" style={{ transformStyle: "preserve-3d" }}>
                  <div className="absolute inset-0 z-10 bg-black/5 transition-colors duration-500 hover:bg-black/0 pointer-events-none" />
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                
                {/* Floating Badge (outside overflow to pop out) */}
                <div 
                  className="feature-badge absolute bottom-8 left-8 z-20 flex items-center gap-3 rounded-full bg-white/10 backdrop-blur-md px-6 py-3 border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.1)]"
                  style={{ transform: "translateZ(40px)" }}
                >
                  <feature.Icon className="h-5 w-5 text-white" strokeWidth={1.5} />
                  <span className="font-dm text-[10px] uppercase tracking-widest text-white">
                    {feature.accent}
                  </span>
                </div>
              </div>

              {/* Content Container */}
              <div 
                ref={(el) => { cardRefs.current[index] = el; }}
                className="flex w-full flex-col justify-center space-y-6 md:w-1/2 md:px-12 lg:w-2/5"
              >
                <div className="content-elem content-line h-1 w-12 bg-clay/30" />
                <h3 className="content-elem font-cormorant text-[clamp(32px,3vw,48px)] font-light leading-tight text-charcoal">
                  {feature.title}
                </h3>
                <p className="content-elem font-dm text-base leading-relaxed text-earth/70 lg:text-lg">
                  {feature.description}
                </p>
                <button className="content-elem group mt-4 flex w-fit items-center gap-4 text-[10px] uppercase tracking-[0.3em] text-clay transition-colors hover:text-charcoal cursor-pointer">
                  <span className="relative overflow-hidden inline-block pb-1">
                    <span className="inline-block transition-transform duration-500 group-hover:-translate-y-[150%]">Explore Detail</span>
                    <span className="absolute left-0 top-0 inline-block translate-y-[150%] transition-transform duration-500 group-hover:translate-y-0 text-charcoal font-medium">Explore Detail</span>
                  </span>
                  <div className="h-px w-6 bg-clay transition-all duration-500 group-hover:w-12 group-hover:bg-charcoal" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

