import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

/** Register the ScrollTrigger plugin exactly once for the app. */
export function ensureGsap() {
  if (!registered) {
    gsap.registerPlugin(ScrollTrigger);
    registered = true;
  }
}

export { gsap, ScrollTrigger };
