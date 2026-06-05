import { IconSelector } from "./IconSelector";

export function UserSetupForm({
  userName,
  setUserName,
  iconId,
  setIconId,
}: {
  userName: string;
  setUserName: (name: string) => void;
  iconId: string;
  setIconId: (id: string) => void;
}) {
  return (
    <div className="ito-box flex items-end gap-2 p-2">
      <input
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        onBlur={(e) => setUserName(e.target.value.trim())}
        maxLength={12}
        className="ito-input w-full px-3 py-2 text-xl"
        placeholder="あなたの名前"
      />
      <div className="mb-1 shrink-0">
        <IconSelector selectedIcon={iconId} onSelectIcon={setIconId} />
      </div>
    </div>
  );
}
