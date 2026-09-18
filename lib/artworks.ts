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
}

const images = {
  quietGaze: "photo-1494790108377-be9c29b29330",
  betweenMoments: "photo-1438761681033-6461ffad8d80",
  herPortrait: "photo-1529626455594-4ff0802cfb7e",
  oldSoul: "photo-1506794778202-cad84cf45f1d",
  stillness: "photo-1544005313-94ddf0286df2",
  eyesThatRemember: "photo-1500648767791-00dcc994a43e",
  untitledStudy: "photo-1534528741775-53994a69daeb",
  monochromeMemory: "photo-1517842645767-c639042777db",
  portraitInSilence: "photo-1517841905240-472988babdf9",
  studyInCharcoal: "photo-1547425260-76bcadfb4f2c",
  betweenLightAndDark: "photo-1519085360753-af0119f7cbe7",
  borrowedTime: "photo-1472099645785-5658abf4ff4e",
};

export const artworks: Artwork[] = [
  {
    id: "quiet-gaze",
    title: "Quiet Gaze",
    categories: ["portraits", "graphite"],
    medium: "Graphite on paper",
    year: 2026,
    dimensions: "18 × 24 cm",
    image: images.quietGaze,
    imageAlt: "A graphite pencil portrait of a young woman captured in quiet contemplation",
    description:
      "A study in restraint — a young woman caught mid-thought, rendered in soft graphite against a calm, uncluttered ground.",
    story:
      "Quiet Gaze began with a single reference photograph and the desire to capture the space between one thought and the next. The eyes carry the composition; every layer of graphite was built slowly from light to dark, holding the sitter's stillness. It is a portrait less about likeness and more about the moment a face forgets it is being watched.",
    status: "Available",
    featured: true,
  },
  {
    id: "between-moments",
    title: "Between Moments",
    categories: ["portraits", "charcoal"],
    medium: "Charcoal on paper",
    year: 2025,
    dimensions: "24 × 30 cm",
    image: images.betweenMoments,
    imageAlt: "A charcoal portrait of a woman between expressions, softly shaded",
    description:
      "A charcoal portrait that suspends a single breath between two feelings, drawn with a loose, expressive hand.",
    story:
      "Made for a client who wanted a portrait that felt less formal and more alive, Between Moments leans on the mobility of charcoal — shadows smudged into suggestion, highlights lifted back out with a kneaded eraser. The result is a face that seems to shift as you look at it, like a memory mid-recall.",
    status: "Commissioned",
    featured: true,
  },
  {
    id: "her-portrait",
    title: "Her Portrait",
    categories: ["portraits", "graphite", "custom"],
    medium: "Graphite on paper",
    year: 2026,
    dimensions: "30 × 40 cm",
    image: images.herPortrait,
    imageAlt: "A large graphite portrait of a woman looking softly forward",
    description:
      "A custom commission honoring a mother, drawn from a single treasured photograph.",
    story:
      "Commissioned as a gift, Her Portrait grew out of a black-and-white photograph taken decades earlier. Working from age-worn details, the artist rebuilt the likeness one decision at a time — softening the jaw, holding the light on the cheekbone — until the drawing felt like the person the family remembered, not just the pixels of an old print.",
    status: "Available",
    featured: true,
  },
  {
    id: "the-old-soul",
    title: "The Old Soul",
    categories: ["portraits", "charcoal"],
    medium: "Charcoal on paper",
    year: 2025,
    dimensions: "30 × 40 cm",
    image: images.oldSoul,
    imageAlt: "A charcoal portrait of an older man whose face carries deep lines",
    description:
      "A portrait of a weathered face, where every line tells the story of a life lived fully.",
    story:
      "The reference for The Old Soul was shot in soft window light, and the drawing leans into that: deepset eyes, the topography of laughter and worry, grey hair drawn hair by hair. It is an exercise in patience and honesty — no lines smoothed over, because a life lived is rarely tidy.",
    status: "Available",
  },
  {
    id: "stillness",
    title: "Stillness",
    categories: ["portraits", "graphite"],
    medium: "Graphite on paper",
    year: 2024,
    dimensions: "18 × 24 cm",
    image: images.stillness,
    imageAlt: "A quiet graphite portrait study of a woman in profile",
    description:
      "A smaller study in profile, drawn in almost silhouette-like graphite.",
    story:
      "Stillness was one of a series of quick anatomical studies. The artist kept the approach almost brutally simple — a single light source, a profile, and faith in the subtlety of graphite. What lingers is how little is actually drawn: the suggestion of eyelash, the soft turn of the neck, and everything else left to the imagination.",
    status: "Private Collection",
  },
  {
    id: "eyes-that-remember",
    title: "Eyes That Remember",
    categories: ["portraits", "charcoal", "custom"],
    medium: "Charcoal on paper",
    year: 2026,
    dimensions: "30 × 42 cm",
    image: images.eyesThatRemember,
    imageAlt: "A charcoal portrait centered on a man's expressive eyes",
    description:
      "A custom portrait built around the eyes — the part of a face that holds the most memory.",
    story:
      "Eyes That Remember is a commission from a daughter for her father. He had served as a pilot, and she asked that the portrait honour the clarity of his gaze — the same look he gives before telling a story. The drawing took three months and countless sittings of reference material; the eyes alone were redrawn seven times before they finally held the right quiet authority.",
    status: "Commissioned",
    featured: true,
  },
  {
    id: "untitled-study",
    title: "Untitled Study",
    categories: ["originals", "graphite"],
    medium: "Graphite on paper",
    year: 2024,
    dimensions: "21 × 29.7 cm",
    image: images.untitledStudy,
    imageAlt: "An expressive graphite study of a woman's face",
    description:
      "An unplanned study — the kind of drawing done for no reason other than the love of it.",
    story:
      "Untitled Study began as a warm-up with no destination. No reference, no commission, no brief — just a pencil moving to find a mood. It stayed loose where the commissioned work stays precise, and in that looseness it became one of the more honest pieces in the studio. It remains untitled on purpose: a sketch that refuses to be finished into a statement.",
    status: "Available",
  },
  {
    id: "monochrome-memory",
    title: "Monochrome Memory",
    categories: ["portraits", "charcoal", "originals"],
    medium: "Charcoal on paper",
    year: 2025,
    dimensions: "24 × 32 cm",
    image: images.monochromeMemory,
    imageAlt: "A monochrome charcoal portrait study of a woman",
    description:
      "A personal work about how memory reduces colour to light and shadow.",
    story:
      "Memory rarely keeps colour; it keeps shape and feeling. Monochrome Memory is drawn from a faded photograph of a grandmother the artist never met, reconstructed from family descriptions of her laughter and posture. The piece explores how we carry people we never knew — through the stories that draw them in charcoal.",
    status: "Available",
  },
  {
    id: "portrait-in-silence",
    title: "Portrait in Silence",
    categories: ["portraits", "graphite"],
    medium: "Graphite on paper",
    year: 2026,
    dimensions: "30 × 40 cm",
    image: images.portraitInSilence,
    imageAlt: "A large graphite portrait of a woman in graceful silence",
    description:
      "A quieter, larger work — a face drawn with the volume turned down.",
    story:
      "Portrait in Silence grew from a single sitting, where the sitter barely moved and barely spoke. The artist worked in near silence too, letting graphite pool slowly into the shadows of the hair and the hollow under the jaw. It became a meditation on the privacy inside public faces.",
    status: "Available",
    featured: true,
  },
  {
    id: "study-in-charcoal",
    title: "Study in Charcoal",
    categories: ["portraits", "charcoal", "originals"],
    medium: "Charcoal on paper",
    year: 2024,
    dimensions: "40 × 50 cm",
    image: images.studyInCharcoal,
    imageAlt: "A large charcoal study of a man's face with strong value contrast",
    description:
      "A large-scale charcoal study exploring high contrast and the drama of shadow.",
    story:
      "Study in Charcoal was made during a burst of experimentation with compressed charcoal and rougher paper. The face is drawn big, with the confidence of a study rather than the caution of a finished portrait. Streaked shadows and lifted highlights give it the energy of a work still warm from the hand.",
    status: "Available",
  },
  {
    id: "between-light-and-dark",
    title: "Between Light and Dark",
    categories: ["originals", "graphite"],
    medium: "Graphite on paper",
    year: 2025,
    dimensions: "24 × 30 cm",
    image: images.betweenLightAndDark,
    imageAlt: "A graphite portrait crossing the boundary of light and shadow",
    description:
      "A portrait drawn across the boundary where light turns to shadow.",
    story:
      "This portrait plays with the single most dramatic edge in drawing — the terminator where light gives way to dark. Half the face is drawn with precision; the other half dissolves into suggestion. It is a piece about identity, memory, and the half of us that is always in shadow.",
    status: "Available",
  },
  {
    id: "borrowed-time",
    title: "Borrowed Time",
    categories: ["portraits", "charcoal", "custom"],
    medium: "Charcoal on paper",
    year: 2025,
    dimensions: "40 × 50 cm",
    image: images.borrowedTime,
    imageAlt: "A charcoal portrait of a man drawn with soft and hard edges",
    description:
      "A custom portrait of a grandfather, drawn from a photograph taken in 1987.",
    story:
      "Borrowed Time was a commission for a granddaughter who had only ever known her grandfather through stories and one grainy Kodachrome slide. The drawing restores the sharpness the photograph lost: the crisp collar, the proud tilt of the head. Working from damaged reference material, the artist rebuilt every value by hand — a restoration more than a copy.",
    status: "Commissioned",
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