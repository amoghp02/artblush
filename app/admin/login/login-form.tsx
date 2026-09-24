"use client";

import { useActionState } from "react";
import { login } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AdminLoginForm({ next }: { next: string }) {
  const [state, formAction, pending] = useActionState(login, { error: null });

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="next" value={next} />

      <div className="space-y-1.5">
        <Label htmlFor="email" className="text-xs text-zinc-400">
          Email
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@artblush.in"
          className="h-10 border-zinc-800 bg-zinc-900 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-zinc-500"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="password" className="text-xs text-zinc-400">
          Password
        </Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="h-10 border-zinc-800 bg-zinc-900 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-zinc-500"
        />
      </div>

      {state.error && (
        <p
          role="alert"
          className="rounded-md border border-red-900 bg-red-950/40 px-3 py-2.5 text-sm text-red-300"
        >
          {state.error}
        </p>
      )}

      <Button
        type="submit"
        disabled={pending}
        className="h-10 w-full"
      >
        {pending ? "Signing in…" : "Sign in"}
      </Button>

      <p className="text-xs text-zinc-600">
        Shopping? Head back to the{" "}
        <a href="https://www.artblush.in" className="text-zinc-400 underline underline-offset-2 hover:text-zinc-200">
          public site
        </a>
        .
      </p>
    </form>
  );
}