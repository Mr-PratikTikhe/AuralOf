import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Play, Pause, Music2, AlertTriangle, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Song } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import ConstellationBackground from "@/components/ConstellationBackground";
import { motion } from "framer-motion";

const AIResults = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const filename = location.state?.filename;
  
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!filename) {
      setIsLoading(false);
      return;
    }

    const fetchTopKSongs = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/topkrealsongs?k=5&filename=${encodeURIComponent(filename)}`);
        if (!response.ok) throw new Error("Failed to fetch songs");
        const data = await response.json();
        setSongs(data);
      } catch (error) {
        console.error(error);
        toast({ variant: "destructive", title: "Error", description: "Failed to load similar songs." });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopKSongs();
  }, [filename, toast]);

  const handlePreview = (songId: number) => {
    setPlayingId(playingId === songId ? null : songId);
  };

  return (
    <div className="min-h-screen py-12 px-4 relative overflow-hidden">
      <ConstellationBackground />
      
      <header className="max-w-3xl mx-auto mb-12 relative z-10">
        <div className="flex justify-between items-center mb-10">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="text-slate-400 hover:text-white glass-pilled border-0 px-4 py-1"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          {filename && (
            <div className="text-[10px] uppercase tracking-widest font-bold text-teal-400 glass px-4 py-1 rounded-full border-teal-500/20">
              Fingerprint: {filename.slice(0, 20)}...
            </div>
          )}
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[2rem] shadow-2xl relative overflow-hidden"
        >
          {/* Decorative Glow */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />
          
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-red-500/10 mb-6 border border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
            <AlertTriangle className="w-10 h-10 text-red-500 animate-pulse" />
          </div>
          <h1 className="text-4xl font-black text-white mb-4 tracking-tight">
            AI Patterns <span className="text-red-500 underline underline-offset-8">Detected</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto font-medium">
            Our neural engine found high-confidence indicators of synthetic audio generation.
          </p>
        </motion.div>
      </header>

      <main className="max-w-2xl mx-auto relative z-10">
        <div className="flex items-center gap-3 mb-8">
            <Sparkles className="text-teal-400 w-5 h-5" />
            <h2 className="text-slate-200 font-bold uppercase tracking-widest text-xs">Similar Human Productions</h2>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 rounded-full border-2 border-teal-500/20 border-t-teal-500 animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            {songs.map((song, index) => (
              <motion.div
                key={song.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "glass group p-5 rounded-2xl transition-all hover:bg-white/10 flex items-center gap-5",
                  playingId === song.id ? "border-teal-500/50 ring-1 ring-teal-500/30" : ""
                )}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600 to-teal-600 flex items-center justify-center text-white font-black shadow-lg">
                  {index + 1}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-bold truncate leading-tight">{song.title}</h3>
                  <p className="text-slate-400 text-xs font-medium truncate">{song.artist}</p>
                </div>

                <div className="flex items-center gap-6">
                   <div className="hidden sm:flex flex-col items-end">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Similarity</span>
                      <span className="text-teal-400 font-black text-sm">{song.similarity.toFixed(2)}%</span>
                   </div>
                   <Button
                     size="icon"
                     variant="ghost"
                     onClick={() => handlePreview(song.id)}
                     className={cn(
                       "rounded-full w-10 h-10 transition-all",
                       playingId === song.id ? "bg-teal-500 text-black hover:bg-teal-400" : "bg-white/5 text-white hover:bg-white/10"
                     )}
                   >
                     {playingId === song.id ? <Pause size={18} /> : <Play size={18} className="translate-x-0.5" />}
                   </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <footer className="mt-20 text-center pb-12 opacity-50">
           <p className="text-[10px] uppercase font-bold tracking-[0.3em] text-slate-500">AuralOf Authenticity Report</p>
      </footer>
    </div>
  );
};

export default AIResults;

