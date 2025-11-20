import { useState } from "react";

export function useCredits(initial = 1240, limit = 5000) {
  const [credits, setCredits] = useState(initial);

  const dec = (by = 1) => setCredits((v) => Math.max(0, v - by));

  return { credits, limit, dec };
}
