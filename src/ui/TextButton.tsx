import { motion, MotionProps } from "framer-motion";
type TextButtonPropos = MotionProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    className?: string;
    buttonLabel: string;
  };
export default function TextButton({
  buttonLabel,
  className,
  ...props
}: TextButtonPropos) {
  return (
    <motion.button
      className={`px-6 py-3 text-white uppercase rounded-md bg-moderate-blue ${className}`}
      {...props}
      whileHover={{ opacity: 0.6 }}
    >
      {buttonLabel}
    </motion.button>
  );
}
