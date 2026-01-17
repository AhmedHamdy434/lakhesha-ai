import { FileText } from "lucide-react";
import { Button } from "../ui/button";
import NavLink from "./nav-link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import PlanBadge from "./plan-badge";
import { ModeToggle } from "./mode-toggle";

export default function Header() {
  return (
    <header>
      <nav className="container flex justify-between items-center py-4 lg:py-8 px-2">
        <div className="flex lg:flex-1 text-gray-900">
          <NavLink
            href="/"
            className="flex text-gray-900 items-center gap-1 lg:gap-2 shrink-0"
          >
            <FileText className="size-5 lg:size-8 hover:rotate-12 transition-all duration-200 ease-in-out" />
            <span className="font-extrabold lg:text-xl"> لخصها</span>
          </NavLink>
        </div>
        <div className="flex lg:justify-center gap-4 lg:gap-12 items-center">
          <SignedIn>
            <NavLink href="/upload">رفع ملف</NavLink>
            <NavLink href="/dashboard">ملخصاتي</NavLink>
          </SignedIn>
        </div>
        <div className="flex lg:justify-end lg:flex-1">
          <SignedIn>
            <div className="flex items-center gap-2">
              <PlanBadge />
              <ModeToggle />
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </SignedIn>
          <SignedOut>
            <NavLink href="/sign-in">تسجيل الدخول</NavLink>
          </SignedOut>
        </div>
      </nav>
    </header>
  );
}
