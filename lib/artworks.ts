export type Category = "portraits" | "graphite" | "charcoal" | "custom" | "originals";

export type Status = "Available" | "Commissioned" | "Private Collection";

export interface Artwork {
  id: string;
  title: string;
  categories: Category[];
  medium: string;
  year: number;
  dimensions: string;
  image: string;
  imageAlt: string;
  description: string;
  story: string;
  status: Status;
  featured?: boolean;
  price?: number;
  currency?: string;
  saleable?: boolean;
}

const images = {
  laughLines: "/portfolio-photos/laugh-lines.png",
  thoseEyesThoseCurls: "/portfolio-photos/those-eyes-those-curls.png",
  firstSmile: "/portfolio-photos/first-smile.png",
  pureDelight: "/portfolio-photos/pure-delight.png",
  beneathTheSkin: "/portfolio-photos/beneath-the-skin.png",
  theRider: "/portfolio-photos/the-rider.png",
  withABow: "/portfolio-photos/with-a-bow.png",
  pensive: "/portfolio-photos/pensive.jpg",
};

export const artworks: Artwork[] = [
  {
    id: "laugh-lines",
    title: "Laugh Lines",
    categories: ["portraits", "graphite"],
    medium: "Graphite on paper",
    year: 2026,
    dimensions: "24 × 30 cm",
    image: images.laughLines,
    imageAlt: "A graphite portrait of a man caught mid-laughter, eyes crinkled",
    description:
      "A portrait of joy with teeth — graphite chasing a laugh so genuine it almost escapes the page.",
    story:
      "Laugh Lines began with a single photograph of a man who laughs the way other people breathe — easily and often. The portrait is built around the crinkle of his eyes, drawn before the smile is even finished, because that is where the likeness actually lives. Every line here is a line he has genuinely earned.",
    status: "Available",
    featured: true,
    price: 550000,
    currency: "INR",
    saleable: true,
  },
  {
    id: "those-eyes-those-curls",
    title: "Those Eyes, Those Curls",
    categories: ["portraits", "charcoal"],
    medium: "Charcoal on paper",
    year: 2026,
    dimensions: "30 × 40 cm",
    image: images.thoseEyesThoseCurls,
    imageAlt: "A charcoal portrait of a young woman with expressive eyes and curly hair",
    description:
      "The kind of face you remember — steady eyes above a crown of curly hair, drawn in charcoal.",
    story:
      "This portrait set out to hold two competing subjects at once: a pair of eyes that refuse to look away, and a head of hair that refuses to sit still. The curls are drawn as mass and shadow rather than individual strands, letting the eyes carry the focus. It is tenderness with a little chaos, kept.",
    status: "Available",
    price: 650000,
    currency: "INR",
    saleable: true,
  },
  {
    id: "first-smile",
    title: "First Smile",
    categories: ["portraits", "graphite"],
    medium: "Graphite on paper",
    year: 2026,
    dimensions: "24 × 30 cm",
    image: images.firstSmile,
    imageAlt: "A graphite portrait of a smiling baby girl, cheeks round and eyes bright",
    description:
      "A baby's first true smile, saved in graphite before it could ever be forgotten.",
    story:
      "Commissioned from a photograph snapped mid-giggle, First Smile is a portrait about an interval of a few seconds. The cheeks are drawn fuller than reference demanded, the eyes a little brighter, until the drawing becomes less a copy and more the feeling of the moment — the kind of smile you hear before you see.",
    status: "Available",
    featured: true,
    price: 600000,
    currency: "INR",
    saleable: true,
  },
  {
    id: "pure-delight",
    title: "Pure Delight",
    categories: ["portraits", "charcoal"],
    medium: "Charcoal on paper",
    year: 2026,
    dimensions: "24 × 30 cm",
    image: images.pureDelight,
    imageAlt: "A charcoal portrait of a laughing toddler, head tilted back in delight",
    description:
      "A toddler's laugh drawn in charcoal — all joy, no pretence, no pause.",
    story:
      "Some faces are easier to draw because they hold nothing back. Pure Delight is a small charcoal study of a toddler mid-laugh: head tilted back, eyes squeezed shut, absolutely unbothered by the world. The soft smudges of charcoal were the right tool for a laugh that refuses to be contained to lines.",
    status: "Available",
    price: 500000,
    currency: "INR",
    saleable: true,
  },
  {
    id: "beneath-the-skin",
    title: "Beneath the Skin",
    categories: ["originals", "charcoal"],
    medium: "Charcoal on paper",
    year: 2026,
    dimensions: "30 × 42 cm",
    image: images.beneathTheSkin,
    imageAlt: "A dramatic charcoal study of a skull, bone and shadow in high contrast",
    description:
      "A macabre charcoal study of the architecture underneath every portrait.",
    story:
      "Every portrait sits on a skull, and Beneath the Skin is the artist's love letter to that scaffolding. Drawn as a studio exercise, it went further than intended — the cavities deepened, the light turned theatrical, and the discipline of anatomy became a study in pure drama. It is a reminder that beneath every soft smile is structure.",
    status: "Available",
    price: 450000,
    currency: "INR",
    saleable: true,
  },
  {
    id: "the-rider",
    title: "The Rider",
    categories: ["portraits", "custom"],
    medium: "Graphite on paper",
    year: 2026,
    dimensions: "30 × 40 cm",
    image: images.theRider,
    imageAlt: "A graphite portrait of a man at ease beside his motorcycle",
    description:
      "A portrait for the rider — helmet under arm, bike idling, the open road in his expression.",
    story:
      "Commissioned as a surprise by someone who knows exactly who this man is when he rides. The graphite work leans on contrast — leather and chrome handled with hard edges, the face kept soft. The bike is secondary; the point of the portrait is what happens to a man who already knows where he is going.",
    status: "Available",
    featured: true,
    price: 700000,
    currency: "INR",
    saleable: true,
  },
  {
    id: "with-a-bow",
    title: "With a Bow",
    categories: ["portraits", "graphite"],
    medium: "Graphite on paper",
    year: 2026,
    dimensions: "24 × 30 cm",
    image: images.withABow,
    imageAlt: "A graphite portrait of a girl with a bow in her hair, smiling softly",
    description:
      "A quiet portrait made perfect by a single detail — a bow in her hair, drawn with care.",
    story:
      "With a Bow is a portrait that rides on a detail: the small bow pinned into her hair, the finishing touch of a morning getting ready. The drawing lets the face stay soft and uncomplicated while the bow provides the focus, a reminder that sometimes the smallest choices make the most memorable portraits.",
    status: "Available",
    price: 550000,
    currency: "INR",
    saleable: true,
  },
  {
    id: "pensive",
    title: "Pensive",
    categories: ["portraits", "charcoal", "originals"],
    medium: "Charcoal on paper",
    year: 2026,
    dimensions: "24 × 30 cm",
    image: images.pensive,
    imageAlt: "A charcoal portrait of a young woman thinking, head held high",
    description:
      "Thought, held high — a charcoal study of a girl mid-thought with her head up.",
    story:
      "Most portraits of someone thinking catch them mid-drift, glance low. Pensive goes the other way: head held high, mind clearly elsewhere, the thinking worn openly on the face. Charcoal suited it — the medium can hold both the softness of thought and the resolve of a posture that refuses to slump.",
    status: "Available",
    featured: true,
    price: 600000,
    currency: "INR",
    saleable: true,
  },
];

export function getArtwork(id: string): Artwork | undefined {
  return artworks.find((art) => art.id === id);
}

export function getFeaturedArtworks(count = 6): Artwork[] {
  const featured = artworks.filter((art) => art.featured);
  const rest = artworks.filter((art) => !art.featured);
  return [...featured, ...rest].slice(0, count);
}

export function getRelatedArtworks(id: string, count = 3): Artwork[] {
  const current = getArtwork(id);
  if (!current) return [];
  const related = artworks
    .filter((art) => art.id !== id)
    .sort((a, b) => {
      const score = (art: Artwork) =>
        art.categories.filter((c) => current.categories.includes(c)).length;
      return score(b) - score(a);
    });
  return related.slice(0, count);
}

export const categories: { label: string; value: Category | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Portraits", value: "portraits" },
  { label: "Graphite", value: "graphite" },
  { label: "Charcoal", value: "charcoal" },
  { label: "Custom", value: "custom" },
  { label: "Originals", value: "originals" },
];