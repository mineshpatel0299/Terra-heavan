'use client';

import React, { useMemo, useRef, useEffect, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* 1️⃣  Assets ————————————————————————— */
const FALLBACK =
  'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" ' +
  'width="160" height="220"><rect width="100%" height="100%" ' +
  'fill="%23e2e8f0"/><text x="50%" y="50%" dominant-baseline="middle"' +
  ' text-anchor="middle" fill="%234a5568" font-size="18">Image</text></svg>';

/* 2️⃣  Config ————————————————————————— */
const CARD_W = 280;
const CARD_H = 380;
const RADIUS = 420;
const TILT_SENSITIVITY = 10;
const DRAG_SENSITIVITY = 0.5;
const INERTIA_FRICTION = 0.95;
const AUTOSPIN_SPEED = 0.08;
const IDLE_TIMEOUT = 2000;

/* 3️⃣  Card Component —————————————————— */
interface CardProps {
  src: string;
  transform: string;
  cardW: number;
  cardH: number;
  title: string;
  isFocused: boolean;
  onClick: () => void;
}

const Card = React.memo(({ src, transform, cardW, cardH, title, onClick }: CardProps) => (
  <div
    className="absolute pointer-events-auto"
    style={{
      width: cardW,
      height: cardH,
      transform,
      transformStyle: 'preserve-3d',
      willChange: 'transform',
    }}
    onClick={onClick}
  >
    <div
      className="w-full h-full rounded-2xl overflow-hidden bg-white dark:bg-charcoal backdrop-blur-md
                 border border-stone/20 dark:border-white/10 shadow-2xl
                 transition-all duration-500 hover:scale-[1.05] hover:shadow-[0_20px_60px_rgba(0,0,0,0.25)]
                 group cursor-pointer relative"
      style={{ backfaceVisibility: 'hidden' }}
    >
      <img
        src={src}
        alt={title}
        width={cardW}
        height={cardH}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        loading="lazy"
        draggable="false"
        onError={e => {
          e.currentTarget.src = FALLBACK;
        }}
      />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <p className="font-dm text-[9px] uppercase tracking-[0.3em] text-white/60 mb-1">Architectural Layout</p>
        <h4 className="font-cormorant text-lg text-white font-medium">{title}</h4>
      </div>
    </div>
  </div>
));

Card.displayName = 'Card';

/* 4️⃣  Main component —————————————————— */
interface ThreeDCarouselProps {
  images: { src: string; title: string }[];
  radius?: number;
  cardW?: number;
  cardH?: number;
}

const ThreeDCarousel = React.memo(
  ({
    images,
    radius = RADIUS,
    cardW = CARD_W,
    cardH = CARD_H,
  }: ThreeDCarouselProps) => {
    const parentRef = useRef<HTMLDivElement>(null);
    const wheelRef = useRef<HTMLDivElement>(null);

    const [focusedCard, setFocusedCard] = useState<{ src: string; title: string } | null>(null);

    const rotationRef = useRef(0);
    const tiltRef = useRef(-5);
    const targetTiltRef = useRef(-5);
    const velocityRef = useRef(0);
    const isDraggingRef = useRef(false);
    const dragStartRef = useRef(0);
    const initialRotationRef = useRef(0);
    const lastInteractionRef = useRef(Date.now());
    const animationFrameRef = useRef<number | null>(null);

    useEffect(() => {
      const handleMouseMove = (e: MouseEvent) => {
        if (!parentRef.current || isDraggingRef.current || focusedCard) return;

        lastInteractionRef.current = Date.now();
        const parentRect = parentRef.current.getBoundingClientRect();
        const mouseY = e.clientY - parentRect.top;
        const normalizedY = (mouseY / parentRect.height - 0.5) * 2;

        targetTiltRef.current = -normalizedY * TILT_SENSITIVITY - 5;
      };

      window.addEventListener('mousemove', handleMouseMove);

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
      };
    }, [focusedCard]);

    useEffect(() => {
      const animate = () => {
        if (focusedCard) {
            // Keep spinning slowly in background or stop? Let's keep it very slow
            rotationRef.current += 0.02;
        } else if (!isDraggingRef.current) {
          // Apply inertia
          if (Math.abs(velocityRef.current) > 0.01) {
            rotationRef.current += velocityRef.current;
            velocityRef.current *= INERTIA_FRICTION;
          } else if (Date.now() - lastInteractionRef.current > IDLE_TIMEOUT) {
            rotationRef.current += AUTOSPIN_SPEED;
          }
        }

        tiltRef.current += (targetTiltRef.current - tiltRef.current) * 0.1;

        if (wheelRef.current) {
          wheelRef.current.style.transform = `rotateX(${tiltRef.current}deg) rotateY(${rotationRef.current}deg)`;
        }

        animationFrameRef.current = requestAnimationFrame(animate);
      };

      animationFrameRef.current = requestAnimationFrame(animate);

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }, [focusedCard]);

    const handleDragStart = useCallback((clientX: number) => {
      if (focusedCard) return;
      lastInteractionRef.current = Date.now();
      isDraggingRef.current = true;
      velocityRef.current = 0;
      dragStartRef.current = clientX;
      initialRotationRef.current = rotationRef.current;
    }, [focusedCard]);

    const handleDragMove = useCallback((clientX: number) => {
      if (!isDraggingRef.current || focusedCard) return;
      lastInteractionRef.current = Date.now();

      const deltaX = clientX - dragStartRef.current;
      const newRotation = initialRotationRef.current + deltaX * DRAG_SENSITIVITY;

      velocityRef.current = newRotation - rotationRef.current;
      rotationRef.current = newRotation;
    }, [focusedCard]);

    const handleDragEnd = useCallback(() => {
      isDraggingRef.current = false;
      lastInteractionRef.current = Date.now();
    }, []);

    const cards = useMemo(
      () =>
        images.map((item, idx) => {
          const angle = (idx * 360) / images.length;
          return {
            ...item,
            key: idx,
            transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
          };
        }),
      [images, radius]
    );

    return (
      <div
        ref={parentRef}
        className="w-full h-full flex items-center justify-center overflow-visible font-sans"
        style={{ userSelect: 'none' }}
        onMouseDown={(e) => handleDragStart(e.clientX)}
        onMouseMove={(e) => handleDragMove(e.clientX)}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
        onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
        onTouchEnd={handleDragEnd}
      >
        <div
          className="relative pointer-events-none"
          style={{
            perspective: 2000,
            perspectiveOrigin: '50% 50%',
            width: '100%',
            height: Math.max(cardH * 1.5, radius * 1.2),
          }}
        >
          <div
            ref={wheelRef}
            className="relative"
            style={{
              width: cardW,
              height: cardH,
              transformStyle: 'preserve-3d',
              willChange: 'transform',
              position: 'absolute',
              left: '50%',
              top: '50%',
              marginLeft: -cardW / 2,
              marginTop: -cardH / 2,
            }}
          >
            {cards.map(card => (
              <Card
                key={card.key}
                src={card.src}
                title={card.title}
                transform={card.transform}
                cardW={cardW}
                cardH={cardH}
                isFocused={focusedCard?.src === card.src}
                onClick={() => setFocusedCard(card)}
              />
            ))}
          </div>
        </div>

        {/* Focused View Modal —————————————————— */}
        <AnimatePresence>
          {focusedCard && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 pointer-events-auto"
            >
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-charcoal/90 backdrop-blur-xl"
                onClick={() => setFocusedCard(null)}
              />

              {/* 3D Content Container */}
              <motion.div
                layoutId={`card-${focusedCard.src}`}
                initial={{ scale: 0.8, rotateX: 20, y: 50, opacity: 0 }}
                animate={{ scale: 1, rotateX: 0, y: 0, opacity: 1 }}
                exit={{ scale: 0.8, rotateX: 20, y: 50, opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 120 }}
                className="relative z-10 w-full max-w-5xl max-h-[90vh] bg-white rounded-3xl overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.5)] border border-white/10 flex flex-col"
              >
                {/* Header Info (Fixed Height) */}
                <div className="p-6 md:p-8 flex justify-between items-start bg-warm-white border-b border-charcoal/5">
                  <div className="space-y-1">
                    <p className="font-dm text-[9px] md:text-[10px] uppercase tracking-[0.4em] text-earth">Architectural Plan</p>
                    <h2 className="font-cormorant text-2xl md:text-4xl text-charcoal font-medium">{focusedCard.title}</h2>
                  </div>
                  
                  <button 
                    onClick={() => setFocusedCard(null)}
                    className="group w-10 h-10 md:w-12 md:h-12 rounded-full border border-charcoal/10 flex items-center justify-center hover:bg-charcoal hover:border-charcoal transition-all duration-300"
                  >
                    <span className="font-dm text-xl md:text-2xl group-hover:text-cream transition-colors">×</span>
                  </button>
                </div>

                {/* Content Area (Image) */}
                <div className="flex-1 overflow-hidden p-4 md:p-8 bg-white flex items-center justify-center">
                  <img
                    src={focusedCard.src}
                    alt={focusedCard.title}
                    className="max-w-full max-h-full object-contain shadow-sm"
                  />
                </div>

                {/* Footer Info (Fixed Height) */}
                <div className="p-6 md:p-8 flex flex-wrap gap-4 md:gap-8 items-center justify-center bg-warm-white border-t border-charcoal/5">
                   {['2,400 sqft', '4 Bedrooms', 'High Ceiling', 'Open Kitchen'].map((spec) => (
                     <div key={spec} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-clay" />
                        <span className="font-dm text-[10px] md:text-[11px] uppercase tracking-wider text-charcoal/70">{spec}</span>
                     </div>
                   ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

ThreeDCarousel.displayName = 'ThreeDCarousel';

export default ThreeDCarousel;
