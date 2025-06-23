import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";

// Utility to merge classNames simply (optional but useful)
function mergeClassNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Avatar = React.forwardRef(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={mergeClassNames("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className)}
    {...props}
  />
));
Avatar.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={mergeClassNames("aspect-square h-full w-full object-cover object-center", className)}
    {...props}
  />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={mergeClassNames(
      "flex h-full w-full items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 ",
      className
    )}
    {...props}
  />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export { Avatar, AvatarImage, AvatarFallback };