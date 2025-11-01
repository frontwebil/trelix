"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BsEye } from "react-icons/bs";
import { FiEyeOff } from "react-icons/fi";
import { toast } from "react-toastify";
import { AuthButtons } from "../components/AuthButtons";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);

    if (!email || !password) {
      toast("All fields are required", {
        style: {
          background: "#9810fa",
          color: "white",
        },
      });
      setLoading(false);
      return;
    }

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      toast("Invalid Credentials", {
        style: {
          background: "#9810fa",
          color: "white",
        },
      });
    } else {
      toast("Sign in successful", {
        style: {
          background: "#9810fa",
          color: "white",
        },
      });
      router.replace("/auth/setup-profile");
    }
    setLoading(false);
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <div className="max-w-[350px] w-[95%]">
        <div className="">
          <Image
            src="/logo.png"
            alt="TreliX"
            width={200}
            height={200}
            className="object-contain mx-auto"
            priority
          />
        </div>
        <AuthButtons />
        <h2 className="text-center text-3xl font-bold mb-2 text-gray-300">
          Sign in to your account
        </h2>
        <div className="py-6 rounded-lg shadow-md">
          <form onSubmit={handleSignIn}>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="text"
              placeholder="Email Address"
              className="w-full px-4 py-3
              placeholder-gray-300 bg-input-bg rounded-lg outline-none text-gray-100 my-3"
            />
            <div className="relative my-3">
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full px-4 py-3 placeholder-gray-300 bg-input-bg rounded-lg outline-none text-gray-100 pr-10"
                required
              />
              {password.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 cursor-pointer"
                >
                  {showPassword ? <FiEyeOff size={20} /> : <BsEye size={20} />}
                </button>
              )}
            </div>
            <button
              className="w-full bg-gradient-to-r
             from-blue-500 to-purple-600 my-2 py-2
              text-white rounded-lg cursor-pointer
              hover:from-blue-600 transition"
            >
              {loading ? "Signing..." : "Login"}
            </button>
            <div className="my-3 text-center text-white">
              <span>Forgot your password?</span>
              <Link href="/reset-password" className="ml-2 text-purple-600">
                Reset password
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
