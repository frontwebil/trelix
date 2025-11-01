"use client";

import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";

export function SetupProfile() {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [imagePreview, setImagePreview] = useState<null | string>(null);
  const [image, setImage] = useState<null | File>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setImage(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading) return;

    // client side validation
    if (!name || !bio || !image) {
      toast("Please fill in all fields and select an avatar.", {
        style: {
          background: "#9810fa",
          color: "white",
        },
      });
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("bio", bio);
      formData.append("avatar", image as File);

      await axios.post("/api/auth/setup-profile", formData);
      toast("Profile updated succesfully", {
        style: {
          background: "#9810fa",
          color: "white",
        },
      });
      router.replace("/chat");
    } catch (error) {
      console.log(error);
      toast("Something went wrong", {
        style: {
          background: "#9810fa",
          color: "white",
        },
      });
    }
    setLoading(false);
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <div className="max-w-[350px] w-[95%]">
        <Image
          src="/logo.png"
          alt="TreliX"
          width={200}
          height={200}
          className="object-contain mx-auto"
          priority
        />
        <h2 className="text-center text-3xl font-bold mb-6 text-gray-300">
          Setup Profile
        </h2>
        <div className="py-3 rounded-lg shadow-md">
          <div className="flex justify-center">
            {imagePreview && (
              <Image
                src={imagePreview}
                alt="uploaded-image"
                width={1000}
                height={1000}
                className="h-35 w-35 rounded-full object-cover"
              />
            )}
          </div>
          <form onSubmit={handleSubmit}>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="Name"
              className="w-full px-4 py-3
              placeholder-gray-300 bg-input-bg rounded-lg outline-none text-gray-100 my-3"
            />
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Bio"
              className="w-full px-4 py-3
              placeholder-gray-300 resize-none bg-input-bg rounded-lg outline-none text-gray-100 my-3"
            />
            <label className="text-gray-400">Profile Picture</label>
            <input
              onChange={handleImage}
              type="file"
              className="w-full px-4 py-3
              placeholder-gray-300 bg-input-bg rounded-lg outline-none text-gray-100 my-3"
            />
            <button
              className="w-full bg-gradient-to-r
             from-blue-500 to-purple-600 my-2 py-2
              text-white rounded-lg cursor-pointer
              hover:from-blue-600 transition"
            >
              {loading ? "Updating Profile" : "Continue"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
