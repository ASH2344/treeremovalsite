import { marked } from "marked";
import PageView from "@/components/PageView";
import { getAllContent, getContent } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import siteConfig, { phoneHref } from "@/site.config";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllContent()
    .filter((p) => p.url !== "/")
    .map((p) => ({ slug: p.url.replace(/\//g, "") }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  return pageMetadata(getContent(`/${slug}/`));
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const page = getContent(`/${slug}/`);
  const successHtml = page.form
    ? (marked.parseInline(page.form.successMessage.replace(/\[PHONE\]/g, `<a href="${phoneHref()}">${siteConfig.phone}</a>`), { async: false }) as string)
    : undefined;
  return <PageView page={page} successHtml={successHtml} />;
}
