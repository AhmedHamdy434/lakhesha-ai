"use client";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface NavigationControlsProps {
  currentSection: number;
  totalSections: number;
  onPrevious: () => void;
  onNext: () => void;
  onSectionSelect: (index: number) => void;
}
export default function NavigationControls({
  currentSection,
  totalSections,
  onPrevious,
  onNext,
  onSectionSelect,
}: NavigationControlsProps) {
  return (
    <div className="absolute bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-xs border-t border-rose-500/10">
      <div className="flex justify-between items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={onPrevious}
          disabled={currentSection === 0}
          aria-label="القسم السابق"
          className={cn(
            "rounded-full size-12 transition-all duration-200 bg-linear-to-br from-rose-500 to-rose-600 backdrop-blur-xs border border-rose-500/10 hover:text-white",
            currentSection === 0 && "opacity-50 hover:bg-rose-500/20"
          )}
        >
          <ChevronRight className="size-6 text-white" aria-hidden="true" />
        </Button>

        <div className="flex gap-2">
          {Array.from({ length: totalSections }, (_, index) => (
            <button
              key={index}
              onClick={() => onSectionSelect(index)}
              aria-label={`انتقال إلى القسم ${index + 1}`}
              className={cn(
                "size-2 rounded-full transition-all duration-300",
                currentSection === index
                  ? "bg-linear-to-r from-rose-500 to-rose-600"
                  : "bg-rose-500/40 hover:bg-rose-500/60"
              )}
            >
            </button>

          ))}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onNext}
          disabled={currentSection === totalSections - 1}
          aria-label="القسم التالي"
          className={cn(
            "rounded-full size-12 transition-all duration-200 bg-linear-to-br from-rose-500 to-rose-600 backdrop-blur-xs border border-rose-500/10 hover:text-white",
            currentSection === totalSections - 1 && "opacity-50 hover:bg-rose-500/20"
          )}
        >
          <ChevronLeft className="size-6 text-white" aria-hidden="true" />
        </Button>

      </div>
    </div>
  );
}
