"use client";

import { useEffect, useState, useRef } from "react";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import fireworksAnimation from "@/public/fireworks.json";
import confettiAnimation from "@/public/confetti.json";

export default function Greeting({ from, message: initialMessage }: { from: string, message?: string }) {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [link, setLink] = useState("");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.play().catch(error => {
        console.error("Autoplay was prevented:", error);
      });
    }

    const duration = 1500;
    const animationEnd = Date.now() + duration;

    const interval = setInterval(() => {
      if (Date.now() > animationEnd) {
        clearInterval(interval);
        return;
      }

      confetti({
        particleCount: 20,
        angle: 90,
        spread: 55,
        startVelocity: 45,
        gravity: 0.8,
        ticks: 200,
        origin: { x: Math.random(), y: 1 },
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  const generateLink = () => {
    if (!name) return;
    const params = new URLSearchParams();
    params.set("from", name);
    if (message) params.set("msg", message);
    const url = `${window.location.origin}?${params.toString()}`;
    setLink(url);

    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
    });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
      <div className="absolute inset-0 bg-black/60"></div>
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <div className="flex justify-center items-center space-x-4">
          <Lottie animationData={confettiAnimation} loop className="w-64 h-64" />
          <Lottie animationData={fireworksAnimation} loop className="w-64 h-64" />
        </div>

        <audio ref={audioRef} src="/song.mp3" loop preload="auto" />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.8, delay: 0.3 }}
          className="mb-10"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Happy New Year <span className="text-yellow-400">2026</span>
          </h1>
          <p className="mt-2 text-lg text-white/80">A brand new beginning</p>
          <p className="mt-4 text-xl">
            From <span className="font-bold text-yellow-400">{from}</span>,
          </p>
          <p className="mt-2 text-sm text-white/60">{initialMessage || ""}</p>
        </motion.div>

        <div className="w-full max-w-sm space-y-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="Enter your name"
            className="w-full px-4 py-3 rounded-xl text-white placeholder-white/60 bg-white/15 backdrop-blur-md border border-white/30 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
          />
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            type="text"
            placeholder="Petit message à envoyer"
            maxLength={140}
            className="w-full px-4 py-2 rounded-xl text-white placeholder-white/60 bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
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
              className="bg-gray-800 p-3 rounded break-all"
            >
              <p className="text-sm mb-1">Your link:</p>
              <p className="text-yellow-400 text-sm">{link}</p>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
