import Image from "next/image";

export default function HeroImage() {
  return (
    <div className="relative flex justify-center lg:justify-end">
      <div className="absolute -left-8 top-12 h-40 w-40 rounded-full bg-blue-100 blur-3xl" />
      <div className="absolute bottom-12 right-0 h-56 w-56 rounded-full bg-slate-200 blur-3xl" />

      <div className="relative overflow-hidden rounded-[36px] border border-slate-200 bg-slate-100 shadow-xl">
        <Image
          src="/images/my-photo2.png"
          alt="Tayo Bolarinwa"
          width={430}
          height={560}
          priority
          className="h-[560px] w-[430px] object-cover"
        />
      </div>
    </div>
  );
}