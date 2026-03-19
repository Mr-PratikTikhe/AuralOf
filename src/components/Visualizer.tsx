import { motion } from "framer-motion";

const Visualizer = ({ isProcessing }: { isProcessing: boolean }) => {
  const bars = Array.from({ length: 40 });

  return (
    <div className="absolute inset-[-40px] flex items-center justify-center pointer-events-none z-10">
      <svg className="w-full h-full rotate-[-90deg]" viewBox="0 0 100 100">
        {bars.map((_, i) => {
          const angle = (i / bars.length) * 2 * Math.PI;
          const x1 = 50 + 42 * Math.cos(angle);
          const y1 = 50 + 42 * Math.sin(angle);
          const x2 = 50 + 48 * Math.cos(angle);
          const y2 = 50 + 48 * Math.sin(angle);

          return (
            <motion.line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              className={i % 2 === 0 ? "text-teal-400" : "text-violet-500"}
              initial={{ opacity: 0.3 }}
              animate={isProcessing ? {
                opacity: [0.3, 1, 0.3],
                strokeWidth: [1, 2, 1],
                x2: [x2, 50 + (48 + Math.random() * 10) * Math.cos(angle), x2],
                y2: [y2, 50 + (48 + Math.random() * 10) * Math.sin(angle), y2],
              } : {
                opacity: [0.2, 0.4, 0.2],
                x2: [x2, 50 + (48 + 2) * Math.cos(angle), x2],
                y2: [y2, 50 + (48 + 2) * Math.sin(angle), y2],
              }}
              transition={{
                duration: isProcessing ? 0.5 : 2,
                repeat: Infinity,
                delay: i * 0.05,
              }}
            />
          );
        })}
      </svg>
      
      {/* Outer Glow Ring */}
      <div className="absolute inset-0 rounded-full border border-teal-500/20 blur-[2px] animate-pulse" />
    </div>
  );
};

export default Visualizer;
