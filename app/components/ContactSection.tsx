"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Mail, MapPin, Phone, Send, CheckCircle2 } from "lucide-react";

const contactInfo = [
  {
    label: "Call Us",
    value: "+91 98765 43210",
    Icon: Phone,
    href: "tel:+919876543210",
  },
  {
    label: "Email Us",
    value: "hello@terrahaven.in",
    Icon: Mail,
    href: "mailto:hello@terrahaven.in",
  },
  {
    label: "Visit Us",
    value: "106 Terra Street, Bengaluru",
    Icon: MapPin,
    href: "#",
  },
];

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });
  const inputRefs = useRef<(HTMLInputElement | HTMLTextAreaElement | null)[]>([]);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Section entrance
      gsap.from(sectionRef.current, {
        opacity: 0,
        duration: 1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
        },
      });

      // Contact cards stagger
      gsap.from(".contact-card", {
        x: -50,
        opacity: 0,
        rotateY: -30,
        stagger: 0.15,
        duration: 1,
        ease: "power3.out",
        transformPerspective: 1000,
        scrollTrigger: {
          trigger: ".contact-cards",
          start: "top 80%",
        },
      });

      // Form entrance with liquid morph
      gsap.from(formRef.current, {
        y: 80,
        opacity: 0,
        scale: 0.95,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: formRef.current,
          start: "top 80%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);

    // Particle explosion animation
    const form = formRef.current;
    if (form) {
      gsap.to(form, {
        scale: 1.02,
        duration: 0.2,
        yoyo: true,
        repeat: 1,
      });
    }

    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ firstName: "", lastName: "", email: "", phone: "", message: "" });
    }, 3000);
  };

  const handleFocus = (fieldName: string) => {
    setFocusedField(fieldName);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative bg-warm-white py-32 px-6 overflow-hidden"
    >
      {/* Animated background */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: "radial-gradient(ellipse at 30% 20%, rgba(197, 160, 89, 0.08), transparent 50%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: "radial-gradient(ellipse at 70% 80%, rgba(197, 160, 89, 0.1), transparent 50%)",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-16 space-y-4 text-center">
          <div className="flex items-center justify-center gap-4">
            <span className="h-px w-12 bg-clay/40" aria-hidden />
            <p className="font-dm text-[10px] uppercase tracking-[0.6em] text-clay">
              Get In Touch
            </p>
            <span className="h-px w-12 bg-clay/40" aria-hidden />
          </div>
          <h2 className="font-cormorant text-[clamp(32px,4.5vw,56px)] font-light leading-tight text-charcoal">
            Let&rsquo;s Start a <em className="italic text-clay">Conversation</em>
          </h2>
        </div>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Left — contact info */}
          <div className="flex flex-col gap-8">
            <p className="font-dm text-sm leading-relaxed text-earth/60 max-w-sm">
              Whether you&rsquo;re searching for your first home or building a portfolio — we&rsquo;re here to make it effortless.
            </p>

            <div className="contact-cards flex flex-col gap-4">
              {contactInfo.map(({ label, value, Icon, href }) => (
                <a
                  key={label}
                  href={href}
                  className="contact-card group flex items-center gap-5 rounded-2xl border border-stone/25 bg-cream/80 p-5 backdrop-blur-sm transition-all duration-300 hover:border-clay/40 hover:shadow-xl hover:shadow-clay/5"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-clay/20 bg-clay/5 text-clay transition-all duration-300 group-hover:border-clay/40 group-hover:bg-clay/15 group-hover:scale-110"
                    style={{ backgroundColor: "rgba(197,160,89,0.06)" }}
                  >
                    <Icon className="h-5 w-5" strokeWidth={1.4} />
                  </div>
                  <div>
                    <p className="font-dm text-[9px] uppercase tracking-[0.45em] text-earth/45">
                      {label}
                    </p>
                    <p className="font-cormorant text-lg font-medium text-earth transition-colors duration-300 group-hover:text-clay">
                      {value}
                    </p>
                  </div>
                </a>
              ))}
            </div>

            <blockquote className="border-l-2 border-clay/40 pl-5">
              <p className="font-cormorant text-xl italic leading-relaxed text-earth/50">
                &ldquo;The right home doesn&rsquo;t just shelter you — it elevates you.&rdquo;
              </p>
            </blockquote>
          </div>

          {/* Right — liquid form */}
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="relative rounded-2xl border border-stone/25 bg-cream/90 p-8 shadow-xl shadow-clay/5 backdrop-blur-sm overflow-hidden"
          >
            {/* Focus spotlight */}
            <div
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300"
              style={{
                background: focusedField
                  ? `radial-gradient(600px circle at var(--focus-x, 50%) var(--focus-y, 50%), rgba(197, 160, 89, 0.08), transparent 50%)`
                  : "transparent",
                opacity: focusedField ? 1 : 0,
              }}
            />

            {isSubmitted ? (
              <div className="flex h-80 flex-col items-center justify-center gap-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-cormorant text-2xl text-charcoal">Message Sent!</h3>
                <p className="font-dm text-sm text-earth/60">We&rsquo;ll be in touch within 24 hours.</p>
              </div>
            ) : (
              <>
                <div className="grid gap-7 sm:grid-cols-2">
                  {[
                    { name: "firstName", label: "First Name", type: "text" },
                    { name: "lastName", label: "Last Name", type: "text" },
                    { name: "email", label: "Email", type: "email" },
                    { name: "phone", label: "Phone", type: "tel" },
                  ].map((field) => (
                    <div key={field.name} className="flex flex-col gap-2 relative">
                      <label
                        htmlFor={field.name}
                        className={`font-dm text-[9px] uppercase tracking-[0.45em] transition-colors duration-300 ${
                          focusedField === field.name ? "text-clay" : "text-earth/50"
                        }`}
                      >
                        {field.label}
                      </label>
                      <input
                        id={field.name}
                        name={field.name}
                        type={field.type}
                        value={formData[field.name as keyof typeof formData]}
                        onChange={handleInputChange}
                        onFocus={() => handleFocus(field.name)}
                        onBlur={handleBlur}
                        className="peer relative border-b border-stone/30 bg-transparent py-2 font-dm text-sm text-earth outline-none transition-all duration-300 focus:border-clay"
                        style={{ transformOrigin: "left" }}
                      />
                      <div
                        className="absolute bottom-0 left-0 h-px bg-clay transition-transform duration-300 origin-left"
                        style={{
                          width: "100%",
                          transform: focusedField === field.name ? "scaleX(1)" : "scaleX(0)",
                        }}
                      />
                    </div>
                  ))}
                </div>

                <div className="mt-7 flex flex-col gap-2 relative">
                  <label
                    htmlFor="message"
                    className={`font-dm text-[9px] uppercase tracking-[0.45em] transition-colors duration-300 ${
                      focusedField === "message" ? "text-clay" : "text-earth/50"
                    }`}
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleInputChange}
                    onFocus={() => handleFocus("message")}
                    onBlur={handleBlur}
                    className="peer relative border-b border-stone/30 bg-transparent py-2 font-dm text-sm text-earth outline-none transition-all duration-300 focus:border-clay resize-none"
                  />
                  <div
                    className="absolute bottom-0 left-0 h-px bg-clay transition-transform duration-300 origin-left"
                    style={{
                      width: "100%",
                      transform: focusedField === "message" ? "scaleX(1)" : "scaleX(0)",
                    }}
                  />
                </div>

                <button
                  type="submit"
                  className="group mt-8 w-full rounded-full bg-charcoal py-4 font-dm text-[11px] font-semibold uppercase tracking-[0.4em] text-cream transition-all duration-500 hover:bg-clay hover:shadow-lg hover:shadow-clay/20 flex items-center justify-center gap-3"
                >
                  <span>Send Inquiry</span>
                  <Send className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </button>

                <p className="mt-4 text-center font-dm text-[10px] text-earth/35">
                  We respond within one business day.
                </p>
              </>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
