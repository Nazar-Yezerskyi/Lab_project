import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "./Users";

@Entity("role", { schema: "mydb" })
export class Role {
  @PrimaryGeneratedColumn({ type: "int", name: "idrole" })
  idrole: number;

  @Column("varchar", { name: "role", length: 45 })
  role: string;

  @OneToMany(() => Users, (users) => users.roleIdrole2)
  users: Users[];
}
