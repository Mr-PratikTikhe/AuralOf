import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Disc3, Music } from "lucide-react";
import { cn } from "@/lib/utils";
import Visualizer from "./Visualizer";

interface TurntableProps {
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
  uploadedFile: File | null;
}

const Turntable = ({ onFileSelect, isProcessing, uploadedFile }: TurntableProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.wav', '.mp3', '.flac', '.ogg']
    },
    multiple: false,
    disabled: isProcessing
  });

  return (
    <div className="relative flex flex-col items-center justify-center p-8 md:p-12">
      {/* 3D Turntable Base */}
      <div
        {...getRootProps()}
        className={cn(
          "relative group cursor-pointer perspective-1000",
          isProcessing ? "cursor-wait" : ""
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <input {...getInputProps()} />
        
        {/* Glowing Visualizer Wrap */}
        <Visualizer isProcessing={isProcessing || isDragActive} />

        {/* Record Plate */}
        <motion.div
          animate={{
            rotate: isProcessing ? 360 : isDragActive ? 180 : 0,
            scale: isDragActive || isHovered ? 1.05 : 1,
            rotateX: 15,
          }}
          transition={{
            rotate: { duration: isProcessing ? 2 : 0.5, repeat: isProcessing ? Infinity : 0, ease: isProcessing ? "linear" : "easeOut" },
            scale: { type: "spring", stiffness: 300, damping: 20 },
          }}
          className={cn(
            "relative w-64 h-64 md:w-80 md:h-80 rounded-full bg-[#111] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-[8px] border-[#222] flex items-center justify-center overflow-hidden transition-all duration-500",
            (isDragActive || isHovered) && "shadow-[0_0_30px_rgba(34,211,238,0.4)] border-teal-500/30"
          )}
        >
          {/* Vinyl Grooves (SVG for precision) */}
          <div className="absolute inset-0 opacity-40">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle cx="50" cy="50" r="48" fill="none" stroke="#333" strokeWidth="0.5" />
              <circle cx="50" cy="50" r="44" fill="none" stroke="#222" strokeWidth="0.5" />
              <circle cx="50" cy="50" r="40" fill="none" stroke="#333" strokeWidth="0.5" />
              <circle cx="50" cy="50" r="36" fill="none" stroke="#222" strokeWidth="0.5" />
              <circle cx="50" cy="50" r="32" fill="none" stroke="#333" strokeWidth="0.5" />
              <circle cx="50" cy="50" r="28" fill="none" stroke="#222" strokeWidth="0.5" />
            </svg>
          </div>

          {/* Center Label */}
          <div className="relative z-10 w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-violet-600/80 to-teal-600/80 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
             {/* Glowing Pulse Icon */}
             <motion.div
               animate={{ 
                 opacity: [1, 0.6, 1],
                 scale: [1, 1.1, 1]
               }}
               transition={{ duration: 2, repeat: Infinity }}
               className="text-white"
             >
                {isProcessing ? (
                  <Disc3 className="w-10 h-10 md:w-14 md:h-14 animate-spin" />
                ) : (
                  <Upload className={cn(
                    "w-10 h-10 md:w-14 md:h-14 transition-colors",
                    isDragActive ? "text-teal-200" : "text-white"
                  )} />
                )}
             </motion.div>
          </div>

          {/* Shine Lines */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-transparent pointer-events-none" />
        </motion.div>

        {/* Support Text */}
        <AnimatePresence>
          {(isDragActive || isHovered) && !isProcessing && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute top-[-40px] left-1/2 -translate-x-1/2 whitespace-nowrap bg-teal-500/20 backdrop-blur-md border border-teal-500/30 text-teal-200 px-4 py-1.5 rounded-full text-sm font-medium shadow-lg z-20"
            >
              {isDragActive ? "Drop your track here!" : "Release the sound"}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* File Name if Uploaded */}
      <AnimatePresence>
        {uploadedFile && !isProcessing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-8 flex items-center gap-3 bg-white/5 backdrop-blur-lg border border-white/10 px-6 py-2.5 rounded-2xl shadow-xl border-b-teal-500/50"
          >
            <Music className="text-teal-400 w-5 h-5" />
            <span className="text-sm font-medium text-white/90 truncate max-w-[200px]">
              {uploadedFile.name}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-12 text-center max-w-sm px-4">
        <p className="text-slate-400/80 text-sm md:text-base font-medium leading-relaxed">
          {isProcessing 
            ? "Converting soundwaves into data points..." 
            : "Drag & drop your audio masterpiece or click to browse files."
          }
        </p>
      </div>
    </div>
  );
};

export default Turntable;
