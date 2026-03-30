"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function HeroSlider({ 
    images, 
    fallbackImage 
}: { 
    images: string[], 
    fallbackImage: string 
}) {
    const slideImages = images.length > 0 ? images : [fallbackImage];
    const [currentIndex, setCurrentIndex] = useState(0);

    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const minSwipeDistance = 50;

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % slideImages.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev === 0 ? slideImages.length - 1 : prev - 1));
    };

    // Auto-slide effect
    useEffect(() => {
        if (slideImages.length <= 1) return;
        const interval = setInterval(() => {
            nextSlide();
        }, 5000);
        return () => clearInterval(interval);
    }, [slideImages.length]);

    const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
        setTouchEnd(null);
        setIsDragging(true);
        if ('targetTouches' in e) {
            setTouchStart(e.targetTouches[0].clientX);
        } else {
            setTouchStart((e as React.MouseEvent).clientX);
        }
    };

    const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
        if (!isDragging) return;
        if ('targetTouches' in e) {
            setTouchEnd(e.targetTouches[0].clientX);
        } else {
            setTouchEnd((e as React.MouseEvent).clientX);
        }
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        
        if (distance > minSwipeDistance) {
            nextSlide();
        } else if (distance < -minSwipeDistance) {
            prevSlide();
        }
    };

    return (
        <div 
            className="absolute inset-0 z-0 overflow-hidden bg-on-surface group select-none"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleTouchStart}
            onMouseMove={handleTouchMove}
            onMouseUp={handleTouchEnd}
            onMouseLeave={handleTouchEnd}
        >
            {slideImages.map((src, index) => (
                <div 
                    key={index}
                    className={`absolute inset-0 transition-all duration-1000 ${
                        index === currentIndex 
                            ? "opacity-100 scale-100" 
                            : "opacity-0 scale-105"
                    }`}
                >
                    <Image
                        src={src}
                        alt={`Hero image ${index + 1}`}
                        fill
                        className="object-cover pointer-events-none"
                        priority={index === 0}
                        sizes="100vw"
                        draggable={false}
                    />
                </div>
            ))}
            
            {/* Premium gradient overlay */}
            <div className="absolute inset-0 z-10 pointer-events-none" style={{
                background: 'linear-gradient(135deg, rgba(0,55,74,0.75) 0%, rgba(0,55,74,0.4) 40%, rgba(0,55,74,0.3) 60%, rgba(0,55,74,0.6) 100%)'
            }} />
            
            {/* Bottom gradient fade */}
            <div className="absolute bottom-0 left-0 right-0 h-32 z-10 pointer-events-none" style={{
                background: 'linear-gradient(to top, rgba(244,250,255,0.8) 0%, transparent 100%)'
            }} />

            {/* Navigation Arrows */}
            {slideImages.length > 1 && (
                <>
                    <button 
                        onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                        className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center rounded-xl bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-all opacity-0 group-hover:opacity-100 backdrop-blur-md border border-white/10"
                        aria-label="Previous Slide"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                        </svg>
                    </button>

                    <button 
                        onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                        className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center rounded-xl bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-all opacity-0 group-hover:opacity-100 backdrop-blur-md border border-white/10"
                        aria-label="Next Slide"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                    </button>
                </>
            )}

            {/* Pagination Dots */}
            {slideImages.length > 1 && (
                <div className="absolute bottom-10 left-0 right-0 z-20 flex justify-center gap-2.5">
                    {slideImages.map((_, i) => (
                        <button
                            key={i}
                            onClick={(e) => { e.stopPropagation(); setCurrentIndex(i); }}
                            className={`h-2 rounded-full transition-all duration-300 drop-shadow-md cursor-pointer ${
                                i === currentIndex 
                                    ? 'bg-white w-8' 
                                    : 'bg-white/40 hover:bg-white/70 w-2'
                            }`}
                            aria-label={`Go to slide ${i + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
