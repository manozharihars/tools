import React from 'react';

interface FAQ {
  question: string;
  answer: string;
}

interface SeoMetaProps {
  toolName: string;
  description: string;
  url: string;
  steps: string[];
  faqs: FAQ[];
}

export default function SeoMeta({
  toolName,
  description,
  url,
  steps,
  faqs,
}: SeoMetaProps) {
  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": toolName,
    "url": url,
    "description": description,
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "All",
    "browserRequirements": "Requires HTML5 Canvas API, File API support.",
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": `How to use the ${toolName}`,
    "description": description,
    "step": steps.map((step, idx) => ({
      "@type": "HowToStep",
      "position": idx + 1,
      "text": step,
    })),
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
      },
    })),
  };

  // Convert array to unified JSON-LD script block
  const schemaPayload = [webAppSchema, howToSchema, faqSchema];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schemaPayload),
      }}
    />
  );
}
