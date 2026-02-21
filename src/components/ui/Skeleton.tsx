type SkeletonVariant = "text" | "circular" | "rectangular" | "card";

interface SkeletonProps {
  variant?: SkeletonVariant;
  width?: string | number;
  height?: string | number;
  className?: string;
  count?: number;
}

const variantClasses: Record<SkeletonVariant, string> = {
  text: "h-4 rounded",
  circular: "rounded-full",
  rectangular: "rounded-xl",
  card: "rounded-2xl h-48",
};

function Skeleton({
  variant = "text",
  width,
  height,
  className = "",
  count = 1,
}: SkeletonProps) {
  const style = {
    width: typeof width === "number" ? `${width}px` : width,
    height: typeof height === "number" ? `${height}px` : height,
  };

  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className={`animate-pulse bg-navy-light ${variantClasses[variant]} ${className}`}
          style={style}
        />
      ))}
    </>
  );
}

export { Skeleton, type SkeletonProps, type SkeletonVariant };
