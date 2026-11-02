
"use client";

import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";

export default function EmailSentPage() {
  const router = useRouter();

  return (
    <main className="flex flex-1 items-center justify-center p-6">
      <Button onPress={() => router.push("/")}>На главную</Button>
    </main>
  );
}
