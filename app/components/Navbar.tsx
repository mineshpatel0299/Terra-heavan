"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const navLinks = [
  { label: "Properties", href: "#features" },
  { label: "About", href: "#about" },
  { label: "Plans", href: "#floor-plans" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const navElement = navRef.current;
    const heroTrigger = document.querySelector("[data-hero-section]");
    if (!navElement || !heroTrigger) return;

    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      const trigger = ScrollTrigger.create({
        trigger: heroTrigger,
        start: "bottom top",
        onEnter: () => navElement.classList.add("terra-nav-solid"),
        onLeaveBack: () => navElement.classList.remove("terra-nav-solid"),
      });
      return () => trigger.kill();
    });

    mm.add("(max-width: 767px)", () => {
      navElement.classList.add("terra-nav-solid");
      return () => navElement.classList.remove("terra-nav-solid");
    });

    return () => mm.revert();
  }, []);

  const handleLinkClick = () => setMenuOpen(false);

  return (
    <nav
      ref={navRef}
      className="terra-navbar fixed inset-x-0 top-0 z-[1000] px-6 py-4"
      aria-label="Main navigation"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6">
        {/* Logo */}
        <Link
          href="/"
          className="terra-nav-logo group flex items-center gap-0 text-[11px] font-light uppercase tracking-[0.65em] text-cream transition-colors duration-500"
          aria-label="TerraHaven Home"
        >
          <span>TERRA</span>
          <span className="mx-1 h-4 w-px bg-current opacity-40" aria-hidden />
          <span>HAVEN</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-10 text-[10px] uppercase tracking-[0.5em] md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="terra-nav-link relative text-cream transition-colors duration-500 after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-0 after:bg-clay after:transition-all after:duration-300 hover:text-clay hover:after:w-full"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden items-center md:flex">
          <Link
            href="#contact"
            className="terra-nav-cta rounded-full border border-cream/70 px-6 py-2 text-[10px] uppercase tracking-[0.45em] text-cream transition-all duration-500 hover:border-clay hover:bg-clay hover:text-cream"
          >
            Book a Visit
          </Link>
        </div>

        {/* Hamburger */}
        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          className="terra-hamburger ml-auto flex h-9 w-9 flex-col items-center justify-center gap-[5px] rounded-full border border-cream/60 bg-transparent transition-all duration-300 md:hidden"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
        >
          <span
            className={`block h-px w-5 bg-cream transition-all duration-300 ${
              menuOpen ? "translate-y-[6px] rotate-45" : ""
            }`}
          />
          <span
            className={`block h-px w-5 bg-cream transition-all duration-300 ${
              menuOpen ? "opacity-0 scale-x-0" : ""
            }`}
          />
          <span
            className={`block h-px w-5 bg-cream transition-all duration-300 ${
              menuOpen ? "-translate-y-[6px] -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`absolute inset-x-4 top-full mt-2 origin-top overflow-hidden rounded-2xl border border-stone/20 bg-charcoal/97 backdrop-blur-2xl transition-all duration-300 md:hidden ${
          menuOpen ? "scale-y-100 opacity-100" : "scale-y-95 opacity-0 pointer-events-none"
        }`}
      >
        <div className="p-6">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={handleLinkClick}
                className="rounded-xl px-4 py-3 text-[11px] uppercase tracking-[0.45em] text-cream/80 transition-colors duration-200 hover:bg-white/5 hover:text-clay"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="mt-4 border-t border-white/10 pt-4">
            <Link
              href="#contact"
              onClick={handleLinkClick}
              className="flex w-full items-center justify-center rounded-full bg-clay px-6 py-3 text-[11px] uppercase tracking-[0.45em] text-cream transition-colors duration-300 hover:bg-clay-dark"
            >
              Book a Visit
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
