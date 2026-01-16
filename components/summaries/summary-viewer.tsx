"use client";
import { useState } from "react";
import { Card } from "../ui/card";
import NavigationControls from "./navigation-controls";
import ProgressBar from "./progress-bar";
import { parseSection } from "@/utils/summary-helpers";
import ContentSection from "./content-section";
import { MotionDiv } from "../common/motion-wrapper";

export default function SummaryViewer({ summary }: { summary: string }) {
  const [currentSection, setCurrentSection] = useState(0);

  const sections = summary
    .split("\n#")
    .map((section) => section.trim())
    .filter(Boolean)
    .map(parseSection);

  const handlePrevious = () => {
    setCurrentSection((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentSection((prev) => Math.min(sections.length - 1, prev + 1));
  };

  return (
    <Card
      className="relative px-2 h-125 sm:h-150 lg:h-175 w-full xl:w-150 overflow-hidden
    bg-linear-to-br from-background via-background/95 to-rose-500/5 backdrop-blur-lg shadow-2xl rounded-3xl
    border border-rose-500/10"
    >
      <ProgressBar
        currentSection={currentSection}
        totalSections={sections.length}
      />
      <MotionDiv
        key={currentSection}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        exit={{ opacity: 0 }}
        className="h-full overflow-y-auto scrollbar-hide pt-12 sm:pt-16 pb-20 sm:pb-24"
      >
        <div className="px-4 sm:px-6">
          <div className="flex gap-2 flex-col sticky top-0 pt-2 pb-4 bg-background/80 backdrop-blur-xs z-10">
            <h2 className="text-3xl lg:text-4xl font-bold text-center ">
              {sections[currentSection].title || ""}
            </h2>
          </div>
          <ContentSection
            title={sections[currentSection]?.title}
            points={sections[currentSection]?.points}
          />
        </div>
        <NavigationControls
          currentSection={currentSection}
          totalSections={sections.length}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onSectionSelect={setCurrentSection}
        />
      </MotionDiv>
    </Card>
  );
}
