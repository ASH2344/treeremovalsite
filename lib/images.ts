import manifest from "./image-manifest.json";

export const IMAGE_ALT: Record<string, string> = {
  "chainsaw-cutting-tree-stump": "Tree worker cutting a tree stump with a chainsaw among green brush",
  "chainsaw-cutting-felled-trunk": "Chainsaw cutting a felled tree trunk into sections during a tree removal",
  "pine-tree-pole-saw-yard": "Pole saw leaning against a tall pine tree in a residential yard",
  "tree-stump-cleared-lot": "Large tree stump left on a cleared wooded lot",
  "fallen-tree-blocking-road": "Storm-fallen tree lying across a road beside a parked car and safety barrier",
  "uprooted-tree-after-storm": "Uprooted tree with exposed roots fallen along a residential street after a storm",
  "cutting-log-land-clearing": "Worker cutting a fallen log with a chainsaw in an overgrown field",
  "chainsaw-on-cut-logs": "Chainsaw resting on freshly cut logs after a tree removal",
  "crew-cutting-tree-trunk-sections": "Workers in safety gear cutting a downed tree trunk into sections",
  "splitting-logs-backyard": "Man splitting a tree log beside a woodpile in a backyard",
  "chainsaw-cutting-log-section": "Chainsaw cutting through a section of tree trunk on the ground",
  "cutting-trunk-with-crane-truck": "Worker cutting a tree trunk next to a crane truck on a residential street",
  "chainsaw-operator-oak-tree": "Chainsaw operator in ear and eye protection standing beside a large tree",
  "decayed-tree-trunk-inspection": "Worker cutting into a decayed, hollowing tree trunk",
  "chainsaw-resting-on-stump": "Chainsaw resting on top of a freshly cut tree stump",
};

type Manifest = Record<string, { ratio: number; widths: number[] }>;
const M = manifest as Manifest;

export function imageInfo(name: string) {
  const entry = M[name];
  if (!entry) throw new Error(`Unknown image ${name}`);
  const widths = entry.widths;
  const largest = widths[widths.length - 1];
  return {
    alt: IMAGE_ALT[name] ?? "",
    src: `/images/${name}-${widths.includes(800) ? 800 : largest}.webp`,
    srcSet: widths.map((w) => `/images/${name}-${w}.webp ${w}w`).join(", "),
    width: largest,
    height: Math.round(largest * entry.ratio),
    ogSrc: `/images/${name}-og.jpg`,
  };
}
