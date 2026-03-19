import { motion } from "framer-motion";
import { Music, Mic2, Guitar, CassetteTape, Radio } from "lucide-react";

const ConstellationBackground = () => {
  const figures = [
    { Icon: Music, x: "10%", y: "15%", delay: 0 },
    { Icon: Mic2, x: "85%", y: "20%", delay: 2 },
    { Icon: Guitar, x: "15%", y: "80%", delay: 4 },
    { Icon: CassetteTape, x: "80%", y: "75%", delay: 1 },
    { Icon: Radio, x: "50%", y: "10%", delay: 3 },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {figures.map((figure, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: [0.1, 0.2, 0.1],
            scale: [0.8, 1, 0.8],
            y: [0, -20, 0]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            delay: figure.delay,
            ease: "easeInOut" 
          }}
          style={{ 
            position: "absolute", 
            left: figure.x, 
            top: figure.y,
            color: "rgba(34, 211, 238, 0.2)" // cyan-400 with low opacity
          }}
        >
          <figure.Icon size={48} strokeWidth={1} className="drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]" />
        </motion.div>
      ))}
      
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-900/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-900/20 blur-[120px] rounded-full" />
    </div>
  );
};

export default ConstellationBackground;
