import PageView from "@/components/PageView";
import { getContent } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

const page = () => getContent("/");

export const metadata = pageMetadata(page());

export default function Home() {
  return <PageView page={page()} />;
}
