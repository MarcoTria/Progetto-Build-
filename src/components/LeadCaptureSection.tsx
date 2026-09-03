import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Reveal } from "./Reveal";
import { BUSINESS } from "../data/projects";

const PROJECT_TYPES = ["Kitchen", "Bathroom", "Full Home Remodel", "Interior Renovation", "Other"];
const BUDGETS = ["Under $25k", "$25k–$50k", "$50k–$100k", "$100k–$250k", "$250k+"];

/**
 * Lead capture (spec §23). No backend is configured — submission opens a
 * pre-filled email draft client-side. Wire `buildInquiryEmail`'s output
 * into a real form/CRM endpoint when one exists; the shape here is
 * already the clean integration surface for that.
 */
export function LeadCaptureSection() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const subject = encodeURIComponent(
      `Project inquiry from ${f.get("firstName")} ${f.get("lastName")}`,
    );
    const body = encodeURIComponent(
      [
        `Name: ${f.get("firstName")} ${f.get("lastName")}`,
        `Email: ${f.get("email")}`,
        `Phone: ${f.get("phone")}`,
        `Location / ZIP: ${f.get("location")}`,
        `Project type: ${f.get("projectType")}`,
        `Estimated budget: ${f.get("budget")}`,
        "",
        `${f.get("description")}`,
      ].join("\n"),
    );
    window.location.href = `mailto:hello@progettobuild.com?subject=${subject}&body=${body}`;
    setSent(true);
  }

  return (
    <section id="contact" className="border-t border-line bg-surface px-6 py-24 md:py-32">
      <div className="mx-auto max-w-5xl">
        <Reveal className="max-w-2xl">
          <p className="font-mono text-eyebrow uppercase tracking-widest3 text-gold">
            Start a Project
          </p>
          <h2 className="mt-4 font-display text-h1 uppercase leading-[1.05] text-ink">
            Tell us what you
            <br />
            want to transform.
          </h2>
        </Reveal>

        <Reveal as="div" className="mt-14">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Field label="First Name" name="firstName" autoComplete="given-name" required />
            <Field label="Last Name" name="lastName" autoComplete="family-name" required />
            <Field label="Email" name="email" type="email" autoComplete="email" required />
            <Field label="Phone" name="phone" type="tel" autoComplete="tel" />
            <Field
              label="Project Location / ZIP"
              name="location"
              autoComplete="postal-code"
              placeholder="Pompano Beach, FL"
            />
            <SelectField label="Project Type" name="projectType" options={PROJECT_TYPES} />
            <SelectField
              label="Estimated Budget"
              name="budget"
              options={BUDGETS}
              className="sm:col-span-1"
            />
            <label className="sm:col-span-2">
              <span className="mb-2 block font-mono text-[11px] uppercase tracking-widest2 text-ink-soft">
                Project Description
              </span>
              <textarea
                name="description"
                rows={4}
                className="w-full rounded-sm border border-line bg-bg px-4 py-3 text-ink placeholder:text-ink-faint focus:border-gold"
                placeholder="Tell us about the space and timeline"
              />
            </label>

            <div className="sm:col-span-2">
              <motion.button
                type="submit"
                whileTap={{ scale: 0.98 }}
                className="w-full rounded-sm bg-gold px-7 py-4 font-mono text-[11px] uppercase tracking-widest2 text-bg sm:w-auto"
              >
                Start My Project
              </motion.button>
              <p role="status" className="mt-4 font-mono text-[11px] text-ink-faint">
                {sent
                  ? "Opening your email client to send this inquiry…"
                  : `We typically reply within one business day. You can also call ${BUSINESS.phone}.`}
              </p>
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  autoComplete,
  required,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label>
      <span className="mb-2 block font-mono text-[11px] uppercase tracking-widest2 text-ink-soft">
        {label}
        {required && <span className="text-gold"> *</span>}
      </span>
      <input
        name={name}
        type={type}
        autoComplete={autoComplete}
        required={required}
        placeholder={placeholder}
        className="min-h-[44px] w-full rounded-sm border border-line bg-bg px-4 py-3 text-ink placeholder:text-ink-faint focus:border-gold"
      />
    </label>
  );
}

function SelectField({
  label,
  name,
  options,
  className,
}: {
  label: string;
  name: string;
  options: string[];
  className?: string;
}) {
  return (
    <label className={className}>
      <span className="mb-2 block font-mono text-[11px] uppercase tracking-widest2 text-ink-soft">
        {label}
      </span>
      <select
        name={name}
        defaultValue=""
        className="min-h-[44px] w-full rounded-sm border border-line bg-bg px-4 py-3 text-ink focus:border-gold"
      >
        <option value="" disabled>
          Select…
        </option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}
