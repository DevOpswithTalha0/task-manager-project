import React, { useState, useEffect } from "react";
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";

export default function Notepad() {
  // Read from localStorage immediately (not inside useEffect)
  const savedNote = localStorage.getItem("notepad") || "";
  const savedFormat = JSON.parse(
    localStorage.getItem("notepadFormat") || "null"
  ) || {
    bold: false,
    italic: false,
    underline: false,
    align: "left",
  };

  const [note, setNote] = useState(savedNote);
  const [format, setFormat] = useState(savedFormat);

  // Keep note synced
  useEffect(() => {
    localStorage.setItem("notepad", note);
  }, [note]);

  // Keep format synced
  useEffect(() => {
    localStorage.setItem("notepadFormat", JSON.stringify(format));
  }, [format]);

  // Text styles
  const textStyle = {
    fontWeight: format.bold ? "bold" : "normal",
    fontStyle: format.italic ? "italic" : "normal",
    textDecoration: format.underline ? "underline" : "none",
    textAlign: format.align,
  } as React.CSSProperties;

  const AlignIcon =
    format.align === "left"
      ? AlignLeft
      : format.align === "center"
      ? AlignCenter
      : AlignRight;

  return (
    <div className="flex flex-col border border-[var(--border)] bg-[var(--cards-bg)] rounded-xl">
      <header className="border-b border-[var(--border)] px-4 py-1.5">
        <p className="text-lg font-medium">Private Notepad</p>
      </header>

      <main>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Write your notes here..."
          className="w-full h-46 resize-none rounded-lg p-4 focus:outline-none bg-transparent"
          style={textStyle}
        />
      </main>

      <footer className="flex gap-3 items-center px-4 py-1.5 border-t border-[var(--border)]">
        <button
          onClick={() => setFormat((f: any) => ({ ...f, bold: !f.bold }))}
          className={`p-2 rounded-lg hover:bg-[var(--hover-bg)] cursor-pointer ${
            format.bold ? "bg-[var(--inside-card-bg)]" : ""
          }`}
        >
          <Bold size={18} />
        </button>

        <button
          onClick={() => setFormat((f: any) => ({ ...f, italic: !f.italic }))}
          className={`p-2 rounded-lg hover:bg-[var(--hover-bg)] cursor-pointer ${
            format.italic ? "bg-[var(--inside-card-bg)]" : ""
          }`}
        >
          <Italic size={18} />
        </button>

        <button
          onClick={() =>
            setFormat((f: any) => ({ ...f, underline: !f.underline }))
          }
          className={`p-2 rounded-lg hover:bg-[var(--hover-bg)] cursor-pointer ${
            format.underline ? "bg-[var(--inside-card-bg)]" : ""
          }`}
        >
          <Underline size={18} />
        </button>

        <button
          onClick={() =>
            setFormat((f: any) => ({
              ...f,
              align:
                f.align === "left"
                  ? "center"
                  : f.align === "center"
                  ? "right"
                  : "left",
            }))
          }
          className="p-2 rounded-lg hover:bg-[var(--hover-bg)] cursor-pointer"
        >
          <AlignIcon size={18} />
        </button>
      </footer>
    </div>
  );
}
