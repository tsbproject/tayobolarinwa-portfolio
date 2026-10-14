import Image from "next/image";

export default function HeroImage() {
  return (
    <div className="relative flex justify-center lg:justify-end">
      <div aria-hidden="true" className="pointer-events-none absolute -left-8 top-12 h-48 w-48 rounded-full bg-blue-300/55 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute bottom-8 right-0 h-64 w-64 rounded-full bg-slate-300/65 blur-3xl" />

      <div className="relative overflow-hidden rounded-[36px] border border-blue-100 bg-slate-100 shadow-2xl shadow-blue-900/15 ring-1 ring-white/80">
        <Image
          src="/images/my-photo2.png"
          alt="Tayo Bolarinwa"
          width={430}
          height={560}
          priority
          className="h-auto w-full max-w-[430px] object-cover"
        />
      </div>
    </div>
  );
}
