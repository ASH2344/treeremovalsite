// Site structure that isn't page copy: page type, short labels, images,
// and the internal links content.md describes in words ("Learn more about
// tree removal", "See the cost guide"...). All copy lives in content.md.

export type PageKind = "home" | "service" | "area" | "guide" | "contact";

export interface LinkRule {
  /** exact text as it appears in content.md */
  find: string;
  /** the part of `find` that becomes the link text */
  text: string;
  href: string;
}

export interface PageDef {
  url: string;
  kind: PageKind;
  label: string; // short name for nav, breadcrumbs, footer
  image: string; // key in lib/images.ts
  serviceType?: string; // Service schema
  city?: string; // area pages
  links?: LinkRule[];
}

const L = (find: string, text: string, href: string): LinkRule => ({ find, text, href });

/** Town names in "Areas" lists that link to their own pages. */
export const AREA_LINKS: Record<string, string> = {
  "Warner Robins": "/warner-robins/",
  Perry: "/perry-ga/",
  Milledgeville: "/milledgeville-ga/",
  Forsyth: "/forsyth-ga/",
  Gray: "/gray-ga/",
};

export const PAGES: PageDef[] = [
  {
    url: "/",
    kind: "home",
    label: "Home",
    image: "chainsaw-cutting-tree-stump",
    serviceType: "Tree service",
    links: [
      L("Learn more about tree removal", "Learn more about tree removal", "/tree-removal/"),
      L("Learn more about tree trimming", "Learn more about tree trimming", "/tree-trimming/"),
    ],
  },
  {
    url: "/tree-removal/",
    kind: "service",
    label: "Tree Removal",
    image: "chainsaw-cutting-felled-trunk",
    serviceType: "Tree removal",
  },
  {
    url: "/tree-trimming/",
    kind: "service",
    label: "Tree Trimming",
    image: "pine-tree-pole-saw-yard",
    serviceType: "Tree trimming and pruning",
    links: [L("see our tree removal service", "tree removal service", "/tree-removal/")],
  },
  {
    url: "/stump-grinding/",
    kind: "service",
    label: "Stump Grinding",
    image: "tree-stump-cleared-lot",
    serviceType: "Stump grinding",
  },
  {
    url: "/emergency-tree-removal/",
    kind: "service",
    label: "Emergency Tree Removal",
    image: "fallen-tree-blocking-road",
    serviceType: "Emergency tree removal",
  },
  {
    url: "/land-clearing/",
    kind: "service",
    label: "Land Clearing",
    image: "cutting-log-land-clearing",
    serviceType: "Land clearing",
  },
  {
    url: "/tree-removal-cost/",
    kind: "guide",
    label: "Tree Removal Cost",
    image: "chainsaw-on-cut-logs",
    links: [
      L("See stump grinding", "See stump grinding", "/stump-grinding/"),
      L("See emergency tree removal", "See emergency tree removal", "/emergency-tree-removal/"),
    ],
  },
  {
    url: "/warner-robins/",
    kind: "area",
    label: "Warner Robins",
    city: "Warner Robins",
    image: "uprooted-tree-after-storm",
    serviceType: "Tree service",
  },
  {
    url: "/perry-ga/",
    kind: "area",
    label: "Perry",
    city: "Perry",
    image: "splitting-logs-backyard",
    serviceType: "Tree service",
    links: [
      L("More on tree removal", "More on tree removal", "/tree-removal/"),
      L("More on trimming", "More on trimming", "/tree-trimming/"),
      L("More on stump grinding", "More on stump grinding", "/stump-grinding/"),
      L("More on land clearing", "More on land clearing", "/land-clearing/"),
      L("Emergency service", "Emergency service", "/emergency-tree-removal/"),
      L("tree removal cost guide", "tree removal cost guide", "/tree-removal-cost/"),
    ],
  },
  {
    url: "/milledgeville-ga/",
    kind: "area",
    label: "Milledgeville",
    city: "Milledgeville",
    image: "chainsaw-cutting-log-section",
    serviceType: "Tree service",
    links: [L("See the tree removal cost guide", "tree removal cost guide", "/tree-removal-cost/")],
  },
  {
    url: "/forsyth-ga/",
    kind: "area",
    label: "Forsyth",
    city: "Forsyth",
    image: "crew-cutting-tree-trunk-sections",
    serviceType: "Tree service",
    links: [L("See the cost guide", "cost guide", "/tree-removal-cost/")],
  },
  {
    url: "/gray-ga/",
    kind: "area",
    label: "Gray",
    city: "Gray",
    image: "chainsaw-operator-oak-tree",
    serviceType: "Tree service",
    links: [L("See the cost guide", "cost guide", "/tree-removal-cost/")],
  },
  {
    url: "/diseased-tree-signs/",
    kind: "guide",
    label: "Diseased Tree Signs",
    image: "decayed-tree-trunk-inspection",
    links: [
      L("Learn about tree removal", "Learn about tree removal", "/tree-removal/"),
      L("see trimming options", "see trimming options", "/tree-trimming/"),
    ],
  },
  {
    url: "/when-to-trim-pine-trees/",
    kind: "guide",
    label: "When to Trim Pine Trees",
    image: "pine-tree-pole-saw-yard",
    links: [
      L("See signs of a diseased tree", "signs of a diseased tree", "/diseased-tree-signs/"),
      L("or tree removal.", "tree removal", "/tree-removal/"),
      L("see our tree trimming service", "tree trimming service", "/tree-trimming/"),
    ],
  },
  {
    url: "/macon-tree-removal-permit/",
    kind: "guide",
    label: "Tree Removal Permits",
    image: "cutting-trunk-with-crane-truck",
    links: [L("see our tree removal service", "tree removal service", "/tree-removal/")],
  },
  {
    url: "/contact/",
    kind: "contact",
    label: "Contact",
    image: "chainsaw-resting-on-stump",
  },
];

export const SERVICE_NAV = PAGES.filter((p) => p.kind === "service");
export const AREA_NAV = [
  { url: "/", label: "Macon" },
  ...PAGES.filter((p) => p.kind === "area").map((p) => ({ url: p.url, label: p.label })),
];
export const GUIDE_NAV = PAGES.filter((p) => p.kind === "guide");

export function getPageDef(url: string): PageDef {
  const def = PAGES.find((p) => p.url === url);
  if (!def) throw new Error(`No page definition for ${url}`);
  return def;
}
