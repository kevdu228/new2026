"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";
import fireworksAnimation from '@/public/fireworks.json';
import confettiAnimation from '@/public/confetti.json';

function GreetingCard() {
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "Someone";
  const receivedMessage = searchParams.get("msg") || "";
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [link, setLink] = useState("");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // 🎉 Confetti animation on page load
  useEffect(() => {
    const duration = 1500;
    const animationEnd = Date.now() + duration;

    const interval = setInterval(() => {
      if (Date.now() > animationEnd) {
        clearInterval(interval);
        return;
      }

      confetti({
        particleCount: 20,
        angle: 90, // straight up
        spread: 55,
        startVelocity: 45,
        gravity: 0.8,
        ticks: 200,
        origin: { x: Math.random(), y: 1 }, // bottom of screen
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  const generateLink = async () => {
    if (!name) return;
    const params = new URLSearchParams();
    params.set("from", name);
    if (message) params.set("msg", message);
    const url = `${window.location.origin}?${params.toString()}`;
    setLink(url);

    // Small celebration when generating link
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
    });
  }; 

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }
  };

  // Audio playback effect
  useEffect(() => {
    const audioEl = audioRef.current;
    if (!audioEl) return;

    // Attempt to play audio. This should work as it's after a user interaction.
    audioEl.play().catch(error => {
      console.error("Audio play failed:", error);
      setIsPlaying(false);
    });

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onVolumeChange = () => {
      if (!audioEl) return;
      setIsMuted(!!audioEl.muted);
    };

    audioEl.addEventListener("play", onPlay);
    audioEl.addEventListener("pause", onPause);
    audioEl.addEventListener("volumechange", onVolumeChange);

    return () => {
      audioEl.removeEventListener("play", onPlay);
      audioEl.removeEventListener("pause", onPause);
      audioEl.removeEventListener("volumechange", onVolumeChange);
    };
  }, []);

  return (
    <motion.div
      key="card"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 text-center"
    >
<div className="flex justify-center items-center space-x-4">
  <Lottie
    animationData={confettiAnimation} // ta deuxième animation
    loop
    className="w-64 h-64"
  />
  <Lottie
    animationData={fireworksAnimation}
    loop
    className="w-64 h-64" // largeur et hauteur plus grandes
  />
</div>

<div className="absolute top-6 right-6 z-20 flex items-center gap-2">
  <button
    onClick={togglePlay}
    aria-label={isPlaying ? "Pause music" : "Play music"}
    title={isPlaying ? "Pause music" : "Play music"}
    className="bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-full backdrop-blur-sm transition"
  >
    {isPlaying ? "⏸️" : "▶️"}
  </button>
  <button
    onClick={() => {
      if (!audioRef.current) return;
      audioRef.current.muted = !audioRef.current.muted;
    }}
    aria-label={isMuted ? "Unmute music" : "Mute music"}
    title={isMuted ? "Unmute music" : "Mute music"}
    className="bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-full backdrop-blur-sm transition"
  >
    {isMuted ? "🔇" : "🔊"}
  </button>
</div>

<audio ref={audioRef} src="/song.mp3" loop preload="auto" />
      {/* ✨ Fade-in text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.8, delay: 0.3 }}
        className="mb-10"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
    Happy New Year <span className="text-yellow-400">2026</span>
  </h1>

  <p className="mt-2 text-lg text-white/80">
    A brand new beginning
  </p>

        <p className="mt-4 text-xl">
          From <span className="font-bold text-yellow-400">{from}</span> ,
        </p>

        <p className="mt-2 text-sm text-white/60">
           {receivedMessage}
        </p>
      </motion.div>

      {/* Form */}
      <div className="w-full max-w-sm space-y-4">
        <input
  value={name}
  onChange={(e) => setName(e.target.value)}
  type="text"
  placeholder="Enter your name"
  className="
    w-full
    px-4
    py-3
    rounded-xl
    text-white
    placeholder-white/60
    bg-white/15
    backdrop-blur-md
    border
    border-white/30
    focus:outline-none
    focus:ring-2
    focus:ring-yellow-400
    transition
  "
/>

        <input
  value={message}
  onChange={(e) => setMessage(e.target.value)}
  type="text"
  placeholder="Petit message à envoyer"
  maxLength={140}
  className="
    w-full
    px-4
    py-2
    rounded-xl
    text-white
    placeholder-white/60
    bg-white/10
    border
    border-white/20
    focus:outline-none
    focus:ring-2
    focus:ring-yellow-400
    transition
  "
/>

        <button
          onClick={generateLink}
          className="w-full bg-yellow-400 text-black py-3 rounded font-bold active:scale-95 transition"
        >
          Generate my link
        </button>

        {link && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800 p-3 rounded"
          >
            <p className="text-sm mb-2">Your link:</p>

            <div className="flex items-center gap-3 flex-wrap">
              <p className="text-yellow-400 text-sm break-all max-w-[18rem] md:max-w-xs">
                {link}
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(link);
                    } catch {}
                  }}
                  className="bg-white/5 text-white px-3 py-1 rounded text-xs"
                >
                  Copier
                </button>

              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export default function Home() {
  const [isGiftOpened, setIsGiftOpened] = useState(false);

  return (
    <main
      className="relative min-h-screen overflow-hidden bg-cover bg-center text-white bg-[url('/bg.png')] md:bg-[url('/bg1.png')] xl:bg-[url('/bg1.png')]"
    >
      <div className="absolute inset-0 bg-black/60"></div>
      <AnimatePresence mode="wait">
        {!isGiftOpened ? (
          <motion.div
            key="gift"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.5 }}
            transition={{ duration: 0.7 }}
            className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 text-center"
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-2xl md:text-3xl font-semibold mb-4">
                Vous avez reçu un cadeau, appuyez dessus
              </p>
            </motion.div>
            <motion.div
              onClick={() => setIsGiftOpened(true)}
              className="cursor-pointer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              animate={{
                rotate: [0, -2, 2, -2, 2, 0],
                scale: [1, 1.02, 1, 1.02, 1],
              }}
              transition={{
                rotate: { duration: 0.3, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" },
                scale: { duration: 0.4, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" },
              }}
            >
              <span className="text-8xl md:text-9xl drop-shadow-lg">🎁</span>
            </motion.div>
          </motion.div>
        ) : (
          <GreetingCard />
        )}
      </AnimatePresence>
    </main>
  );
}
