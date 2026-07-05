"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

type Rect = { top: number; left: number; width: number; height: number };
type Anchor = { x: number; y: number };

type StartArgs = {
  href: string;
  src: string;
  alt: string;
  rect: Rect;
  // point (fraction of image size) inside the dark face to zoom into
  anchor: Anchor;
  // half-size (fraction of image width) of the solid-dark area around the anchor
  reach: number;
};

type TransitionState = { active: boolean } & Partial<StartArgs>;

const IDLE: TransitionState = { active: false };

const BoxTransitionContext = createContext<{
  active: boolean;
  start: (args: StartArgs) => void;
  finish: () => void;
}>({ active: false, start: () => {}, finish: () => {} });

export function useBoxTransition() {
  return useContext(BoxTransitionContext);
}

export default function BoxTransitionProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<TransitionState>(IDLE);
  const router = useRouter();

  const start = useCallback((args: StartArgs) => {
    setState({ active: true, ...args });
  }, []);

  const finish = useCallback(() => setState(IDLE), []);

  // Safety net: never leave the screen covered if navigation stalls.
  useEffect(() => {
    if (!state.active) return;
    const t = setTimeout(() => setState(IDLE), 6000);
    return () => clearTimeout(t);
  }, [state.active]);

  return (
    <BoxTransitionContext.Provider value={{ active: state.active, start, finish }}>
      {children}
      <AnimatePresence>
        {state.active && state.rect && state.anchor && (
          <motion.div
            className="fixed inset-0 z-[100]"
            exit={{ opacity: 0, transition: { duration: 0.35, ease: "easeOut" } }}
          >
            <motion.div
              className="absolute inset-0 bg-[#4B1B1C]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
            <motion.img
              src={state.src}
              alt={state.alt}
              className="absolute max-w-none"
              style={{
                top: state.rect.top,
                left: state.rect.left,
                width: state.rect.width,
                transformOrigin: `${state.anchor.x * 100}% ${state.anchor.y * 100}%`,
              }}
              initial={{ x: 0, y: 0, scale: 1 }}
              animate={(() => {
                // Dive into the dark face: translate the anchor point to the
                // screen center, then scale until the solid-dark square around
                // it covers the whole viewport diagonal.
                const vw = window.innerWidth;
                const vh = window.innerHeight;
                const anchorX = state.rect!.left + state.anchor!.x * state.rect!.width;
                const anchorY = state.rect!.top + state.anchor!.y * state.rect!.height;
                const halfDiagonal = Math.hypot(vw, vh) / 2;
                const darkHalfSize = (state.reach ?? 0.05) * state.rect!.width;
                const scale = Math.min(halfDiagonal / darkHalfSize, 140);
                return { x: vw / 2 - anchorX, y: vh / 2 - anchorY, scale };
              })()}
              transition={{ duration: 0.85, ease: "easeIn" }}
              onAnimationComplete={() => router.push(state.href!)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </BoxTransitionContext.Provider>
  );
}
