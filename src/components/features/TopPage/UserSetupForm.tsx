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
        className="ito-input py-2 px-3 text-xl"
        placeholder="あなたの名前"
      />
      <div className="shrink-0 mb-1">
        <IconSelector selectedIcon={iconId} onSelectIcon={setIconId} />
      </div>
    </div>
  );
}
