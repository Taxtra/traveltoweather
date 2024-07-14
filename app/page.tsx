import Image from "next/image";
import { Avatar } from "@nextui-org/react";
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 h-full">
      <div className="flex gap-3 items-center justify-center">
        <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
        <Avatar name="Junior" />
        <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026704d" />
        <Avatar name="Jane" />
        <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026702d" />
        <Avatar name="Joe" />
      </div>
    </main>
  );
}
