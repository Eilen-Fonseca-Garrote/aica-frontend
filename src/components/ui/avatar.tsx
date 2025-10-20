import React from "react";

export function Avatar({ className = "", children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`rounded-full overflow-hidden bg-gray-200 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function AvatarImage({ src, alt = "Avatar", className = "", ...props }: React.ImgHTMLAttributes<HTMLImageElement>) {
  return <img src={src} alt={alt} className={`w-full h-full object-cover ${className}`} {...props} />;
}

export function AvatarFallback({ children, className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`flex items-center justify-center w-full h-full bg-gray-400 text-white ${className}`} {...props}>
      {children}
    </div>
  );
}
