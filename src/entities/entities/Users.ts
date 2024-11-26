import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { RoomsOrder } from "./RoomsOrder";
import { ServicesOrder } from "./ServicesOrder";
import { Role } from "./Role";
import { Position } from "./Position";

@Index("fk_users_role_idx", ["roleIdrole"], {})
@Index("fk_users_position1_idx", ["positionIdposition"], {})
@Entity("users", { schema: "mydb" })
export class Users {
  @PrimaryGeneratedColumn({ type: "int", name: "idusers" })
  idusers: number;

  @Column("varchar", { name: "name", length: 45 })
  name: string;

  @Column("varchar", { name: "last_name", length: 45 })
  lastName: string;

  @Column("varchar", { name: "email", length: 45 })
  email: string;

  @Column("varchar", { name: "password", length: 200 })
  password: string;

  @Column("int", { primary: true, name: "role_idrole" })
  roleIdrole: number;

  @Column("int", { name: "position_idposition", nullable: true })
  positionIdposition: number | null;

  @OneToMany(() => RoomsOrder, (roomsOrder) => roomsOrder.usersIdusers2)
  roomsOrders: RoomsOrder[];

  @OneToMany(
    () => ServicesOrder,
    (servicesOrder) => servicesOrder.usersIdusers2
  )
  servicesOrders: ServicesOrder[];

  @ManyToOne(() => Role, (role) => role.users, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "role_idrole", referencedColumnName: "idrole" }])
  roleIdrole2: Role;

  @ManyToOne(() => Position, (position) => position.users, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([
    { name: "position_idposition", referencedColumnName: "idposition" },
  ])
  positionIdposition2: Position;
}
