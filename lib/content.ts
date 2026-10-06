// Reads content.md at build time and turns each "## Page N" block into
// structured page data. content.md is the single source of truth for copy.
import fs from "node:fs";
import path from "node:path";
import { marked } from "marked";
import siteConfig, { phoneHref } from "@/site.config";
import { AREA_LINKS, getPageDef, type LinkRule } from "./pages";

marked.setOptions({ gfm: true, breaks: false });

export interface Faq {
  q: string;
  a: string; // html
  aText: string; // plain text for schema
}

export interface Section {
  heading: string;
  id: string;
  html: string;
  faqs?: Faq[];
  cards?: { title: string; html: string }[];
  isFaq: boolean;
}

export interface FormField {
  label: string;
  type: "text" | "tel" | "email" | "select" | "radio" | "file" | "textarea";
  required: boolean;
  options?: string[];
  maxFiles?: number;
}

export interface PageContent {
  url: string;
  name: string;
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  sections: Section[];
  faqs: Faq[];
  form?: { fields: FormField[]; submitText: string; successMessage: string };
}

const QUOTE_BUTTON_HTML = `<a href="/contact/" class="btn-quote-inline">Get a Free Quote</a>`;

function phoneLinkHtml() {
  return `<a href="${phoneHref()}" class="tel-link">${siteConfig.phone}</a>`;
}

/** Unescape markdown escapes used in the doc: \[PHONE\], \| etc. */
function unescape(s: string) {
  return s.replace(/\\\[/g, "[").replace(/\\\]/g, "]").replace(/\\\|/g, "|");
}

/** Plain-text placeholder replacement (titles, meta descriptions). */
export function fillText(s: string) {
  return unescape(s)
    .replace(/\[PHONE\]/g, siteConfig.phone)
    .replace(/\[QUOTE BUTTON\]/g, "request a free quote");
}

