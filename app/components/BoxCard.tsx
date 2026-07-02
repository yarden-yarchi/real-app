import Image from "next/image";
import Link from "next/link";

type Box = {
  id: string;
  title: string;
  description: string | null;
  gallery_images: string[] | null;
};

export default function BoxCard({ box }: { box: Box }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg bg-white pb-5">
      <div className="relative aspect-[254/297] w-full bg-pink-light">
        {box.gallery_images?.[0] && (
          <Image
            src={box.gallery_images[0]}
            alt={box.title}
            fill
            className="object-cover"
            unoptimized
          />
        )}
      </div>
      <div className="flex flex-col gap-2 px-5 pt-2.5">
        <h3 className="text-xl font-bold text-[#3d3238]">{box.title}</h3>
        {box.description && (
          <p className="line-clamp-1 text-lg text-[#3d3238]">{box.description}</p>
        )}
        <Link
          href={`/boxes/${box.id}`}
          className="mt-1.5 inline-flex w-fit items-center rounded-[4px] bg-brick px-5 py-1.5 font-bold text-white transition-transform duration-150 hover:scale-95 hover:opacity-90"
        >
          לפרטים
        </Link>
      </div>
    </div>
  );
}
