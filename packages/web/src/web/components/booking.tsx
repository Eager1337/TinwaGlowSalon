import { useEffect, useRef, useState } from "react";
import { X, ArrowUpRight, CheckCircle2, MessageCircle, ArrowLeft } from "lucide-react";
import { services, whatsapp } from "../lib/content";
import { useCreateEnquiry } from "../queries/enquiries";

export default function Booking({ initial, close }: { initial: string; close: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const create = useCreateEnquiry();
  const [result, setResult] = useState<{ id: string; message: string } | null>(null);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    service: initial || services[2].name,
    date: "",
    time: "Afternoon" as "Morning" | "Afternoon" | "Evening",
    name: "",
    phone: "",
    notes: "",
    consent: false,
    website: "",
  });
  useEffect(() => {
    const previous = document.activeElement as HTMLElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.current?.showModal();
    dialog.current?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "Tab") {
        const nodes = dialog.current?.querySelectorAll<HTMLElement>(
          "button:not(:disabled), a[href], input:not([type=hidden]), select, textarea",
        );
        if (!nodes?.length) return;
        const first = nodes[0],
          last = nodes[nodes.length - 1];
        if (
          e.shiftKey &&
          (document.activeElement === first || document.activeElement === dialog.current)
        ) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", key);
      previous?.focus();
    };
  }, [close]);
  const today = new Date().toISOString().slice(0, 10);
  const max = new Date(Date.now() + 90 * 86400000).toISOString().slice(0, 10);
  return (
    <>
      <dialog
        className="booking-modal"
        ref={dialog}
        tabIndex={-1}
        onCancel={close}
        aria-labelledby="booking-title"
      >
        <button className="close-button" onClick={close} aria-label="Close appointment request">
          <X size={22} />
        </button>
        {result ? (
          <div className="booking-success">
            <CheckCircle2 size={48} />
            <span className="eyebrow">REQUEST SAVED · {result.id}</span>
            <h2 id="booking-title">
              One step closer
              <br />
              to your <em>glow.</em>
            </h2>
            <p>
              Your request has been saved in this demonstration website. It has{" "}
              <strong>not been sent to the salon</strong>. Share it on WhatsApp to ask Tinwa Glow to
              confirm.
            </p>
            <a
              className="button primary"
              href={`${whatsapp}?text=${encodeURIComponent(result.message)}`}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle size={18} /> Send to the salon on WhatsApp <ArrowUpRight size={18} />
            </a>
            <p className="small">
              Opening WhatsApp does not send a message automatically. No appointment is confirmed
              until the team responds.
            </p>
            <button className="text-button" onClick={close}>
              Back to exploring
            </button>
          </div>
        ) : (
          <>
            <span className="eyebrow">YOUR MOMENT OF SELF-CARE</span>
            <h2 id="booking-title">
              Let’s make time
              <br />
              for <em>you.</em>
            </h2>
            <div className="steps">
              <span className={step === 1 ? "active" : ""}>01 · Your treatment</span>
              <span className={step === 2 ? "active" : ""}>02 · Your details</span>
            </div>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (step === 1) {
                  setStep(2);
                  return;
                }
                if (!form.consent) return;
                try {
                  const saved = await create.mutateAsync({ ...form, consent: true });
                  setResult({
                    id: saved.id,
                    message: `Hello Tinwa Glow! I would like to request an appointment.\nReference: ${saved.id}\nName: ${form.name}\nPhone: ${form.phone}\nTreatment: ${form.service}\nPreferred date: ${form.date}\nPreferred time: ${form.time}\n${form.notes ? "Notes: " + form.notes + "\n" : ""}Please confirm availability and the price. Thank you!`,
                  });
                } catch {
                  /* Error is displayed below. */
                }
              }}
            >
              {step === 1 ? (
                <>
                  <label>
                    Treatment
                    <select
                      value={form.service}
                      onChange={(e) => setForm({ ...form, service: e.target.value })}
                    >
                      {services.map((s) => (
                        <option key={s.name}>{s.name}</option>
                      ))}
                    </select>
                  </label>
                  <div className="form-grid">
                    <label>
                      Preferred date
                      <input
                        type="date"
                        aria-label="Preferred date"
                        min={today}
                        max={max}
                        required
                        value={form.date}
                        onChange={(e) => setForm({ ...form, date: e.target.value })}
                      />
                    </label>
                    <label>
                      Preferred time
                      <select
                        value={form.time}
                        onChange={(e) =>
                          setForm({ ...form, time: e.target.value as typeof form.time })
                        }
                      >
                        <option>Morning</option>
                        <option>Afternoon</option>
                        <option>Evening</option>
                      </select>
                    </label>
                  </div>
                  <p className="notice">
                    These are preferences, not available slots. The salon will confirm your
                    treatment, time and price.
                  </p>
                  <button className="button primary full" type="submit">
                    Continue to your details <ArrowUpRight size={18} />
                  </button>
                </>
              ) : (
                <>
                  <div className="request-summary">
                    {form.service}
                    <small>
                      {form.date} · {form.time} preferred
                    </small>
                  </div>
                  <div className="form-grid">
                    <label>
                      Your name
                      <input
                        autoComplete="name"
                        aria-label="Your name"
                        required
                        minLength={2}
                        maxLength={100}
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Full name"
                      />
                    </label>
                    <label>
                      Phone / WhatsApp
                      <input
                        type="tel"
                        aria-label="Phone or WhatsApp number"
                        autoComplete="tel"
                        required
                        pattern={"\\+?[0-9\\s\\(\\)\\-]{7,20}"}
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="+232 ..."
                      />
                    </label>
                  </div>
                  <label>
                    Anything else? <span className="optional">Optional</span>
                    <textarea
                      aria-label="Additional notes"
                      maxLength={500}
                      rows={3}
                      value={form.notes}
                      onChange={(e) => setForm({ ...form, notes: e.target.value })}
                      placeholder="Your preferred style, occasion, or a question. Please don’t include medical information."
                    />
                  </label>
                  <input type="hidden" name="website" value={form.website} />
                  <label className="consent">
                    <input
                      type="checkbox"
                      aria-label="Consent to save my enquiry details"
                      required
                      checked={form.consent}
                      onChange={(e) => setForm({ ...form, consent: e.target.checked })}
                    />
                    <span>
                      I agree to save my details for this enquiry and understand this is a
                      sales-demo website.{" "}
                      <a href="/privacy" target="_blank">
                        Privacy details
                      </a>
                    </span>
                  </label>
                  {create.isError && (
                    <p className="error" role="alert">
                      {create.error.message ||
                        "Unable to save your request. Please call or use WhatsApp."}
                    </p>
                  )}
                  <button className="button primary full" disabled={create.isPending} type="submit">
                    {create.isPending ? "Saving your request…" : "Save appointment request"}{" "}
                    <ArrowUpRight size={18} />
                  </button>
                  <button type="button" className="text-button" onClick={() => setStep(1)}>
                    <ArrowLeft size={15} /> Back to treatment
                  </button>
                </>
              )}
            </form>
            <div className="booking-footnote">
              No payment needed · No account needed · Confirmation by the salon
            </div>
          </>
        )}
      </dialog>
    </>
  );
}