function fillHtmlTokens(md: string) {
  return md.replace(/\[PHONE\]/g, phoneLinkHtml()).replace(/\[QUOTE BUTTON\]/g, QUOTE_BUTTON_HTML);
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function stripTags(html: string) {
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function render(md: string) {
  const html = marked.parse(fillHtmlTokens(md), { async: false }) as string;
  // make tables scroll on small screens
  return html.replace(/<table>/g, '<div class="table-wrap"><table>').replace(/<\/table>/g, "</table></div>");
}

function applyLinkRules(md: string, rules: LinkRule[] = [], pageUrl: string) {
  let out = md;
  for (const r of rules) {
    const i = out.indexOf(r.find);
    if (i === -1) throw new Error(`Link text "${r.find}" not found on ${pageUrl}`);
    const linked = r.find.replace(r.text, `[${r.text}](${r.href})`);
    out = out.slice(0, i) + linked + out.slice(i + r.find.length);
  }
  return out;
}

/** Link town names (and Macon) inside service-area sections. */
function linkAreas(md: string, pageUrl: string) {
  let out = md;
  const targets: [string, string][] = Object.entries(AREA_LINKS);
  if (pageUrl !== "/") targets.push(["Macon", "/"]);
  for (const [name, href] of targets) {
    if (href === pageUrl) continue;
    const re = new RegExp(`(^|[^\\[\\w])(${name})(?![\\w-]|\\]\\()`, "m");
    out = out.replace(re, `$1[$2](${href})`);
  }
  return out;
}

function parseMetaTable(block: string) {
  const meta: Record<string, string> = {};
  for (const line of block.split("\n")) {
    if (!line.startsWith("|")) continue;
    const cells = line
      .replace(/\\\|/g, "\u0000")
      .split("|")
      .map((c) => c.replace(/\u0000/g, "|").trim());
    // ["", field, value, ""]
    if (cells.length >= 3 && cells[1] && cells[1] !== "Field" && !/^-+$/.test(cells[1])) {
      meta[cells[1]] = cells[2];
    }
  }
  return meta;
}

function parseFaqs(md: string): Faq[] {
  const faqs: Faq[] = [];
  for (const para of md.split(/\n\s*\n/)) {
    const m = para.trim().match(/^\*\*(.+?)\*\*\s+([\s\S]+)$/);
    if (!m) continue;
    const aHtml = (marked.parseInline(fillHtmlTokens(m[2].trim()), { async: false }) as string).trim();
    faqs.push({ q: m[1].trim(), a: aHtml, aText: fillText(stripTags(aHtml)) });
  }
  return faqs;
}

/** Sections where every paragraph is "**Title.** text" become cards. */
function parseCards(md: string) {
  const paras = md.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  if (paras.length < 3) return undefined;
  const cards = [];
  for (const p of paras) {
    const m = p.match(/^\*\*(.+?)\.\*\*\s+([\s\S]+)$/);
    if (!m) return undefined;
    cards.push({ title: m[1], html: (marked.parseInline(fillHtmlTokens(m[2]), { async: false }) as string).trim() });
  }
  return cards;
}

function parseFormTable(md: string): FormField[] {
  const fields: FormField[] = [];
  for (const line of md.split("\n")) {
    if (!line.startsWith("|")) continue;
    const [, label, typeRaw, req] = line.split("|").map((c) => c.trim());
    if (!label || label === "Field" || /^-+$/.test(label) || label.startsWith("Submit")) continue;
    const t = typeRaw.toLowerCase();
    let field: FormField;
    if (t.startsWith("dropdown")) {
      field = { label, type: "select", required: false, options: typeRaw.split(":")[1].split(",").map((s) => s.trim()) };
    } else if (typeRaw.includes(" / ")) {
      field = { label, type: "radio", required: false, options: typeRaw.split("/").map((s) => s.trim()) };
    } else if (t.startsWith("file")) {
      const n = typeRaw.match(/up to (\d+)/i);
      field = { label, type: "file", required: false, maxFiles: n ? Number(n[1]) : 1 };
    } else if (t === "phone") field = { label, type: "tel", required: false };
    else if (t === "email") field = { label, type: "email", required: false };
    else if (t === "text area") field = { label, type: "textarea", required: false };
    else field = { label, type: "text", required: false };
    field.required = /^yes/i.test(req);
    fields.push(field);
  }
  return fields;
}

let cache: PageContent[] | null = null;

export function getAllContent(): PageContent[] {
  if (cache) return cache;
  const raw = fs.readFileSync(path.join(process.cwd(), "content.md"), "utf8").replace(/\r\n/g, "\n");
  const blocks = raw.split(/^## Page \d+: /m).slice(1);
  const pages: PageContent[] = [];

  for (const block of blocks) {
    const name = block.split("\n")[0].trim();
    const [head, bodyRaw = ""] = block.split(/^### Body copy\s*$/m);
    const meta = parseMetaTable(head);
    const url = meta["URL"];
    const def = getPageDef(url);
    const h1 = unescape(meta["H1"]);

    let body = bodyRaw.split("\n");
    // drop the bold H1 repeat at top of the body copy
    const firstIdx = body.findIndex((l) => l.trim() !== "");
    if (firstIdx !== -1 && body[firstIdx].trim() === `**${h1}**`) body.splice(firstIdx, 1);
    let bodyMd = unescape(body.join("\n"))
      // never publish internal notes
      .replace(/^\*\*Note for Aisha:?\*\*.*$/gim, "");

    const parts = bodyMd.split(/^#### /m);
    const introMd = parts.shift() ?? "";
    let form: PageContent["form"];
    const sections: Section[] = [];

    for (const part of parts) {
      const nl = part.indexOf("\n");
      const heading = part.slice(0, nl).trim();
      let md = part.slice(nl + 1).trim();
      if (/setup notes|note for aisha/i.test(heading)) continue;
      if (/quote form fields/i.test(heading)) {
        const submit = md.match(/Submit button text\s*\|\s*"?([^"|]+)"?/i);
        const success = md.match(/\*\*After submit message:\*\*\s*"(.+)"/i);
        form = {
          fields: parseFormTable(md).filter((f) => f.type !== "file" || siteConfig.formPhotoUploads),
          submitText: submit ? submit[1].trim() : "Submit",
          successMessage: success ? success[1] : "Thanks! We've received your request.",
        };
        continue;
      }
      if (/area|nearby|serving/i.test(heading)) md = linkAreas(md, url);
      const isFaq = /faq|frequently asked/i.test(heading);
      sections.push({ heading, id: slugify(heading), html: "", isFaq, _md: md } as Section & { _md: string });
    }

    // internal links from content.md wording (search across whole page)
    if (def.links?.length) {
      const joined = sections.map((s) => (s as Section & { _md: string })._md).join("\n\u0001\n");
      const linked = applyLinkRules(introMd + "\n\u0002\n" + joined, def.links, url);
      const [introLinked, rest] = linked.split("\n\u0002\n");
      rest.split("\n\u0001\n").forEach((md, i) => ((sections[i] as Section & { _md: string })._md = md));
      bodyMd = introLinked;
    } else {
      bodyMd = introMd;
    }

    for (const s of sections as (Section & { _md: string })[]) {
      if (s.isFaq) s.faqs = parseFaqs(s._md);
      else s.cards = parseCards(s._md);
      s.html = render(s._md);
      delete (s as Partial<typeof s>)._md;
    }

    pages.push({
      url,
      name,
      title: fillText(meta["SEO title"]),
      description: fillText(meta["Meta description"]),
      h1,
      introHtml: render(bodyMd.trim()),
      sections,
      faqs: sections.flatMap((s) => s.faqs ?? []),
      form,
    });
  }
  cache = pages;
  return pages;
}

export function getContent(url: string): PageContent {
  const page = getAllContent().find((p) => p.url === url);
  if (!page) throw new Error(`No content for ${url}`);
  return page;
}
