import { Room, Player } from "@/types/schema";
import { ParticipantList } from "@/components/shared/ParticipantList";
import { RoomInfoAndShare } from "./RoomInfoAndShare";

interface WaitingRoomProps {
  room: Room;
  players: Player[];
  myPlayerId: string;
  isHost: boolean;
  onStartGame: () => void;
  onDisbandRoom: () => void;
}

export function WaitingRoom({
  room,
  players,
  myPlayerId,
  isHost,
  onStartGame,
  onDisbandRoom,
}: WaitingRoomProps) {
  return (
    <div className="flex-1 flex flex-col items-center p-5 w-full max-w-[400px] mx-auto pt-10">
      <h1 className="font-kei text-4xl font-black text-black mb-6 tracking-[2px]">
        ナンバートーク
      </h1>

      {/* URLコピーとルームID表示を分離 */}
      <div className="w-full mb-8 flex flex-col items-center">
        <RoomInfoAndShare roomCode={room.room_code} />
      </div>

      {/* 参加者リスト */}
      <div className="w-full mb-8">
        <ParticipantList
          players={players}
          myPlayerId={myPlayerId}
          isHost={isHost}
        />
      </div>

      {/* アクションボタン */}
      <div className="w-full flex flex-col gap-4 mb-8">
        {isHost ? (
          <>
            <button
              onClick={onStartGame}
              className="ito-btn ito-btn-primary py-3 px-4 font-bold"
            >
              始める
            </button>
            <button onClick={onDisbandRoom} className="ito-btn ito-btn-outline">
              解散する
            </button>
          </>
        ) : (
          <>
            <div className="ito-btn bg-gray-300 text-gray-600 border-none cursor-not-allowed text-center">
              ホストの開始を待っています...
            </div>
            <button onClick={onDisbandRoom} className="ito-btn ito-btn-outline">
              退出する
            </button>
          </>
        )}
      </div>
    </div>
  );
}
