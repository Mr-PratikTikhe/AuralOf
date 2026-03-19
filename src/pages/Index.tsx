import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Disc3, Sparkles, ShieldCheck, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import Turntable from "@/components/Turntable";
import ConstellationBackground from "@/components/ConstellationBackground";

const Index = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleFileSelect = useCallback(async (file: File) => {
    setUploadedFile(file);
    setIsProcessing(true);

    // Simulated "Processing" toast with glassmorphism logic handled by CSS 'glass'
    toast({
      title: "Analyzing your track...",
      description: "Our AI is dissecting the soundwaves for fingerprints.",
      className: "glass border-teal-500/30 text-white",
    });

    try {
      const formData = new FormData();
      formData.append("file", file);

      const minDelay = new Promise(resolve => setTimeout(resolve, 4000));
      const apiBase = `${window.location.protocol}//${window.location.hostname}:8000`;

      const [response] = await Promise.all([
        fetch(`${apiBase}/api/predict`, {
          method: "POST",
          body: formData,
        }),
        minDelay
      ]);

      if (!response.ok) throw new Error("Analysis failed");

      const data = await response.json();
      setIsProcessing(false);

      if (data.result === "Human-Made Classified") {
        navigate("/human-results", { state: { filename: data.filename } });
      } else {
        navigate("/ai-results", { state: { filename: data.filename } });
      }

    } catch (error) {
      console.error(error);
      setIsProcessing(false);
      toast({
        variant: "destructive",
        title: "Analysis failed",
        description: "Something went wrong. Please try again.",
      });
    }
  }, [toast, navigate]);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-6 overflow-hidden">
      <ConstellationBackground />
      
      {/* Background Decorative Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-600/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Main Content Container */}
      <main className="relative z-10 w-full max-w-4xl flex flex-col items-center">
        
        {/* Logo & Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center mb-12 text-center"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-teal-400 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.4)] animate-neon-pulse">
              <Disc3 className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-white font-display">
              AuralOf<span className="text-teal-400">.</span>
            </h1>
          </div>
          <p className="text-slate-400 text-lg font-medium max-w-md">
            The future of <span className="text-white italic">audio authenticity</span>. Detect AI-generated tracks with molecular precision.
          </p>
        </motion.div>

        {/* Central Turntable Section */}
        <Turntable 
          onFileSelect={handleFileSelect} 
          isProcessing={isProcessing} 
          uploadedFile={uploadedFile} 
        />

        {/* Feature Pills */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 flex flex-wrap justify-center gap-4"
        >
          <FeaturePill icon={<Zap size={14} />} text="Neural Analysis" />
          <FeaturePill icon={<ShieldCheck size={14} />} text="GTZAN Verified" />
          <FeaturePill icon={<Sparkles size={14} />} text="High Fidelity" />
        </motion.div>
      </main>

      {/* Bottom Legal/Format Pill (Glassmorphic) */}
      <footer className="fixed bottom-8 left-1/2 -translate-x-1/2 z-20">
        <div className="glass-pilled flex items-center gap-4 text-xs font-semibold text-slate-300 uppercase tracking-widest">
          <span className="text-teal-400/80">Support:</span>
          <span className="hover:text-white transition-colors">.WAV</span>
          <span className="w-1 h-1 rounded-full bg-slate-700" />
          <span className="hover:text-white transition-colors">.MP3</span>
          <span className="w-1 h-1 rounded-full bg-slate-700" />
          <span className="hover:text-white transition-colors">.FLAC</span>
          <span className="w-1 h-1 rounded-full bg-slate-700" />
          <span className="hover:text-white transition-colors">.OGG</span>
        </div>
      </footer>

      {/* Processing Overlay Toast Simulation (Bottom Right) */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed bottom-8 right-8 z-50 glass p-5 rounded-2xl border-l-4 border-l-teal-500 flex items-center gap-4 shadow-2xl max-w-xs"
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-full border-2 border-teal-500/20 border-t-teal-500 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
              </div>
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Analyzing Track</h4>
              <p className="text-slate-400 text-[11px] leading-tight">Cross-referencing acoustic fingerprints with neural models.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FeaturePill = ({ icon, text }: { icon: React.ReactNode, text: string }) => (
  <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-[10px] md:text-xs font-bold text-slate-300 uppercase tracking-widest hover:bg-white/10 transition-colors cursor-default">
    <span className="text-teal-400">{icon}</span>
    {text}
  </div>
);

export default Index;

