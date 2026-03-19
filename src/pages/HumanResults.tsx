import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Share2, CheckCircle2, Music2, Download, Loader2, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Song } from "@/lib/types";
import ConstellationBackground from "@/components/ConstellationBackground";
import { motion } from "framer-motion";

const HumanResults = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const filename = location.state?.filename;

  const [detectedSong, setDetectedSong] = useState<Song | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!filename) {
      setLoading(false);
      return;
    }

    const fetchSongDetails = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/song-details?filename=${encodeURIComponent(filename)}`);
        if (!res.ok) throw new Error("Failed to fetch song details");
        const data = await res.json();
        
        const probability = data.probability || 0; 
        const humanConfidence = (1 - probability) * 100;

        setDetectedSong({
          id: 0,
          title: data.title || "Unknown Title",
          artist: data.artist || "Unknown Artist",
          album: "Uploaded Track",
          similarity: Math.round(humanConfidence),
          genre: data.genre || "Unknown"
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchSongDetails();
  }, [filename]);

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
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-teal-500/50 to-transparent" />
          
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-teal-500/10 mb-6 border border-teal-500/20 shadow-[0_0_20px_rgba(34,211,238,0.2)]">
            <CheckCircle2 className="w-10 h-10 text-teal-400 animate-bounce" />
          </div>
          <h1 className="text-4xl font-black text-white mb-4 tracking-tight">
            Authentic <span className="text-teal-400 underline underline-offset-8">Soul</span> Confirmed
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto font-medium">
            Our neural fingerprinting confirmed this track exhibits pure human creativity. No AI signatures found.
          </p>
        </motion.div>
      </header>

      <main className="max-w-xl mx-auto relative z-10">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 rounded-full border-2 border-teal-500/20 border-t-teal-500 animate-spin" />
          </div>
        ) : detectedSong ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="glass p-8 rounded-[2.5rem] border-white/5 shadow-2xl text-center">
              <div className="flex flex-col items-center">
                 <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-violet-600 to-teal-500 flex items-center justify-center text-white mb-6 shadow-xl">
                    <Music2 size={48} />
                 </div>
                 <h2 className="text-2xl font-black text-white mb-1">{detectedSong.title}</h2>
                 <p className="text-teal-400 font-bold uppercase tracking-[0.2em] text-[10px] mb-6">{detectedSong.artist}</p>
                 
                 <div className="flex items-center gap-2 bg-white/5 px-4 py-1.5 rounded-full border border-white/10 text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                    <PartyPopper size={14} className="text-teal-400" />
                    Confidence: {detectedSong.similarity}% Human
                 </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="flex-1 bg-teal-500 text-black hover:bg-teal-400 font-bold py-6 rounded-2xl gap-2 shadow-[0_10px_30px_rgba(20,184,166,0.3)]">
                <Download className="w-5 h-5" />
                Auth Certificate
              </Button>
              <Button variant="ghost" className="flex-1 glass text-white hover:bg-white/10 font-bold py-6 rounded-2xl gap-2">
                <Share2 className="w-5 h-5" />
                Share Analysis
              </Button>
            </div>
          </motion.div>
        ) : (
          <div className="text-center text-slate-500 font-medium py-20">
             Trace failed. Neural links disconnected.
          </div>
        )}
      </main>

      <footer className="mt-20 text-center pb-12 opacity-50">
           <p className="text-[10px] uppercase font-bold tracking-[0.3em] text-slate-500">AuralOf Authenticity Report</p>
      </footer>
    </div>
  );
};

export default HumanResults;

