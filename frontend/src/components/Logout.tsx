"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Handles the logout process by clearing authentication cookies
 * and redirecting the user to the login page.
 */
export async function Logout() {
  const cookieStore = cookies();

  cookieStore.delete("token");
  cookieStore.delete("email");
  cookieStore.delete("userId");

  redirect("/auth/login");
}
