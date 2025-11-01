"use client";

import axios, { AxiosError } from "axios";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function ConfirmResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);

  const isValidTokenHandler = async () => {
    try {
      const res = await axios.get(`/api/is-valid-reset-token?token=${token}`);
      setIsValidToken(res.data.isValidToken);
    } catch (error) {
      console.log(error);
      setIsValidToken(false);
    }
  };

  useEffect(() => {
    isValidTokenHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ Якщо токен невалідний — редирект
  useEffect(() => {
    if (isValidToken === false) {
      toast("Invalid or expired token", {
        style: { background: "#9810fa", color: "white" },
      });
      router.replace("/");
    }
  }, [isValidToken, router]);

  const handleConfirmReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;

    if (!password || !confirmPassword)
      return toast("Please fill all fields", {
        style: { background: "#9810fa", color: "white" },
      });

    if (password !== confirmPassword)
      return toast("Passwords do not match", {
        style: { background: "#9810fa", color: "white" },
      });

    setLoading(true);

    try {
      await axios.post("/api/confirm-reset", { token, password });
      toast("Password successfully updated!", {
        style: { background: "#9810fa", color: "white" },
      });
      router.replace("/");
    } catch (error: unknown) {
      const err = error as AxiosError<{ message?: string }>;
      console.error("Error:", err);

      toast(err.response?.data?.message || "Something went wrong. Try again.", {
        style: { background: "#9810fa", color: "white" },
      });
    } finally {
      setLoading(false);
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
          Create new password
        </h2>
        <p className="text-center text-gray-400 mb-6 text-sm">
          Enter your new password below.
        </p>

        <div className="rounded-lg shadow-md">
          <form onSubmit={handleConfirmReset}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New password"
              className="w-full px-4 py-3
              placeholder-gray-300 bg-input-bg rounded-lg outline-none text-gray-100 my-3"
            />

            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              className="w-full px-4 py-3
              placeholder-gray-300 bg-input-bg rounded-lg outline-none text-gray-100 my-3"
            />

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-gradient-to-r
                from-blue-500 to-purple-600 my-2 py-2
                text-white rounded-lg transition cursor-pointer
                ${
                  loading
                    ? "opacity-70 cursor-not-allowed"
                    : "hover:from-blue-600"
                }`}
            >
              {loading ? "Updating..." : "Reset password"}
            </button>

            <div className="my-3 text-center text-white">
              <span>Back to</span>
              <Link href="/" className="ml-2 text-purple-600">
                Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
