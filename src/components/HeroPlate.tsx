"use client";

import { useEffect, useRef } from "react";
import { useAudioUi } from "./MuteControl";

const POSTER = "/hero/A_establish_imax_v1.png";
const LOOP = "/hero/hero-loop-720.mp4";

/**
 * Background-only hero plate under LivingGeometry / chrome.
 * Muted looping video; poster-only when prefers-reduced-motion.
 */
export function HeroPlate() {
  const { reducedMotion } = useAudioUi();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (reducedMotion) {
      video.pause();
      return;
    }
    void video.play().catch(() => {
      /* autoplay may be blocked; poster remains via attribute */
    });
  }, [reducedMotion]);

  return (
    <div
      className="hero-plate pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      {reducedMotion ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={POSTER}
          alt=""
          className="h-full w-full object-cover"
          draggable={false}
        />
      ) : (
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={POSTER}
          controls={false}
          disablePictureInPicture
          disableRemotePlayback
        >
          <source src={LOOP} type="video/mp4" />
        </video>
      )}
    </div>
  );
}
