import type React from "react";
import type { Product } from "@/data/products";
import { cn } from "@/lib/format";

/**
 * Freigestelltes Original-Produktfoto mit Bodenschatten und dezenter Spiegelung.
 * Die Höhe wird vom Elternelement bestimmt (height: 100 %), die Breite folgt dem Seitenverhältnis.
 */
export function ProductPhoto({
  product,
  size = "lg",
  reflection = true,
  shadow = true,
  dark = false,
  priority = false,
  className,
  style,
  imgClassName,
}: {
  product: Product;
  size?: "sm" | "lg";
  reflection?: boolean;
  shadow?: boolean;
  dark?: boolean;
  priority?: boolean;
  className?: string;
  style?: React.CSSProperties;
  imgClassName?: string;
}) {
  if (!product.image) return null;
  const src = size === "sm" && product.imageSm ? product.imageSm : product.image;
  return (
    <div className={cn("relative h-full", className)} style={{ aspectRatio: String(product.imageAspect), ...style }}>
      {shadow && (
        <span
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-[99%] h-[3.5%] w-[120%] -translate-x-1/2 -translate-y-1/2 rounded-[50%]"
          style={{ background: `radial-gradient(closest-side, rgba(0,0,0,${dark ? 0.6 : 0.3}), transparent)`, filter: "blur(2px)" }}
        />
      )}
      {reflection && (
        // Spiegelung auf der Standfläche
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt=""
          aria-hidden
          draggable={false}
          loading="lazy"
          decoding="async"
          className="pointer-events-none absolute left-0 top-full h-full w-full -scale-y-100 select-none object-contain object-bottom"
          style={{
            opacity: dark ? 0.16 : 0.1,
            maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.9), transparent 22%)",
            WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.9), transparent 22%)",
          }}
        />
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={`${product.name}, ${product.bottleVolume.toLocaleString("de-DE")} L`}
        draggable={false}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        className={cn("relative h-full w-full select-none object-contain object-bottom", imgClassName)}
      />
    </div>
  );
}
