import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BUSINESS } from "../data/projects";

const QUESTIONS = [
  { key: "space", q: "What space are you looking to renovate?" },
  { key: "location", q: "Where is the property located?" },
  { key: "timing", q: "When would you like to begin?" },
  { key: "budget", q: "What budget range are you considering?" },
] as const;

type Answers = Partial<Record<(typeof QUESTIONS)[number]["key"], string>> & {
  contactMe?: "yes" | "no";
  contactDetail?: string;
};

/**
 * Sends the collected consultation answers as a plain email. This is the
 * one integration point to swap out — replace this function's body with
 * a real endpoint (CRM webhook, serverless function, etc.) when one
 * exists. No backend is simulated or faked in the meantime; the UI is
 * fully functional on its own via mailto.
 */
function submitConsultation(answers: Answers) {
  const subject = encodeURIComponent("Project consultation request");
  const lines = QUESTIONS.map((q) => `${q.q} ${answers[q.key] ?? "—"}`);
  lines.push(`Would like to be contacted: ${answers.contactMe ?? "—"}`);
  if (answers.contactDetail) lines.push(`Contact info: ${answers.contactDetail}`);
  window.location.href = `mailto:hello@progettobuild.com?subject=${subject}&body=${encodeURIComponent(
    lines.join("\n"),
  )}`;
}

/**
 * Minimal bottom-right consultation assistant (spec §25) — a guided
 * question flow presented as a premium project-intake panel, not a
 * generic support chat bubble.
 */
export function AIProjectAssistant() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [done, setDone] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const total = QUESTIONS.length + 1; // + contact-preference step
  const current = QUESTIONS[step];

  function next(value: string) {
    if (current) setAnswers((a) => ({ ...a, [current.key]: value }));
    if (step < total - 1) setStep((s) => s + 1);
  }

  function finish(contactMe: "yes" | "no", contactDetail?: string) {
    const final = { ...answers, contactMe, contactDetail };
    setAnswers(final);
    if (contactMe === "yes") submitConsultation(final);
    setDone(true);
  }

  function reset() {
    setStep(0);
    setAnswers({});
    setDone(false);
  }

  return (
    <div className="fixed bottom-5 right-5 z-[100] md:bottom-8 md:right-8">
      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="assistant-heading"
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-16 right-0 w-[calc(100vw-2.5rem)] max-w-sm rounded-sm border border-line bg-surface p-6 shadow-2xl"
          >
            <p className="font-mono text-eyebrow uppercase tracking-widest3 text-gold">
              Progetto Build
            </p>
            <h2 id="assistant-heading" className="mt-2 font-display text-h3 text-ink">
              Planning a renovation?
            </h2>
            <p className="mt-1 text-sm text-ink-soft">Tell us about your project.</p>

            <div className="mt-6 min-h-[132px]">
              {!done ? (
                <AnimatePresence mode="wait">
                  {step < QUESTIONS.length ? (
                    <QuestionStep
                      key={current.key}
                      question={current.q}
                      onSubmit={next}
                    />
                  ) : (
                    <motion.div
                      key="contact-pref"
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -12 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ContactPrefStep onFinish={finish} />
                    </motion.div>
                  )}
                </AnimatePresence>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col gap-4"
                >
                  <p className="text-sm text-ink-soft">
                    {answers.contactMe === "yes"
                      ? "Thank you — opening your email client to send this to Progetto Build now."
                      : `Thanks for sharing. Reach us anytime at ${BUSINESS.phone}.`}
                  </p>
                  <button
                    type="button"
                    onClick={reset}
                    className="self-start font-mono text-[11px] uppercase tracking-widest text-gold-bright"
                  >
                    Start over
                  </button>
                </motion.div>
              )}
            </div>

            {!done && (
              <div className="mt-6 flex gap-1.5" aria-hidden="true">
                {Array.from({ length: total }).map((_, i) => (
                  <span
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                      i <= step ? "bg-gold" : "bg-line"
                    }`}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? "Close project consultation" : "Open project consultation"}
        whileTap={{ scale: 0.94 }}
        className="flex h-14 items-center gap-3 rounded-sm border border-gold/50 bg-bg px-5 font-mono text-[11px] uppercase tracking-widest2 text-ink shadow-xl transition-colors duration-200 hover:border-gold"
      >
        <span
          className={`h-1.5 w-1.5 rounded-full bg-gold transition-transform duration-300 ${open ? "scale-0" : "scale-100"}`}
          aria-hidden="true"
        />
        {open ? "Close" : "Plan Your Project"}
      </motion.button>
    </div>
  );
}

function QuestionStep({
  question,
  onSubmit,
}: {
  question: string;
  onSubmit: (value: string) => void;
}) {
  const [value, setValue] = useState("");
  return (
    <motion.form
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -12 }}
      transition={{ duration: 0.2 }}
      onSubmit={(e) => {
        e.preventDefault();
        if (value.trim()) onSubmit(value.trim());
      }}
    >
      <label>
        <span className="block text-sm text-ink">{question}</span>
        <input
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="mt-3 min-h-[44px] w-full rounded-sm border border-line bg-bg px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:border-gold"
          placeholder="Type your answer…"
        />
      </label>
      <button
        type="submit"
        className="mt-4 min-h-[40px] rounded-sm bg-gold px-5 font-mono text-[11px] uppercase tracking-widest2 text-bg"
      >
        Next
      </button>
    </motion.form>
  );
}

function ContactPrefStep({
  onFinish,
}: {
  onFinish: (contactMe: "yes" | "no", detail?: string) => void;
}) {
  const [wantsContact, setWantsContact] = useState<"yes" | "no" | null>(null);
  const [detail, setDetail] = useState("");

  return (
    <div>
      <p className="text-sm text-ink">
        Would you like someone from Progetto Build to contact you?
      </p>
      <div className="mt-4 flex gap-3">
        <button
          type="button"
          onClick={() => setWantsContact("yes")}
          className={`min-h-[40px] flex-1 rounded-sm border px-4 font-mono text-[11px] uppercase tracking-widest ${
            wantsContact === "yes" ? "border-gold bg-gold/10 text-gold-bright" : "border-line text-ink-soft"
          }`}
        >
          Yes
        </button>
        <button
          type="button"
          onClick={() => onFinish("no")}
          className="min-h-[40px] flex-1 rounded-sm border border-line px-4 font-mono text-[11px] uppercase tracking-widest text-ink-soft"
        >
          Not now
        </button>
      </div>

      {wantsContact === "yes" && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
          <input
            autoFocus
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            placeholder="Best phone or email"
            className="mt-4 min-h-[44px] w-full rounded-sm border border-line bg-bg px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:border-gold"
          />
          <button
            type="button"
            onClick={() => onFinish("yes", detail.trim() || undefined)}
            className="mt-3 min-h-[40px] rounded-sm bg-gold px-5 font-mono text-[11px] uppercase tracking-widest2 text-bg"
          >
            Send
          </button>
        </motion.div>
      )}
    </div>
  );
}
