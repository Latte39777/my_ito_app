"use client";

import { useState, useRef, useEffect } from "react";
import { AVAILABLE_ICONS } from "@/data/icon";

interface IconSelectorProps {
  selectedIcon: string;
  onSelectIcon: (iconName: string) => void;
}

export function IconSelector({
  selectedIcon,
  onSelectIcon,
}: IconSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedData =
    AVAILABLE_ICONS.find((i) => i.id === selectedIcon) || AVAILABLE_ICONS[0];
  const SelectedIcon = selectedData.Icon;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 rounded-lg p-2 transition-colors hover:bg-black/10"
      >
        <SelectedIcon size={24} className={selectedData.color} />
        <span
          className={`text-xs text-black transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        >
          ▼
        </span>
      </button>

      {isOpen && (
        <div className="ito-box absolute top-[110%] right-0 z-50 flex w-[260px] flex-col gap-4 p-5 sm:right-auto sm:left-0">
          <span className="mb-1 text-xs font-bold text-gray-500">
            アイコンを選択
          </span>

          <div
            className="grid max-h-[220px] grid-cols-5 gap-2 overflow-y-auto pr-1"
            style={{ scrollbarWidth: "thin" }}
          >
            {AVAILABLE_ICONS.map(({ id, Icon, color, label }) => {
              const isSelected = selectedIcon === id;

              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    onSelectIcon(id);
                    setIsOpen(false);
                  }}
                  title={label}
                  className={`flex aspect-square items-center justify-center rounded-xl border-2 border-black transition-all ${
                    isSelected
                      ? "scale-105 bg-black text-white shadow-[0_4px_0_0_rgba(0,0,0,0.3)]"
                      : "bg-white hover:bg-gray-100"
                  }`}
                >
                  <Icon
                    size={24}
                    className={isSelected ? "text-white" : color}
                  />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
