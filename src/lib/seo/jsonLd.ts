import type { SiteContact, SiteProject } from "@/lib/content/site-data";
import {
  SITE_ALTERNATE_NAMES,
  SITE_DESCRIPTION,
  SITE_HEADLINE,
  SITE_JOB_TITLE,
  SITE_NAME,
  SITE_NICKNAME,
  SITE_OG_IMAGE,
  SITE_URL,
  SOCIAL_PROFILES,
  absoluteUrl,
} from "./site";

const PERSON_ID = `${SITE_URL}/#person`;
const WEBSITE_ID = `${SITE_URL}/#website`;
const PROFILE_PAGE_ID = `${SITE_URL}/#profile`;

interface BuildGraphArgs {
  projects: SiteProject[];
  contact: SiteContact;
}

function projectId(project: SiteProject) {
  return `${SITE_URL}/#project-${project.id ?? project.name}`;
}

function buildPerson(contact: SiteContact) {
  const sameAs = Array.from(
    new Set(
      [
        contact.socials?.github || SOCIAL_PROFILES.github,
        contact.socials?.linkedin || SOCIAL_PROFILES.linkedin,
        contact.socials?.twitter || SOCIAL_PROFILES.twitter,
        "https://github.com/monojitgoswami69",
        "https://linkedin.com/in/monojitgoswami69",
        "https://twitter.com/monojitgoswami9",
        "https://x.com/monojitgoswami9",
      ].filter(Boolean)
    )
  );

  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: SITE_NAME,
    givenName: "Monojit",
    familyName: "Goswami",
    additionalName: SITE_NICKNAME,
    alternateName: SITE_ALTERNATE_NAMES,
    disambiguatingDescription:
      "Monojit Goswami (also known as MG or monojitgoswami69) is a Backend and AIML Engineer specializing in production-grade RAG systems, agentic AI architectures, and high-performance ML pipelines.",
    url: SITE_URL,
    image: absoluteUrl("/assets/profile.webp"),
    jobTitle: SITE_JOB_TITLE,
    description: SITE_HEADLINE,
    email: contact.email ? `mailto:${contact.email}` : undefined,
    sameAs,
    hasOccupation: {
      "@type": "Occupation",
      name: "Backend & AI Engineer",
      occupationalCategory: "15-1252.00",
      skills: [
        "Retrieval-Augmented Generation",
        "Agentic AI",
        "Large Language Models",
        "Backend Engineering",
        "Python",
        "FastAPI",
        "Vector Databases",
        "Machine Learning Pipelines",
        "Full-Stack Development",
      ].join(", "),
    },
    knowsAbout: [
      "Retrieval-Augmented Generation (RAG)",
      "Agentic AI Workflows",
      "Large Language Models (LLMs)",
      "Backend Architecture",
      "Python",
      "FastAPI",
      "Vector Databases (Pinecone, ChromaDB)",
      "Machine Learning Pipelines",
      "Redis",
      "Supabase",
      "PostgreSQL",
      "Next.js",
      "TypeScript",
      "React",
      "REST APIs & SSE",
    ],
  };
}

function buildWebsite() {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    name: `${SITE_NAME} (${SITE_NICKNAME}) — Portfolio`,
    alternateName: ["mgbuilds.in", "Monojit Goswami Portfolio", "MG Portfolio"],
    description: SITE_DESCRIPTION,
    inLanguage: "en",
    publisher: { "@id": PERSON_ID },
    author: { "@id": PERSON_ID },
  };
}

function buildProfilePage(projects: SiteProject[]) {
  return {
    "@type": "ProfilePage",
    "@id": PROFILE_PAGE_ID,
    url: SITE_URL,
    name: `${SITE_NAME} (${SITE_NICKNAME}) | Backend & AI Engineer Portfolio`,
    description: SITE_DESCRIPTION,
    inLanguage: "en",
    isPartOf: { "@id": WEBSITE_ID },
    primaryImageOfPage: SITE_OG_IMAGE,
    mainEntity: { "@id": PERSON_ID },
    about: { "@id": PERSON_ID },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: SITE_URL,
        },
      ],
    },
    hasPart: projects
      .filter((project) => project.visible !== false)
      .map((project) => ({ "@id": projectId(project) })),
  };
}

function buildSoftwareApplications(projects: SiteProject[]) {
  return projects
    .filter((project) => project.visible !== false)
    .map((project) => {
      const node: Record<string, unknown> = {
        "@type": "SoftwareApplication",
        "@id": projectId(project),
        name: project.name,
        description: project.longDescription || project.description,
        applicationCategory: project.category || "WebApplication",
        operatingSystem: "Web",
        image: absoluteUrl(project.imageUrl),
        author: { "@id": PERSON_ID },
        creator: { "@id": PERSON_ID },
        keywords: project.techStack?.join(", "),
      };

      if (project.demoUrl) node.url = project.demoUrl;
      if (project.githubUrl) node.codeRepository = project.githubUrl;
      if (project.featured) node.award = "Featured Project by Monojit Goswami";

      const offers = project.demoUrl
        ? {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
            availability: "https://schema.org/InStock",
          }
        : undefined;
      if (offers) node.offers = offers;

      return node;
    });
}

export function buildSiteJsonLd({ projects, contact }: BuildGraphArgs) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      buildPerson(contact),
      buildWebsite(),
      buildProfilePage(projects),
      ...buildSoftwareApplications(projects),
    ],
  };
}

