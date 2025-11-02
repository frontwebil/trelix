"use client";

import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-toastify";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPass = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading) return;
    setLoading(true);

    try {
      await axios.post("/api/reset-password", { email });

      toast("Link sended to Email", {
        style: {
          background: "#9810fa",
          color: "white",
        },
      });
    } catch (error) {
      toast("Something went wrong", {
        style: { background: "#9810fa", color: "white" },
      });
      console.log(error);
    } finally {
      setLoading(false);
      setEmail("");
    }
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <div className="max-w-[350px] w-[95%]">
        <div>
          <Image
            src="/logo.png"
            alt="TreliX"
            width={200}
            height={200}
            className="object-contain mx-auto"
            priority
          />
        </div>

        <h2 className="text-center text-3xl font-bold mb-2 text-gray-300">
          Reset your password
        </h2>
        <p className="text-center text-gray-400 mb-6 text-sm">
          Enter your email and we’ll send you a reset link.
        </p>

        <div className="rounded-lg shadow-md">
          <form onSubmit={handleResetPass}>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Email Address"
              className="w-full px-4 py-3
              placeholder-gray-300 bg-input-bg rounded-lg outline-none text-gray-100 my-3"
            />

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-gradient-to-r
    from-blue-500 to-purple-600 my-2 py-2
    text-white rounded-lg transition cursor-pointer
    ${loading ? "opacity-70 cursor-not-allowed" : "hover:from-blue-600"}`}
            >
              {loading ? "Sending..." : "Send reset link"}
            </button>
            <div className="my-3 text-center text-white">
              <span>Remembered your password?</span>
              <Link href="/" className="ml-2 text-purple-600">
                Back to login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
