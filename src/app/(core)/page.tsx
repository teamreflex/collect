import { Wrench } from "lucide-react";

export default function Page() {
  return (
    <div className="flex flex-col mt-6 items-center justify-center">
      <Wrench />
      <p className="text-sm">work in progress</p>
    </div>
  );
}

export const runtime = "edge";
