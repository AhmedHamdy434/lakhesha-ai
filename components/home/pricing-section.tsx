import { cn } from "@/lib/utils";
import {
  containerVariants,
  itemVariants,
  listVariants,
  pricePlans,
  PricingPlan,
} from "@/utils/constants";
import { ArrowLeft, CheckIcon } from "lucide-react";
import Link from "next/link";
import { MotionDiv, MotionSection } from "../common/motion-wrapper";

const PricingSection = () => {
  return (
    <MotionSection
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="relative overflow-hidden"
      id="pricing"
    >
      <div className="py-12 lg:py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 lg:pt-12">
        <MotionDiv
          variants={itemVariants}
          className="flex items-center justify-center w-full pb-12"
        >
          <h2 className="uppercase font-bold text-xl mb-8 text-rose-500">
            الأسعار
          </h2>
        </MotionDiv>
        <div className="relative flex justify-center flex-col lg:flex-row items-center lg:items-stretch gap-8">
          {pricePlans.map((plan) => (
            <PricingCard key={plan.id} {...plan} />
          ))}
        </div>
      </div>
    </MotionSection>
  );
};
export default PricingSection;

const PricingCard = ({
  id,
  name,
  price,
  description,
  features,
  paymentLink,
}: PricingPlan) => {
  return (
    <MotionDiv
      variants={listVariants}
      whileHover={{ scale: 1.02 }}
      className="relative w-full max-w-lg hover:scale-105 hover:transition-all duration-300"
    >
      <div
        className={cn(
          "relative flex flex-col h-full gap-4 lg:gap-8 z-10 p-8 border border-gray-500/20 rounded-2xl",
          id === "pro" && "border-rose-500 gap-5 border-2"
        )}
      >
        <MotionDiv
          variants={listVariants}
          className="flex justify-between items-center gap-4"
        >
          <div>
            <p className="text-lg lg:text-xl font-bold capitalize">{name}</p>
            <p className="text-base-content/80 mt-2">{description}</p>
          </div>
        </MotionDiv>
        <div className="flex gap-2">
          <p className="text-5xl tracking-tight font-extrabold">${price}</p>
          <div className="flex flex-col justify-end mb-[4px]">
            <p className="text-xs uppercase font-semibold">دولار</p>
            <p className="text-xs">/شهر</p>
          </div>
        </div>
        <MotionDiv
          variants={listVariants}
          className="space-y-2.5 leading-relaxed text-base flex-1"
        >
          {features.map((feature, i) => (
            <li key={i} className="flex items-center gap-2">
              <CheckIcon size={18} />
              <span>{feature}</span>
            </li>
          ))}
        </MotionDiv>
        <MotionDiv
          variants={listVariants}
          className="space-y-2 flex justify-center w-full"
        >
          <Link
            className={cn(
              "w-full rounded-full flex items-center justify-center gap-2 bg-linear-to-r hover:from-rose-500 hover:to-rose-800 text-white border-2 py-2 border-rose-100 from-rose-400 to-rose-500",
              id === "pro"
                ? "border-rose-900"
                : "border-rose-100 from-rose-400 to-rose-500"
            )}
            href={paymentLink}
          >
            اشترك الآن <ArrowLeft size={18} />
          </Link>
        </MotionDiv>
      </div>
    </MotionDiv>
  );
};
