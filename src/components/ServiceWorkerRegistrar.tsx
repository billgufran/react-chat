"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegistrar() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    const swUrl = "/service-worker.js";

    const register = async () => {
      try {
        const reg = await navigator.serviceWorker.register(swUrl);
        reg.onupdatefound = () => {
          const installing = reg.installing;
          if (!installing) return;
          installing.onstatechange = () => {
            if (installing.state === "installed" && navigator.serviceWorker.controller) {
              console.log("New content is available; it will be used on next load.");
            }
          };
        };
      } catch (err) {
        console.error("Service worker registration failed:", err);
      }
    };

    register();
  }, []);

  return null;
}

