import { motion } from "framer-motion";

export default function FloatingElements() {
  const particles = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    size: Math.random() * 8 + 4,
    initialX: Math.random() * 100,
    initialY: Math.random() * 100,
    duration: Math.random() * 10 + 10,
    delay: Math.random() * 5,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-gradient-to-r from-sky/30 to-coral/30 blur-sm"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.initialX}%`,
            top: `${particle.initialY}%`,
          }}
          animate={{
            y: [0, -50, 0],
            x: [0, 30, 0],
            opacity: [0.3, 0.7, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
      
      {/* Larger floating orbs */}
      <motion.div
        className="absolute w-32 h-32 rounded-full bg-gradient-to-r from-sky/10 to-coral/10 blur-xl"
        style={{ left: "20%", top: "30%" }}
        animate={{
          y: [0, -100, 0],
          x: [0, 50, 0],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <motion.div
        className="absolute w-24 h-24 rounded-full bg-gradient-to-r from-coral/10 to-sky/10 blur-xl"
        style={{ right: "30%", bottom: "40%" }}
        animate={{
          y: [0, 80, 0],
          x: [0, -40, 0],
          rotate: [360, 180, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}
