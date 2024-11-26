import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "./Users";

@Entity("position", { schema: "mydb" })
export class Position {
  @PrimaryGeneratedColumn({ type: "int", name: "idposition" })
  idposition: number;

  @Column("varchar", { name: "position", length: 45 })
  position: string;

  @Column("float", { name: "salary", precision: 12 })
  salary: number;

  @Column("date", { name: "date_of_employ" })
  dateOfEmploy: string;

  @OneToMany(() => Users, (users) => users.positionIdposition2)
  users: Users[];
}
