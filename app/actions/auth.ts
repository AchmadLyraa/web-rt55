"use server";

import { signIn as nextAuthSignIn, signOut as nextAuthSignOut } from "@/auth";
import { redirect } from "next/navigation";
import { z } from "zod";

const signInSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(1, "Password wajib diisi"),
});

export async function signInAction(data: z.infer<typeof signInSchema>) {
  try {
    const validated = signInSchema.parse(data);

    console.log("[v0] Sign in attempt for:", validated.email);

    const result = await nextAuthSignIn("credentials", {
      email: validated.email,
      password: validated.password,
      redirect: false,
    });

    if (!result || result.error) {
      console.log("[v0] Sign in failed:", result?.error);
      return { success: false, error: "Email atau password salah" };
    }

    console.log("[v0] Sign in successful for:", validated.email);
    return { success: true };
  } catch (error) {
    console.error("[v0] Sign in error:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return { success: false, error: "Terjadi kesalahan saat login" };
  }
}

export async function signOutAction() {
  try {
    console.log("[v0] Sign out initiated");
    await nextAuthSignOut({ redirect: false });
    redirect("/");
  } catch (error) {
    console.error("[v0] Sign out error:", error);
    return { success: false, error: "Gagal logout" };
  }
}

