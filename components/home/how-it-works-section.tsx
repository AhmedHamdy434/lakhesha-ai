import { BrainCircuit, FileOutput, FileText, MoveLeft } from "lucide-react";
import { MotionDiv, MotionH2, MotionH3 } from "../common/motion-wrapper";

type Step = {
  icon: React.ReactNode;
  label: string;
  description: string;
};
const steps: Step[] = [
  {
    icon: <FileText size={64} strokeWidth={1.5} />,
    label: "ارفع ملفك",
    description: "اسحب وأفلت ملف PDF أو انقر للرفع",
  },
  {
    icon: <BrainCircuit size={64} strokeWidth={1.5} />,
    label: "تحليل بالذكاء الاصطناعي",
    description: "يقوم نظام الذكاء الاصطناعي المتقدم لدينا بمعالجة مستندك وتحليله فورًا.",
  },
  {
    icon: <FileOutput size={64} strokeWidth={1.5} />,
    label: "احصل على الملخص",
    description: "احصل على الملخص في ثوانٍ باللغة العربية",
  },
];
const HowItWorksSection = () => {
  return (
    <section className="relative overflow-hidden">
      <div className="py-12 lg:py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <MotionH2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-bold text-xl uppercase mb-4 text-rose-500"
          >
            كيف يعمل
          </MotionH2>
          <MotionH3
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-bold text-3xl max-w-2xl mx-auto"
          >
            حوّل أي ملف PDF إلى ملخص سهل القراءة باللغة العربية في ثلاث خطوات بسيطة
          </MotionH3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto relative">
          {steps.map((step, index) => (
            <MotionDiv
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              key={index}
              className="relative flex items-stretch"
            >
              <StepItem {...step} />
              {index < steps.length - 1 && (
                <MotionDiv
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.2 + 0.3 }}
                  className="hidden md:block absolute top-1/2 -end-4 transform -translate-y-1/2 z-10"
                >
                  <MoveLeft
                    size={32}
                    strokeWidth={1}
                    className="text-rose-400"
                  />
                </MotionDiv>
              )}
            </MotionDiv>
          ))}
        </div>
      </div>
    </section>
  );
};
export default HowItWorksSection;

function StepItem({ icon, label, description }: Step) {
  return (
    <div className="relative p-6 rounded-2xl bg-white/5 backdrop-blur-xs border border-white/10 hover:border-rose-500/50 transition-colors group w-full">
      <div className="flex flex-col gap-4 h-full">
        <div className="flex items-center justify-center h-24 w-24 mx-auto rounded-2xl bg-linear-to-br from-rose-500/10 to-transparent group-hover:from-rose-500/20 transition-colors">
          <div className="text-rose-500">{icon}</div>
        </div>
        <div className="flex flex-col flex-1 gap-1 justify-between">
          <h4 className="text-center font-bold text-xl">{label}</h4>
          <p className="text-center text-gray-600 dark:text-gray-400 text-sm">{description}</p>
        </div>
      </div>
    </div>
  );
}
