import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-void/90">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 sm:flex-row sm:items-end sm:justify-between sm:px-6">
        <div>
          <p className="font-display text-sm font-semibold tracking-[0.16em] text-white/90">
            VIBECODECITY
          </p>
          <p className="mt-2 max-w-md text-sm text-white/55">
            An immersive academy for creative AI literacy. Built by Ocelot Claw Studios.
          </p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-white/55">
          <Link href="/orientation" className="hover:text-cyan">
            Orientation
          </Link>
          <Link href="/learn/what-it-is" className="hover:text-cyan">
            Learn
          </Link>
          <Link href="/practice" className="hover:text-cyan">
            Practice
          </Link>
          <Link href="/field" className="hover:text-cyan">
            Tuning Field
          </Link>
          <Link href="/notes" className="hover:text-cyan">
            Notes
          </Link>
        </div>
      </div>
      <div className="border-t border-white/5 px-4 py-4 text-center text-xs text-white/40 sm:px-6">
        © VibeCodeCity
      </div>
    </footer>
  );
}
