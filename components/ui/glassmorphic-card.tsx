import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassmorphicCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
}

export default function GlassmorphicCard({ 
  children, 
  className,
  ...props 
}: GlassmorphicCardProps) {
  return (
    <motion.div
      className={cn(
        "glass rounded-xl backdrop-blur-xl border border-sky/20 transition-all duration-300",
        className
      )}
      whileHover={{
        borderColor: "rgba(52, 155, 240, 0.4)",
        boxShadow: "0 20px 50px rgba(52, 155, 240, 0.1)"
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
