import type React from "react";

/** Dezenter Seitenübergang bei jeder Navigation (reines CSS – kein Flackern vor der Hydration) */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
