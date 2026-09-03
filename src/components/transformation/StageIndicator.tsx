import { forwardRef, useImperativeHandle, useRef } from "react";

export const STAGES = ["EXISTING", "REMOVE", "REIMAGINE", "BUILD", "FINISHED"] as const;

export type StageIndicatorHandle = {
  /** Called from the scrub timeline's onUpdate — writes the DOM directly
   * and only touches text when the stage actually changes, so a
   * 60fps-scrubbed scroll never triggers a React re-render. */
  setProgress: (t: number) => void;
};

/**
 * Restrained mono-type stage readout + a scrub-linked progress fill,
 * per spec section 16 ("01 EXISTING … 05 FINISHED", "restrained mono
 * typography", "do not obstruct the photography").
 */
export const StageIndicator = forwardRef<StageIndicatorHandle, { className?: string }>(
  function StageIndicator({ className }, ref) {
    const numberEl = useRef<HTMLSpanElement>(null);
    const labelEl = useRef<HTMLSpanElement>(null);
    const fillEl = useRef<HTMLDivElement>(null);
    const lastStage = useRef(-1);

    useImperativeHandle(ref, () => ({
      setProgress(t: number) {
        const clamped = Math.min(1, Math.max(0, t));
        if (fillEl.current) fillEl.current.style.transform = `scaleX(${clamped})`;
        const stage = Math.min(
          STAGES.length - 1,
          Math.floor(clamped * STAGES.length),
        );
        if (stage !== lastStage.current) {
          lastStage.current = stage;
          if (numberEl.current) numberEl.current.textContent = String(stage + 1).padStart(2, "0");
          if (labelEl.current) labelEl.current.textContent = STAGES[stage];
        }
      },
    }));

    return (
      <div className={className}>
        <div className="flex items-baseline gap-3 font-mono text-xs tracking-widest3 text-ink-soft">
          <span ref={numberEl}>01</span>
          <span ref={labelEl}>EXISTING</span>
        </div>
        <div className="mt-3 h-px w-full bg-line">
          <div
            ref={fillEl}
            className="h-full w-full origin-left bg-gold"
            style={{ transform: "scaleX(0)" }}
          />
        </div>
      </div>
    );
  },
);
