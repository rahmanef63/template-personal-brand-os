"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BLOCK_KIND_LABEL, type PageBlock } from "./types";
import { CtaForm, HeroForm, TestimonialForm, TextForm, VideoForm } from "./block-forms-simple";
import { FaqForm, FeatureListForm, LogoCloudForm, StatsForm } from "./block-forms-list";
import { ImageGalleryForm, PricingTableForm } from "./block-forms-rich";

export type BlockEditorProps = {
  block: PageBlock;
  onChange: (next: PageBlock) => void;
  onRemove?: () => void;
};

export function BlockEditor({ block, onChange, onRemove }: BlockEditorProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-sm font-semibold">{BLOCK_KIND_LABEL[block.kind]}</CardTitle>
        {onRemove && (
          <Button type="button" variant="ghost" size="sm" onClick={onRemove}>
            Remove block
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <BlockBody block={block} onChange={onChange} />
      </CardContent>
    </Card>
  );
}

function BlockBody({ block, onChange }: { block: PageBlock; onChange: (next: PageBlock) => void }) {
  switch (block.kind) {
    case "hero":
      return <HeroForm block={block} onChange={onChange} />;
    case "text":
      return <TextForm block={block} onChange={onChange} />;
    case "cta":
      return <CtaForm block={block} onChange={onChange} />;
    case "testimonial":
      return <TestimonialForm block={block} onChange={onChange} />;
    case "video":
      return <VideoForm block={block} onChange={onChange} />;
    case "feature-list":
      return <FeatureListForm block={block} onChange={onChange} />;
    case "faq":
      return <FaqForm block={block} onChange={onChange} />;
    case "stats":
      return <StatsForm block={block} onChange={onChange} />;
    case "logo-cloud":
      return <LogoCloudForm block={block} onChange={onChange} />;
    case "image-gallery":
      return <ImageGalleryForm block={block} onChange={onChange} />;
    case "pricing-table":
      return <PricingTableForm block={block} onChange={onChange} />;
  }
}
