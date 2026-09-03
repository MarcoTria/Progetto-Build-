import { useState, type FormEvent } from "react";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

export function CTASection() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const subject = encodeURIComponent(`Project inquiry from ${form.get("name")}`);
    const body = encodeURIComponent(
      `Name: ${form.get("name")}\nEmail: ${form.get("email")}\nPhone: ${form.get("phone")}\n\n${form.get(
        "message",
      )}`,
    );
    window.location.href = `mailto:hello@progettobuild.com?subject=${subject}&body=${body}`;
    setSent(true);
  }

  return (
    <section id="contact" className="bg-ink px-6 py-20 md:py-28">
      <SectionHeading
        eyebrow="Start Your Project"
        title="Tell us what you're building"
        description="Share a few details and we'll follow up to schedule a walkthrough."
        light
      />

      <Reveal as="div" className="mx-auto mt-12 max-w-xl">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Name" name="name" autoComplete="name" required />
          <Field label="Email" name="email" type="email" autoComplete="email" required />
          <Field label="Phone" name="phone" type="tel" autoComplete="tel" />
          <Field label="Project type" name="type" placeholder="Kitchen, bath, full home…" />
          <label className="sm:col-span-2">
            <span className="mb-2 block font-body text-xs uppercase tracking-widest2 text-white/60">
              Project details
            </span>
            <textarea
              name="message"
              rows={4}
              className="w-full rounded-sm border border-white/20 bg-white/5 px-4 py-3 font-body text-white placeholder:text-white/30 focus:border-gold-bright"
              placeholder="Tell us about the space and timeline"
            />
          </label>
          <div className="sm:col-span-2">
            <button
              type="submit"
              className="w-full rounded-sm bg-gold-bright px-7 py-4 font-body text-xs uppercase tracking-widest2 text-ink transition-transform duration-200 hover:scale-[1.01] sm:w-auto"
            >
              Send Inquiry
            </button>
            <p role="status" className="mt-3 font-body text-xs text-white/50">
              {sent
                ? "Opening your email client to send this inquiry…"
                : "We typically reply within one business day."}
            </p>
          </div>
        </form>
      </Reveal>
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
      <span className="mb-2 block font-body text-xs uppercase tracking-widest2 text-white/60">
        {label}
        {required && <span className="text-gold-bright"> *</span>}
      </span>
      <input
        name={name}
        type={type}
        autoComplete={autoComplete}
        required={required}
        placeholder={placeholder}
        className="min-h-[44px] w-full rounded-sm border border-white/20 bg-white/5 px-4 py-3 font-body text-white placeholder:text-white/30 focus:border-gold-bright"
      />
    </label>
  );
}
