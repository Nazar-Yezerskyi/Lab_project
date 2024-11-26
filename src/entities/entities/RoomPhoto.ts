import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Room } from "./Room";

@Index("fk_room_photo_room1_idx", ["roomIdroom"], {})
@Entity("room_photo", { schema: "mydb" })
export class RoomPhoto {
  @PrimaryGeneratedColumn({ type: "int", name: "idroom_photo" })
  idroomPhoto: number;

  @Column("varchar", { name: "room_photo", length: 200 })
  roomPhoto: string;

  @Column("int", { primary: true, name: "room_idroom" })
  roomIdroom: number;

  @ManyToOne(() => Room, (room) => room.roomPhotos, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "room_idroom", referencedColumnName: "idroom" }])
  roomIdroom2: Room;
}
