export default function Footer() {
  return (
    <footer className="border-t border-slate-200 py-10">
      <div className="container text-center text-sm text-slate-500">
        © {new Date().getFullYear()} Tayo Bolarinwa. All rights reserved.
      </div>
    </footer>
  );
}