export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mgbuilds.in";

export const SITE_NAME = "Monojit Goswami";
export const SITE_NICKNAME = "MG";

export const SITE_TAGLINE = "Backend & AI Engineer";

export const SITE_HEADLINE =
  "AIML & Backend Engineer specializing in production-grade RAG systems, agentic AI, and high-performance ML pipelines.";

export const SITE_DESCRIPTION =
  "Official portfolio of Monojit Goswami (MG) — Backend and AIML Engineer specializing in production-grade RAG systems, agentic AI, and high-performance ML pipelines built with Python, FastAPI, and modern LLM stacks.";

export const SITE_TITLE_DEFAULT = `${SITE_NAME} (${SITE_NICKNAME}) | Backend & AI Engineer Portfolio`;
export const SITE_TITLE_TEMPLATE = `%s | ${SITE_NAME} (${SITE_NICKNAME})`;

export const SITE_KEYWORDS = [
  "Monojit Goswami",
  "Monojit",
  "MG",
  "monojitgoswami",
  "monojitgoswami69",
  "monojitgoswami9",
  "Monojit Goswami Portfolio",
  "Monojit Goswami Developer",
  "Monojit Goswami Backend",
  "Monojit Goswami AI",
  "mgbuilds",
  "mgbuilds.in",
  "Backend Developer",
  "AI Engineer",
  "AIML Engineer",
  "RAG Systems",
  "Agentic AI",
  "FastAPI Developer",
  "Python Backend Developer",
  "Machine Learning Engineer",
  "Full Stack Developer",
];

export const SITE_ALTERNATE_NAMES = [
  "Monojit",
  "MG",
  "monojitgoswami",
  "monojitgoswami69",
  "monojitgoswami9",
  "Monojit Goswami (MG)",
];

export const SITE_JOB_TITLE = "Backend & AIML Engineer";

export const SITE_OG_IMAGE = `${SITE_URL}/og_image/og-image.png`;
export const SITE_OG_IMAGE_TYPE = "image/png";
export const SITE_OG_IMAGE_WIDTH = 1200;
export const SITE_OG_IMAGE_HEIGHT = 630;
export const SITE_OG_IMAGE_ALT = `${SITE_NAME} (${SITE_NICKNAME}) - ${SITE_TAGLINE}`;

export const SOCIAL_PROFILES = {
  github: "https://github.com/monojitgoswami69",
  linkedin: "https://linkedin.com/in/monojitgoswami69",
  twitter: "https://twitter.com/monojitgoswami9",
};

export const TWITTER_HANDLE = "@monojitgoswami9";

export function absoluteUrl(path: string) {
  if (!path) return SITE_URL;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

