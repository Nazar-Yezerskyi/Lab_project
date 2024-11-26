import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { RoomPhoto } from "./RoomPhoto";
import { RoomsOrder } from "./RoomsOrder";

@Entity("room", { schema: "mydb" })
export class Room {
  @PrimaryGeneratedColumn({ type: "int", name: "idroom" })
  idroom: number;

  @Column("int", { name: "room_number" })
  roomNumber: number;

  @Column("varchar", { name: "description", length: 200 })
  description: string;

  @Column("float", { name: "price_per_day", precision: 12 })
  pricePerDay: number;

  @Column("int", { name: "number_of_guests" })
  numberOfGuests: number;

  @OneToMany(() => RoomPhoto, (roomPhoto) => roomPhoto.roomIdroom2)
  roomPhotos: RoomPhoto[];

  @OneToMany(() => RoomsOrder, (roomsOrder) => roomsOrder.roomIdroom2)
  roomsOrders: RoomsOrder[];
}
