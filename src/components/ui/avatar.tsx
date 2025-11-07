import React from "react";
import Image from "next/image";

export function Avatar({ className = "", children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`rounded-full overflow-hidden bg-gray-200 ${className}`} {...props}>
      {children}
    </div>
  );
}

interface AvatarImageProps extends React.ComponentProps<typeof Image> {
  className?: string;
}

export function AvatarImage({
  src,
  alt = "Avatar",
  className = "",
  ...props
}: AvatarImageProps) {
  return (
    <div className={`relative w-full h-full ${className}`}>
      <Image
        src={src ?? "/default-avatar.png"} // fallback if src is undefined
        alt={alt}
        fill
        className="object-cover"
        {...props}
      />
    </div>
  );
}

export function AvatarFallback({ children, className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`flex items-center justify-center w-full h-full bg-gray-400 text-white ${className}`} {...props}>
      {children}
    </div>
  );
}
