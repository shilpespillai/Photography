export default function Footer() {
  return (
    <footer className="border-t border-[var(--line)] px-6 py-10 md:px-12">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <p className="frame-label text-paper/50">
          © {new Date().getFullYear()} Marigold &amp; Frame Photography
        </p>
        <p className="frame-label text-paper/50">
          Birthdays · Maternity · Events
        </p>
      </div>
    </footer>
  );
}
