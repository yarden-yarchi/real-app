"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { Reorder, useDragControls } from "framer-motion";
import { deleteBox, reorderBoxes } from "../actions";
import DeleteButton from "./DeleteButton";

export type Box = {
  id: string;
  title: string;
  description: string | null;
  gallery_images: string[] | null;
};

function DragHandle({ onPointerDown }: { onPointerDown: (e: React.PointerEvent) => void }) {
  return (
    <button
      type="button"
      aria-label="גרירה לשינוי הסדר"
      onPointerDown={onPointerDown}
      className="shrink-0 cursor-grab touch-none px-1 text-purple/40 hover:text-purple active:cursor-grabbing"
    >
      <svg width="10" height="16" viewBox="0 0 10 16" fill="currentColor" aria-hidden="true">
        <circle cx="2" cy="2" r="1.5" />
        <circle cx="8" cy="2" r="1.5" />
        <circle cx="2" cy="8" r="1.5" />
        <circle cx="8" cy="8" r="1.5" />
        <circle cx="2" cy="14" r="1.5" />
        <circle cx="8" cy="14" r="1.5" />
      </svg>
    </button>
  );
}

function BoxRow({ box, onDragEnd }: { box: Box; onDragEnd: () => void }) {
  const controls = useDragControls();

  return (
    <Reorder.Item
      value={box}
      dragListener={false}
      dragControls={controls}
      onDragEnd={onDragEnd}
      className="flex items-center gap-3 overflow-hidden rounded-lg bg-white p-3"
    >
      <DragHandle onPointerDown={(e) => controls.start(e)} />
      <div className="relative aspect-[254/160] h-24 w-36 shrink-0 overflow-hidden rounded-lg bg-pink-light">
        {box.gallery_images?.[0] && (
          <Image src={box.gallery_images[0]} alt={box.title} fill className="object-cover" />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1">
        <h3 className="text-lg font-bold text-purple">{box.title}</h3>
        {box.description && (
          <p className="line-clamp-2 text-sm text-foreground/70">{box.description}</p>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <Link
          href={`/real-admin/boxes/${box.id}`}
          className="rounded-[4px] bg-purple px-4 py-1.5 text-sm font-bold text-white transition-transform duration-150 hover:scale-95 hover:opacity-90"
        >
          עריכה
        </Link>
        <DeleteButton
          action={deleteBox.bind(null, box.id)}
          confirmText={`למחוק את הקופסה "${box.title}"? היא תוסר מהאתר מיד ופעולה זו אינה הפיכה.`}
        />
      </div>
    </Reorder.Item>
  );
}

export default function BoxManager({ boxes }: { boxes: Box[] }) {
  const [items, setItems] = useState(boxes);
  const [prevBoxes, setPrevBoxes] = useState(boxes);
  const [, startTransition] = useTransition();

  // Server revalidation (add/edit/delete) refreshes the prop — sync it into local order state.
  if (boxes !== prevBoxes) {
    setPrevBoxes(boxes);
    setItems(boxes);
  }

  const persistOrder = () => {
    startTransition(async () => {
      await reorderBoxes(items.map((b) => b.id));
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-purple">{items.length} קופסאות</h2>
        <Link
          href="/real-admin/boxes/new"
          className="rounded-[4px] bg-purple px-5 py-2 font-bold text-white transition-transform duration-150 hover:scale-95 hover:opacity-90"
        >
          + קופסה חדשה
        </Link>
      </div>

      <Reorder.Group axis="y" values={items} onReorder={setItems} className="flex flex-col gap-4">
        {items.map((box) => (
          <BoxRow key={box.id} box={box} onDragEnd={persistOrder} />
        ))}
      </Reorder.Group>

      {items.length === 0 && (
        <p className="text-center text-foreground/60">אין עדיין קופסאות — הוסיפו את הראשונה!</p>
      )}
    </div>
  );
}
