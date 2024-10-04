import { ReactNode } from "react";
import { motion, MotionProps } from "framer-motion";

type IconButtonProps = MotionProps & // Extend MotionProps for framer-motion
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    icon: string | ReactNode; // Accepts either a string for img or an SVG component
    iconAlttext?: string; // Optional for SVG case
    buttonLabel?: string;
    hideButtonLabel?: boolean;
    className?: string;
  };

export default function IconButton({
  icon,
  iconAlttext,
  buttonLabel,
  hideButtonLabel,
  className,
  ...props
}: IconButtonProps) {
  return (
    <motion.button
      className={`flex gap-2 items-center font-medium group outline-offset-4 focus-visible:outline-dotted outline-2 ${className}`}
      {...props}
      whileHover={{ opacity: 0.6 }}
    >
      {/* Conditionally render img or the SVG component */}
      {typeof icon === "string" ? (
        <img src={icon} alt={iconAlttext} aria-hidden={!!hideButtonLabel} />
      ) : (
        <span
          aria-hidden={!!hideButtonLabel}
          className="text-[#C5C6EF]  group-hover:text-moderate-blue group-focus-visible:text-moderate-blue"
        >
          {icon}
        </span>
      )}
      <span className={`${hideButtonLabel ? "sr-only" : ""}`}>
        {buttonLabel}
      </span>
    </motion.button>
  );
}
