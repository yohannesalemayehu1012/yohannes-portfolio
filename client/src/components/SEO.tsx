import { useEffect } from "react";

interface SEOProps {
  title?: string;
  description?: string;
}

export default function SEO({
  title = "Yohannes Alemayehu | Software Developer",
  description = "Explore my software development projects, technical skills, and experience.",
}: SEOProps) {
  useEffect(() => {
    document.title = title;

    function updateMeta(
      name: string,
      content: string,
      attribute = "name",
    ) {
      let element = document.querySelector<HTMLMetaElement>(
        `meta[${attribute}="${name}"]`,
      );

      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }

      element.content = content;
    }

    updateMeta("description", description);
    updateMeta("og:title", title, "property");
    updateMeta("og:description", description, "property");
    updateMeta("twitter:title", title);
    updateMeta("twitter:description", description);

    let canonical = document.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]',
    );

    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }

    canonical.href = window.location.href.split("?")[0];
  }, [title, description]);

  return null;
}