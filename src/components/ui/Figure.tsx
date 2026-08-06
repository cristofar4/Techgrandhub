import { useState } from "react";
import { imageSrc, imageSrcSet, type ImageAsset } from "@/data/images";
import { cn } from "@/lib/utils";

interface FigureProps {
  asset: ImageAsset;
  /** Classes for the wrapper, which reserves the space. */
  className?: string;
  /** Classes for the image itself. */
  imgClassName?: string;
  /** Layout hint for the browser, so it downloads the right size. */
  sizes?: string;
  /** Load immediately instead of lazily. Use for the hero image only. */
  priority?: boolean;
  /** Override the natural ratio when a crop is needed. */
  ratio?: number;
  /** Width requested from the image service for the default source. */
  width?: number;
  onLoad?: () => void;
}

/**
 * Every photograph on the website goes through this component, which keeps
 * loading behaviour, responsive sources, alternative text, reserved space,
 * and the failure state consistent in one place.
 */
export function Figure({
  asset,
  className,
  imgClassName,
  sizes = "(max-width: 768px) 100vw, 50vw",
  priority = false,
  ratio,
  width = 1080,
  onLoad,
}: FigureProps) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className={cn("relative overflow-hidden bg-ink-raised", className)}
      style={{ aspectRatio: ratio ?? asset.ratio }}
    >
      {/* A quiet blueprint stands in until the photograph arrives. */}
      <div
        aria-hidden="true"
        className={cn(
          "absolute inset-0 transition-opacity duration-700",
          loaded && !failed ? "opacity-0" : "opacity-100",
        )}
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(244,241,235,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(244,241,235,0.05) 1px, transparent 1px)",
          backgroundSize: "2rem 2rem",
        }}
      />

      {failed ? (
        <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
          <span className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-silver">
            Image unavailable
          </span>
        </div>
      ) : (
        <img
          src={imageSrc(asset, width)}
          srcSet={imageSrcSet(asset)}
          sizes={sizes}
          alt={asset.alt}
          loading={priority ? "eager" : "lazy"}
          decoding={priority ? "sync" : "async"}
          fetchPriority={priority ? "high" : "auto"}
          draggable={false}
          onLoad={() => {
            setLoaded(true);
            onLoad?.();
          }}
          onError={() => setFailed(true)}
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-700",
            loaded ? "opacity-100" : "opacity-0",
            imgClassName,
          )}
        />
      )}
    </div>
  );
}
