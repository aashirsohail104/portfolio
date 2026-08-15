import { useState, type ChangeEvent, type FormEvent } from "react";
import { CheckCircle2, Send } from "lucide-react";

import { Button } from "@/components/ui/Button";

const SUBJECTS = [
  "Product inquiry",
  "Order support",
  "Wholesale / bulk pricing",
  "Warranty & repairs",
  "Other",
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface FormValues {
  name: string;
  contact: string;
  subject: string;
  message: string;
}

type FormErrors = Partial<Record<"name" | "contact" | "message", string>>;

const INITIAL_VALUES: FormValues = {
  name: "",
  contact: "",
  subject: SUBJECTS[0],
  message: "",
};

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  if (!values.name.trim()) {
    errors.name = "Please enter your name.";
  }
  const contact = values.contact.trim();
  if (!contact) {
    errors.contact = "Please enter a phone number or email.";
  } else if (contact.includes("@") && !EMAIL_RE.test(contact)) {
    errors.contact = "Please enter a valid email address.";
  }
  if (!values.message.trim()) {
    errors.message = "Please enter your message.";
  }
  return errors;
}

const inputClass = (hasError: boolean) =>
  `mt-1.5 w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground ${
    hasError ? "border-destructive" : "border-input"
  }`;

export function ContactForm() {
  const [values, setValues] = useState<FormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (name in errors) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name as keyof FormErrors];
        return next;
      });
    }
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    setSubmitted(true);
    setValues(INITIAL_VALUES);
  }

  if (submitted) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex flex-col items-start gap-4 rounded-lg border border-border bg-card p-6 shadow-card"
      >
        <span
          aria-hidden="true"
          className="grid size-12 place-items-center rounded-full bg-success/10 text-success"
        >
          <CheckCircle2 className="size-6" />
        </span>
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Message received — we&apos;ll get back to you
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Thanks for reaching out. We usually reply within working hours.
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Demo — no message is actually sent.</p>
        </div>
        <Button type="button" variant="outline" onClick={() => setSubmitted(false)}>
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="text-sm font-medium text-foreground">
            Your name <span aria-hidden="true" className="text-destructive">*</span>
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            value={values.name}
            onChange={handleChange}
            aria-required="true"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "contact-name-error" : undefined}
            className={inputClass(!!errors.name)}
          />
          {errors.name && (
            <p id="contact-name-error" role="alert" className="mt-1.5 text-xs font-medium text-destructive">
              {errors.name}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="contact-value" className="text-sm font-medium text-foreground">
            Phone or email <span aria-hidden="true" className="text-destructive">*</span>
          </label>
          <input
            id="contact-value"
            name="contact"
            type="text"
            autoComplete="tel"
            value={values.contact}
            onChange={handleChange}
            aria-required="true"
            aria-invalid={!!errors.contact}
            aria-describedby={errors.contact ? "contact-value-error" : undefined}
            className={inputClass(!!errors.contact)}
            placeholder="0312 3581962 or you@example.com"
          />
          {errors.contact && (
            <p id="contact-value-error" role="alert" className="mt-1.5 text-xs font-medium text-destructive">
              {errors.contact}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="contact-subject" className="text-sm font-medium text-foreground">
          Subject <span className="font-normal text-muted-foreground">(optional)</span>
        </label>
        <select
          id="contact-subject"
          name="subject"
          value={values.subject}
          onChange={handleChange}
          className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
        >
          {SUBJECTS.map((subject) => (
            <option key={subject} value={subject}>
              {subject}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="contact-message" className="text-sm font-medium text-foreground">
          Message <span aria-hidden="true" className="text-destructive">*</span>
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          value={values.message}
          onChange={handleChange}
          aria-required="true"
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "contact-message-error" : undefined}
          className={`${inputClass(!!errors.message)} resize-y`}
          placeholder="How can we help?"
        />
        {errors.message && (
          <p id="contact-message-error" role="alert" className="mt-1.5 text-xs font-medium text-destructive">
            {errors.message}
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" size="md">
          <Send className="size-4" aria-hidden="true" />
          Send message
        </Button>
        <p className="text-xs text-muted-foreground">Demo — no message is actually sent.</p>
      </div>
    </form>
  );
}
