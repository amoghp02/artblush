import type { Metadata } from "next";
import { requireUser } from "@/lib/auth/session";
import ProfileForm from "./ProfileForm";

export const metadata: Metadata = {
  title: "Your profile — ArtBlush",
  description: "Update your ArtBlush account details.",
};

export default async function ProfilePage() {
  const user = await requireUser("/account");

  return (
    <div className="max-w-md">
      <h2 className="text-[11px] font-medium uppercase tracking-[0.28em] text-foreground/45">
        Profile details
      </h2>
      <p className="mt-4 text-sm leading-relaxed text-foreground/60">
        Your email is your login and cannot be changed here.
      </p>
      <ProfileForm
        user={{ name: user.name, email: user.email, phone: user.phone ?? "" }}
      />
    </div>
  );
}