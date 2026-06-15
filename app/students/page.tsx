import { students } from "@/lib/data";
import Directory from "@/components/Directory";

export default function StudentsPage() {
  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-westmont-navy">Students</h1>
        <p className="mt-1 text-sm text-westmont-blue/70">
          Current CATLab students. Click a card to see what they&apos;re working
          toward and connect.
        </p>
      </header>
      <Directory people={students} kind="student" />
    </div>
  );
}
