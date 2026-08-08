/// <reference lib="webworker" />

import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { NetworkFirst, Serwist } from "serwist";
import { defaultCache } from "@serwist/next/worker";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    {
      // Live wallet/balance data — never serve stale reads from cache.
      matcher: ({ url }) => url.origin === "https://owa-api.vercel.app",
      handler: new NetworkFirst({
        cacheName: "owa-api",
        networkTimeoutSeconds: 10,
      }),
    },
    ...defaultCache,
  ],
});

serwist.addEventListeners();
