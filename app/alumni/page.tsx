import { alumni } from "@/lib/data";
import Directory from "@/components/Directory";

export default function AlumniPage() {
  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-westmont-navy">Alumni</h1>
        <p className="mt-1 text-sm text-westmont-blue/70">
          CATLab grads out in the world. Click a card to see what they can help
          with and reach out directly.
        </p>
      </header>
      <Directory people={alumni} kind="alumni" />
    </div>
  );
}
