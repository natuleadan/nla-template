"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { ContactForm } from "@/components/forms/contact-form";
import {
  IconMapPin,
  IconPhone,
  IconMail,
  IconBrandWhatsapp,
} from "@tabler/icons-react";
import { ui, pages } from "@/lib/config/site";
import { ContactPageSkeleton } from "@/components/layout/contact-page-skeleton";

type Block =
  | { type: "header"; title: string }
  | { type: "paragraph"; text: string }
  | { type: "heading"; title: string }
  | { type: "list"; items: string[] }
  | { type: "info"; icon: string; label: string; value: string }
  | { type: "form" };

interface PageData {
  title: string;
  description?: string;
  content: Block[];
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  map: IconMapPin,
  phone: IconPhone,
  mail: IconMail,
  whatsapp: IconBrandWhatsapp,
};

function renderBlock(block: Block, index: number) {
  switch (block.type) {
    case "header":
      return (
        <h2 key={index} className="text-xl font-semibold mt-8 mb-4">
          {block.title}
        </h2>
      );
    case "paragraph":
      return (
        <p key={index} className="text-muted-foreground leading-relaxed">
          {block.text}
        </p>
      );
    case "heading":
      return (
        <h3 key={index} className="text-xl font-semibold mt-8 mb-4">
          {block.title}
        </h3>
      );
    case "list":
      return (
        <ul key={index} className="list-disc pl-6 space-y-2">
          {block.items.map((item, i) => (
            <li key={i} className="leading-relaxed">
              {item}
            </li>
          ))}
        </ul>
      );
    case "info": {
      const IconComp = iconMap[block.icon];
      return (
        <div key={index} className="flex items-start gap-4 py-3">
          {IconComp && <IconComp className="size-5 mt-1 text-primary" />}
          <div>
            <p className="font-medium">{block.label}</p>
            <p className="text-sm text-muted-foreground">{block.value}</p>
          </div>
        </div>
      );
    }
    case "form":
      return (
        <div key={index} className="mt-4">
          <ContactForm />
        </div>
      );
    default:
      return null;
  }
}

export function DynamicPage({ pageName }: { pageName: string }) {
  const [data, setData] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/v1/pages?page=${pageName}`)
      .then((res) => res.json())
      .then((data) => setData(data))
      .finally(() => setLoading(false));
  }, [pageName]);

  if (loading) {
    if (pageName === "contacto") return <ContactPageSkeleton />;
    return (
      <div className="p-8 text-center text-muted-foreground">{ui.loading}</div>
    );
  }

  if (!data) {
    return (
      <div className="p-8 text-center text-muted-foreground">{ui.notFound}</div>
    );
  }

  const isTwoColumns = pageName === "contacto";

  if (isTwoColumns) {
    const findSectionIndex = (title: string) =>
      data.content.findIndex((b) => b.type === "header" && b.title === title);

    const findFormIndex = () =>
      data.content.findIndex((b) => b.type === "form");

    const encuenIndex = findSectionIndex(pages.contacto.findUs);
    const escribIndex = findSectionIndex(pages.contacto.writeUs);
    const formIndex = findFormIndex();

    const leftContent = data.content.slice(encuenIndex, escribIndex);
    const rightContent = data.content.slice(
      escribIndex,
      formIndex > 0 ? formIndex + 1 : data.content.length,
    );

    return (
      <div className="px-4 md:px-6 lg:px-8 max-w-7xl mx-auto w-full py-8">
        <PageHeader title={data.title} description={data.description} />

        <div className="grid gap-12 md:grid-cols-2">
          <div className="space-y-4">
            {leftContent.map((block, i) => renderBlock(block, i))}
          </div>
          <div className="space-y-4">
            {rightContent.map((block, i) => renderBlock(block, i))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-6 lg:px-8 max-w-7xl mx-auto w-full py-8">
      <PageHeader title={data.title} description={data.description} />
      <div className="space-y-6">
        {data.content.map((block, index) => renderBlock(block, index))}
      </div>
    </div>
  );
}
