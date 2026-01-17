import Link from "next/link";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";
import { MotionSection } from "../common/motion-wrapper";

const CtaSection = () => {
  return (
    <MotionSection className="py-12">
      <div className="py-12 lg:py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              هل أنت مستعد لتوفير ساعات من وقت القراءة؟
            </h2>
            <p className="mx-auto max-w-[700px] text-gray-500 dark:text-gray-200 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed ">
              حوّل المستندات الطويلة إلى رؤى واضحة وقابلة للتنفيذ مع ملخصنا المدعوم بالذكاء الاصطناعي.
            </p>
          </div>
          <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center">
            <div className="">
              <Button
                size="lg"
                variant="link"
                className="w-full min-[400px]:w-auto bg-linear-to-r from-slate-900 to-rose-500 hover:from-rose-500 hover:to-slate-900 hover:text-white text-white transition-all duration-300"
              >
                <Link
                  className="flex items-center justify-center"
                  href="/#pricing"
                >
                  ابدأ الآن{" "}
                  <ArrowLeft className="ml-2 size-4 animate-pulse" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MotionSection>
  );
};
export default CtaSection;
