"use client";

import { signOut } from "next-auth/react";

export function LogoutButton() {
  return (
    <button
      className="bg-gradient-to-r from-blue-500
  to-purple-600
    w-[80%] py-3 rounded-full text-white
    cursor-pointer mx-auto"
      onClick={() => signOut({ callbackUrl: "/" })}
    >
      Logout
    </button>
  );
}
