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
        className="flex items-center gap-1 p-2 rounded-lg hover:bg-black/10 transition-colors"
      >
        <SelectedIcon size={24} className={selectedData.color} />
        <span
          className={`text-black text-xs transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        >
          ▼
        </span>
      </button>

      {isOpen && (
        <div className="absolute top-[110%] left-0 w-[260px] ito-box flex flex-col gap-4 p-5 z-10">
          <span className="text-xs font-bold text-gray-500 mb-1">
            アイコンを選択
          </span>

          <div
            className="grid grid-cols-5 gap-2 max-h-[220px] overflow-y-auto pr-1"
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
                  className={`flex items-center justify-center aspect-square rounded-xl border-2 border-black transition-all ${
                    isSelected
                      ? "bg-black text-white scale-105 shadow-[0_4px_0_0_rgba(0,0,0,0.3)]"
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
