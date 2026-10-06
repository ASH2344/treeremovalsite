"use client";

import { useState, type FormEvent } from "react";
import type { FormField } from "@/lib/content";
import { CheckIcon } from "./Icons";

interface Props {
  fields: FormField[];
  submitText: string;
  successHtml: string;
  accessKey: string;
  siteName: string;
}

const ENDPOINT = "https://api.web3forms.com/submit";

function fieldName(label: string) {
  return label;
}

function fieldId(label: string) {
  return "f-" + label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-$/, "");
}

const inputCls =
  "mt-1.5 block w-full rounded-lg border border-forest-200 bg-white px-3.5 py-3 text-base text-ink shadow-sm placeholder:text-muted/70 focus:border-forest-600 focus:outline-none focus:ring-2 focus:ring-forest-600/30";

export default function ContactForm({ fields, submitText, successHtml, accessKey, siteName }: Props) {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    if (data.get("botcheck")) return; // honeypot

    const fileField = fields.find((f) => f.type === "file");
    if (fileField) {
      const files = data.getAll(fieldName(fileField.label)).filter((f) => f instanceof File && f.size > 0) as File[];
      if (fileField.maxFiles && files.length > fileField.maxFiles) {
        setStatus("error");
        setError(`Please attach up to ${fileField.maxFiles} photos.`);
        return;
      }
      if (files.length === 0) data.delete(fieldName(fileField.label));
    }

    const service = String(data.get("Service needed") ?? "");
    const zip = String(data.get("Property address or ZIP code") ?? "");
    data.set("access_key", accessKey);
    data.set("subject", `New quote request: ${service || "Tree service"} (${zip}) – ${siteName}`);
    data.set("from_name", siteName);
    const email = String(data.get("Email") ?? "");
    if (email) data.set("replyto", email);

    setStatus("sending");
    setError("");
    try {
      let res = await fetch(ENDPOINT, { method: "POST", body: data, headers: { Accept: "application/json" } });
      let json = await res.json().catch(() => ({}));

      // File attachments need a paid Web3Forms plan. If they're rejected,
      // resend without the photos so the lead is never lost.
      if ((!res.ok || !json.success) && fileField && data.getAll(fieldName(fileField.label)).length) {
        const count = data.getAll(fieldName(fileField.label)).length;
        data.delete(fieldName(fileField.label));
        data.set("Photos", `Customer tried to attach ${count} photo(s); ask them to text or email the photos.`);
        res = await fetch(ENDPOINT, { method: "POST", body: data, headers: { Accept: "application/json" } });
        json = await res.json().catch(() => ({}));
      }

      if (res.ok && json.success) {
        setStatus("done");
        form.reset();
        if (typeof window !== "undefined" && "gtag" in window) {
          (window as unknown as { gtag: (...a: unknown[]) => void }).gtag("event", "generate_lead", { service });
        }
      } else {
        throw new Error(json.message || "Something went wrong.");
      }
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "done") {
    return (
      <div role="status" className="rounded-2xl border border-forest-200 bg-forest-50 p-6 sm:p-8">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 rounded-full bg-forest-700 p-1.5 text-white">
            <CheckIcon />
          </span>
          <p className="text-lg leading-relaxed text-forest-900 [&_a]:font-bold [&_a]:underline" dangerouslySetInnerHTML={{ __html: successHtml }} />
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5 sm:grid-cols-2" noValidate={false}>
      <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      {fields.map((f) => {
        const id = fieldId(f.label);
        const name = fieldName(f.label);
        const wide = ["textarea", "file", "radio", "text"].includes(f.type) && f.label !== "Full name";
        const label = (
          <>
            {f.label}
            {f.required ? <span className="text-bark-600"> *</span> : <span className="font-normal text-muted"> (optional)</span>}
          </>
        );
        if (f.type === "radio") {
          return (
            <fieldset key={id} className="sm:col-span-2">
              <legend className="font-semibold text-forest-900">{label}</legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {f.options!.map((o) => (
                  <label key={o} className="flex cursor-pointer items-center gap-2 rounded-lg border border-forest-200 px-4 py-2.5 has-[:checked]:border-forest-700 has-[:checked]:bg-forest-50">
                    <input type="radio" name={name} value={o} required={f.required} className="accent-forest-700" />
                    {o}
                  </label>
                ))}
              </div>
            </fieldset>
          );
        }
        return (
          <div key={id} className={wide ? "sm:col-span-2" : ""}>
            <label htmlFor={id} className="font-semibold text-forest-900">
              {label}
            </label>
            {f.type === "select" ? (
              <select id={id} name={name} required={f.required} className={inputCls} defaultValue="">
                <option value="" disabled>
                  Choose one
                </option>
                {f.options!.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            ) : f.type === "textarea" ? (
              <textarea id={id} name={name} rows={5} required={f.required} className={inputCls} />
            ) : f.type === "file" ? (
              <>
                <input
                  id={id}
                  name={name}
                  type="file"
                  accept="image/*"
                  multiple
                  className="mt-1.5 block w-full rounded-lg border border-dashed border-forest-200 bg-cream px-3.5 py-3 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-forest-700 file:px-3 file:py-2 file:font-semibold file:text-white"
                  aria-describedby={`${id}-hint`}
                />
                <p id={`${id}-hint`} className="mt-1 text-sm text-muted">
                  Up to {f.maxFiles} photos.
                </p>
              </>
            ) : (
              <input
                id={id}
                name={name}
                type={f.type}
                required={f.required}
                className={inputCls}
                autoComplete={f.type === "tel" ? "tel" : f.type === "email" ? "email" : f.label === "Full name" ? "name" : f.label.startsWith("Property") ? "street-address" : undefined}
                inputMode={f.type === "tel" ? "tel" : undefined}
              />
            )}
          </div>
        );
      })}

      {status === "error" && (
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-red-800 sm:col-span-2">
          {error} Please try again or call us.
        </p>
      )}

      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={status === "sending"}
          className="w-full rounded-lg bg-bark-500 px-6 py-4 text-lg font-bold text-white transition-colors hover:bg-bark-600 disabled:opacity-70 sm:w-auto"
        >
          {status === "sending" ? "Sending…" : submitText}
        </button>
      </div>
    </form>
  );
}
