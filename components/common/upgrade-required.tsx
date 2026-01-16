import { ArrowRight, Sparkles } from "lucide-react";
import BgGradient from "./bg-gradient";
import { Button } from "../ui/button";
import Link from "next/link";

export default function UpgradeRequired() {
  return (
    <div className="relative min-h-[50vh]">
      <BgGradient className="from-rose-400 via-rose-300 to-orange-200" />
      <div className="container px-8 py-16">
        <div className="flex flex-col items-center gap-8 justify-center text-center max-w-2xl mx-auto">
          <div className="flex items-center gap-2 text-rose-500">
            <Sparkles className="size-6" />
            <span className="text-sm font-medium uppercase tracking-wider">
              ميزة مدفوعة
            </span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight bg-linear-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            مطلوب ترقية
          </h1>
          <p className="text-lg text-gray-600 leading-8 border-2 border-rose-200 bg-white/50 backdrop-blur-xs rounded-lg p-6 border-dashed max-w-xl">
            تحتاج إلى الترقية إلى الخطة الأساسية أو الخطة الاحترافية للوصول إلى هذه
            الميزة.
          </p>
          <Button
            asChild
            className="bg-linear-to-r from-rose-500 to-rose-700 hover:from-rose-600 hover:to-rose-800 text-white"
          >
            <Link href="/#pricing" className="flex items-center gap-2">
              عرض خطط الأسعار <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
