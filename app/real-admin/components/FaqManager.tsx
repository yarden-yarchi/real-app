"use client";

import { useState, useTransition } from "react";
import { Reorder, useDragControls } from "framer-motion";
import { saveFaq, deleteFaq, reorderFaqs } from "../actions";
import SubmitButton from "./SubmitButton";

export type Faq = {
  id: string;
  question: string;
  answer: string;
};

const inputClass =
  "rounded-[4px] border border-purple/30 bg-white px-4 py-2 outline-none focus:border-purple";

function DragHandle({ onPointerDown }: { onPointerDown: (e: React.PointerEvent) => void }) {
  return (
    <button
      type="button"
      aria-label="גרירה לשינוי הסדר"
      onPointerDown={onPointerDown}
      className="shrink-0 cursor-grab touch-none px-1 py-2 text-purple/40 hover:text-purple active:cursor-grabbing"
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

function FaqRow({
  faq,
  expanded,
  onToggle,
  onDragEnd,
}: {
  faq: Faq;
  expanded: boolean;
  onToggle: () => void;
  onDragEnd: () => void;
}) {
  const controls = useDragControls();

  return (
    <Reorder.Item
      value={faq}
      dragListener={false}
      dragControls={controls}
      onDragEnd={onDragEnd}
      className="rounded-lg bg-white"
    >
      <div className="flex items-center gap-2 px-4">
        <DragHandle onPointerDown={(e) => controls.start(e)} />
        <button
          type="button"
          onClick={onToggle}
          className="flex flex-1 items-center justify-between gap-4 py-4 text-right"
        >
          <span className="font-bold text-purple">{faq.question}</span>
          <span
            className={`shrink-0 text-2xl leading-none text-purple transition-transform ${
              expanded ? "rotate-45" : ""
            }`}
          >
            +
          </span>
        </button>
      </div>

      {expanded && (
        <div className="border-t border-purple/10 px-4 pb-4 pt-4">
          <form action={saveFaq} className="flex flex-col gap-3">
            <input type="hidden" name="id" value={faq.id} />
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-bold text-purple">שאלה</span>
              <input
                type="text"
                name="question"
                required
                defaultValue={faq.question}
                className={inputClass}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-bold text-purple">תשובה</span>
              <textarea
                name="answer"
                required
                rows={3}
                defaultValue={faq.answer}
                className={inputClass}
              />
            </label>
            <div className="flex items-center gap-2">
              <SubmitButton>שמירה</SubmitButton>
            </div>
          </form>
          <form
            action={deleteFaq.bind(null, faq.id)}
            onSubmit={(e) => {
              if (!confirm(`למחוק את השאלה "${faq.question}"? היא תוסר מהאתר מיד.`))
                e.preventDefault();
            }}
            className="mt-3 border-t border-purple/10 pt-3"
          >
            <button
              type="submit"
              className="rounded-[4px] border border-brick px-4 py-1.5 text-sm font-bold text-brick transition-colors hover:bg-brick hover:text-white"
            >
              מחיקת שאלה
            </button>
          </form>
        </div>
      )}
    </Reorder.Item>
  );
}

function AddFaqModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-lg bg-white p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-purple">הוספת שאלה חדשה</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="סגירה"
            className="text-2xl leading-none text-purple/60 hover:text-purple"
          >
            ×
          </button>
        </div>
        <form
          action={async (formData) => {
            await saveFaq(formData);
            onClose();
          }}
          className="mt-4 flex flex-col gap-4"
        >
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-bold text-purple">שאלה</span>
            <input type="text" name="question" required autoFocus className={inputClass} />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-bold text-purple">תשובה</span>
            <textarea name="answer" required rows={4} className={inputClass} />
          </label>
          <div className="flex justify-end">
            <SubmitButton pendingText="מוסיף...">הוספה</SubmitButton>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function FaqManager({ faqs }: { faqs: Faq[] }) {
  const [items, setItems] = useState(faqs);
  const [prevFaqs, setPrevFaqs] = useState(faqs);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [, startTransition] = useTransition();

  // Server revalidation (add/edit/delete) refreshes the prop — sync it into local order state.
  if (faqs !== prevFaqs) {
    setPrevFaqs(faqs);
    setItems(faqs);
  }

  const persistOrder = () => {
    startTransition(async () => {
      await reorderFaqs(items.map((f) => f.id));
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-purple">{items.length} שאלות באתר</h2>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="rounded-[4px] bg-purple px-5 py-2 font-bold text-white transition-transform duration-150 hover:scale-95 hover:opacity-90"
        >
          + הוספת שאלה חדשה
        </button>
      </div>

      <Reorder.Group axis="y" values={items} onReorder={setItems} className="flex flex-col gap-3">
        {items.map((faq) => (
          <FaqRow
            key={faq.id}
            faq={faq}
            expanded={expandedId === faq.id}
            onToggle={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
            onDragEnd={persistOrder}
          />
        ))}
      </Reorder.Group>

      {items.length === 0 && (
        <p className="text-center text-foreground/60">אין עדיין שאלות — הוסיפו את הראשונה!</p>
      )}

      {modalOpen && <AddFaqModal onClose={() => setModalOpen(false)} />}
    </div>
  );
}
