import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Users } from "./Users";
import { Room } from "./Room";

@Index("fk_rooms_order_room1_idx", ["roomIdroom"], {})
@Index("fk_rooms_order_users1_idx", ["usersIdusers"], {})
@Entity("rooms_order", { schema: "mydb" })
export class RoomsOrder {
  @PrimaryGeneratedColumn({ type: "int", name: "idrooms_order" })
  idroomsOrder: number;

  @Column("date", { name: "check_in" })
  checkIn: string;

  @Column("date", { name: "check_out" })
  checkOut: string;

  @Column("float", { name: "total_price", precision: 12 })
  totalPrice: number;

  @Column("date", { name: "date_of_order" })
  dateOfOrder: string;

  @Column("int", { primary: true, name: "room_idroom" })
  roomIdroom: number;

  @Column("int", { primary: true, name: "users_idusers" })
  usersIdusers: number;

  @ManyToOne(() => Users, (users) => users.roomsOrders, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "users_idusers", referencedColumnName: "idusers" }])
  usersIdusers2: Users;

  @ManyToOne(() => Room, (room) => room.roomsOrders, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "room_idroom", referencedColumnName: "idroom" }])
  roomIdroom2: Room;
}
