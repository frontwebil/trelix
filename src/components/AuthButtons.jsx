import Link from "next/link";
import { usePathname } from "next/navigation";

export function AuthButtons() {
  const pathname = usePathname();
  const activeStyles =
    "bg-gradient-to-r from-blue-500 to-purple-600 text-white";
  return (
    <div className="flex gap-2.5 mb-8">
      <Link
        href={"/"}
        className={`border border-purple-600 w-full p-2 rounded-lg text-center ${
          pathname == "/" ? activeStyles : "text-white"
        }`}
      >
        Login
      </Link>
      <Link
        href={"/auth/signup"}
        className={`border border-purple-600 w-full p-2 rounded-lg text-center ${
          pathname == "/auth/signup" ? activeStyles : "text-white"
        }`}
      >
        Register
      </Link>
    </div>
  );
}
