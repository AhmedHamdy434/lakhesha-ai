import BgGradient from "@/components/common/bg-gradient";
import UploadForm from "@/components/upload/upload-form";
import UploadHeader from "@/components/upload/upload-header";
import { hasReachedUploadLimit } from "@/lib/users";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const UploadPage = async () => {
  const user = await currentUser();
  if (!user?.id) {
    return redirect("/sign-in");
  }
  const userId = user.id;
  const { hasReachedLimit } = await hasReachedUploadLimit(user);
  if (hasReachedLimit) {
    return redirect("/dashboard");
  }
  return (
    <section className="min-h-screen">
      <BgGradient />
      <div
        className="mx-auto flex flex-col items-center gap-6 justify-center
    py-24 sm:py-32 lg:px-8 text-center"
      >
        <UploadHeader />
        <UploadForm />
      </div>
    </section>
  );
};

export default UploadPage;
