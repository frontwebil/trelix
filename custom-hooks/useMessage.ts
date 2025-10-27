import axios from "axios";
import { useEffect, useState } from "react";
import { MessageType } from "../types/types";

export async function SendMessage(text: string, receiverId: string) {
  try {
    const res = await axios.post("/api/send-message", {
      text,
      receiverId,
    });

    return res.data;
  } catch (error) {
    console.log("failed to send message:", error);
  }
}

async function fetchMessages(receiverId: string) {
  const res = await axios.get(`/api/messages/${receiverId}`);

  return res.data;
}

export function GetMessage(receiverId: string | undefined) {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState<null | Error>(null);

  useEffect(() => {
    if (!receiverId) return;

    let isMounted = true;
    setIsLoading(true);
    setIsError(null);

    fetchMessages(receiverId)
      .then((data) => {
        if (isMounted) setMessages(data);
      })
      .catch((err) => {
        if (isMounted) setIsError(err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [receiverId]);

  return { messages, isLoading, isError };
}
