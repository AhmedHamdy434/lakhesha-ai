export type PricingPlan = {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  paymentLink: string;
  priceId: string;
};
export const pricePlans: PricingPlan[] = [
  {
    id: "basic",
    name: "أساسي",
    price: 9,
    description: "مثالي للاستخدام العرضي",
    features: [
      "5 ملخصات PDF شهريًا",
      "سرعة معالجة قياسية",
      "دعم عبر البريد الإلكتروني",
    ],
    paymentLink:
      process.env.NODE_ENV === "development"
        ? "https://buy.stripe.com/test_aFacN6eYc2wt86Dd7hf7i00"
        : "https://buy.stripe.com/test_aFacN6eYc2wt86Dd7hf7i00",
    priceId:
      process.env.NODE_ENV === "development"
        ? "price_1SnvmUIIXm7EBJzZKg5Flfoo"
        : "price_1SnvmUIIXm7EBJzZKg5Flfoo",
  },
  {
    id: "pro",
    name: "احترافي",
    price: 19,
    description: "للمحترفين والفرق",
    features: [
      "ملخصات PDF غير محدودة",
      "معالجة ذات أولوية",
      "دعم على مدار الساعة طوال أيام الأسبوع",
      "تصدير بصيغة Markdown",
    ],
    paymentLink:
      process.env.NODE_ENV === "development"
        ? "https://buy.stripe.com/test_3cI8wQ5nC1sp86D8R1f7i01"
        : "https://buy.stripe.com/test_3cI8wQ5nC1sp86D8R1f7i01",
    priceId:
      process.env.NODE_ENV === "development"
        ? "price_1SnvmUIIXm7EBJzZ8fZFYeiX"
        : "price_1SnvmUIIXm7EBJzZ8fZFYeiX",
  },
];

export const containerVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};
export const itemVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.8,

    },
  },
};
export const buttonVariants = {
  scale: 1.05,
  transition: {
    type: "spring" as const,
    stiffness: 300,
    damping: 10,
  },
};

export const listVariants = {
  hidden: {
    opacity: 0,
    x: -20,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 20,
    },
  },
};
export const DEMO_SUMMARY = `
# ملخص مستند تجريبي
● ⚡ملخص مُنشأ تلقائيًا  
● 🚀 تم الإنشاء في: 01/12/2026، 8:30 مساءً

# ملخصات ذكية ببساطة

● ✨ هذا مثال يوضح كيف يحوّل لخصها المستندات الطويلة إلى ملخصات واضحة وسهلة القراءة.  
● 📄 ارفع أي ملف PDF أو مستند واحصل على الأفكار الرئيسية في ثوانٍ.

# تفاصيل المستند
● 🗂️ النوع: مستند عام / PDF  
● 🎯 موجه إلى: الطلاب، المطورين، المحترفين، والقرّاء

# أبرز النقاط
● 🧠 النقطة الأولى: يتم اختصار المحتوى الطويل والمعقد إلى أقسام قصيرة وذات معنى  
● ⚡ النقطة الثانية: يتم إبراز الأفكار المهمة دون فقدان السياق  
● 🧩 النقطة الثالثة: الملخصات المنظمة تجعل المعلومات أسهل في التصفح والفهم

# لماذا هذا مهم؟
● 🌍 قيمة حقيقية: وفّر الوقت، قلّل الحمل الذهني، وركّز فقط على ما يهم فعلًا في أي مستند

# النقاط الرئيسية
● 💡 الفكرة الأساسية: التلخيص التلقائي يساعدك على فهم المستندات بشكل أسرع  
● 🧱 الميزة الأهم: الأقسام الواضحة، النقاط، والرموز التعبيرية تحسّن سهولة القراءة  
● 🚀 النتيجة: فهم أفضل بمجهود أقل

# نصائح احترافية
● 📌 ارفع ملاحظات المحاضرات، المقالات، أو التقارير للحصول على وضوح فوري  
● 🔍 استخدم الملخصات كمراجعة سريعة قبل القراءة المتعمقة  
● 🧠 اجمع بين الملخص والملف الأصلي لأقصى استفادة

# الخلاصة
● 🚀 يساعدك لخصها على تحويل المستندات المرهِقة إلى معرفة بسيطة وقابلة للتنفيذ — بسرعة وسهولة.

الملف الأصلي: demo-document.pdf  
تم الإنشاء بواسطة لخصها
`;

