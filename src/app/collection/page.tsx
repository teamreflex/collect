import { PartyPopper } from "lucide-react";

export const metadata = {
  title: 'Collection',
}

export default function Page() {
  return (
    <div className="flex mt-6 items-center justify-center">
      <PartyPopper />
    </div>
  );
}

export const runtime = "edge";
