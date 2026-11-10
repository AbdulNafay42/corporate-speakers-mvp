"use client";
import { useState } from "react";
import type { FormEvent } from "react";
import { Arrow } from "./icons";
export function ContactForm({ interest = "" }: { interest?: string }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const form = event.currentTarget;
    setPending(true);
    setError("");
    const data = Object.fromEntries(new FormData(form));
    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(15000),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(
          result.error || "Something went wrong. Please try again.",
        );
      setSuccess(true);
      form.reset();
    } catch (e) {
      setError(
        e instanceof Error && e.name !== "TimeoutError"
          ? e.message
          : "The request took too long. Please try again.",
      );
    } finally {
      setPending(false);
    }
  }
  if (success)
    return (
      <div className="form-success" role="status">
        <span className="success-icon" aria-hidden="true">
          ?
        </span>
        <h2>Conversation started.</h2>
        <p>
          Thank you. Your inquiry has been received. Our team will review your
          message and get in touch using the email you provided.
        </p>
        <button className="text-link" onClick={() => setSuccess(false)}>
          Send another inquiry <Arrow />
        </button>
      </div>
    );
  return (
    <form onSubmit={submit} className="contact-form" aria-busy={pending}>
      <p className="form-intro">
        Tell us a little about what you have in mind.
      </p>
      <p className="required-note">All fields are required.</p>
      <fieldset disabled={pending}>
        <div className="form-row">
          <label>
            Full name
            <input
              name="name"
              autoComplete="name"
              placeholder="Your name"
              minLength={2}
              maxLength={120}
              required
            />
          </label>
          <label>
            Work email
            <input
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              maxLength={254}
              required
            />
          </label>
        </div>
        <label>
          Company
          <input
            name="company"
            autoComplete="organization"
            placeholder="Your organization"
            minLength={2}
            maxLength={160}
            required
          />
        </label>
        <label>
          What do you have in mind?
          <textarea
            name="message"
            rows={6}
            minLength={20}
            maxLength={5000}
            placeholder="Tell us about your audience, event, or the change you’d like to inspire…"
            defaultValue={
              interest ? `I'd like to learn more about ${interest}. ` : ""
            }
            required
          />
        </label>
        <div className="honeypot" aria-hidden="true">
          <label>
            Leave this field blank
            <input name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>
        <p className="form-privacy">
          We’ll use your details to respond to your inquiry. Please avoid
          including sensitive personal information.
        </p>
        {error ? (
          <p className="form-error" role="alert">
            {error}
          </p>
        ) : null}
        <button className="button" type="submit">
          {pending ? "Sending your inquiry…" : "Start the conversation"}
          <Arrow diagonal />
        </button>
      </fieldset>
    </form>
  );
}
