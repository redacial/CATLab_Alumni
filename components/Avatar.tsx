export default function Avatar({
  name,
  gradient,
  size = "md",
}: {
  name: string;
  gradient: string;
  size?: "sm" | "md" | "lg";
}) {
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const dims =
    size === "lg"
      ? "h-16 w-16 text-xl"
      : size === "sm"
      ? "h-9 w-9 text-sm"
      : "h-12 w-12 text-base";

  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${gradient} font-bold text-white ${dims}`}
    >
      {initials}
    </span>
  );
}
