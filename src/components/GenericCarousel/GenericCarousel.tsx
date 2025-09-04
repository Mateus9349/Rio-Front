// src/components/GenericCarousel.tsx
"use client";
import React, { ReactNode, useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import type { EmblaOptionsType } from "embla-carousel";

export default function GenericCarousel({
    children,
    options,
    className,
}: {
    children: ReactNode | ReactNode[];
    options?: EmblaOptionsType;
    className?: string;
}) {
    const [emblaRef, embla] = useEmblaCarousel(options);
    const [selected, setSelected] = useState(0);
    const [snaps, setSnaps] = useState<number[]>([]);

    useEffect(() => {
        if (!embla) return;
        setSnaps(embla.scrollSnapList());
        const onSelect = () => setSelected(embla.selectedScrollSnap());
        embla.on("select", onSelect);
        onSelect();
    }, [embla]);

    const prev = useCallback(() => embla?.scrollPrev(), [embla]);
    const next = useCallback(() => embla?.scrollNext(), [embla]);
    const goTo = useCallback((i: number) => embla?.scrollTo(i), [embla]);

    return (
        <div className={className}>
            <div className="relative">
                <div ref={emblaRef} className="overflow-hidden rounded-2xl shadow">
                    <div className="flex">
                        {React.Children.toArray(children).map((slide, i) => (
                            <div key={i} className="min-w-0 flex-[0_0_100%] p-2">
                                {slide}
                            </div>
                        ))}
                    </div>
                </div>

                <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 px-3 py-2 rounded-xl shadow">‹</button>
                <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 px-3 py-2 rounded-xl shadow">›</button>
            </div>

            <div className="mt-3 flex justify-center gap-2">
                {snaps.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => goTo(i)}
                        className={`h-2 w-2 rounded-full ${i === selected ? "bg-gray-900" : "bg-gray-400/60"}`}
                        aria-label={`Ir para slide ${i + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
