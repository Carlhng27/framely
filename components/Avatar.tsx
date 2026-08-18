export default function Avatar({
  name,
  color,
  size = 36,
}: {
  name: string;
  color: string;
  size?: number;
}) {
  const initial = name.trim().charAt(0).toUpperCase();
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-full font-display font-semibold text-cream"
      style={{ backgroundColor: color, width: size, height: size, fontSize: size * 0.42 }}
      aria-hidden="true"
    >
      {initial}
    </span>
  );
}
