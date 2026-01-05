"use client";
import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";


export function SmoothScrollProvider({ children }) {
  useEffect(() => {
    // ✅ Initialize Lenis smooth scrolling
    const lenis = new Lenis({
      duration: 1.2, // Scroll animation duration in seconds
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Custom easing function
      direction: "vertical", // Scroll direction
      gestureDirection: "vertical", // Gesture direction
      smooth: true, // Enable smooth scrolling
      mouseMultiplier: 1, // Mouse wheel scroll speed
      smoothTouch: false, // Disable smooth scrolling on touch devices (better performance)
      touchMultiplier: 2, // Touch scroll speed
      infinite: false, // Disable infinite scrolling
    });


    // ✅ Request Animation Frame loop for smooth scrolling
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }


    requestAnimationFrame(raf);


    // ✅ Cleanup: Destroy Lenis instance on unmount
    return () => {
      lenis.destroy();
    };
  }, []);


  return <>{children}</>;
}
