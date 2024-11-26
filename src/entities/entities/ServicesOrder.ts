import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Services } from "./Services";
import { Users } from "./Users";

@Index("fk_services_order_users1_idx", ["usersIdusers"], {})
@Index("fk_services_order_services1_idx", ["servicesIdservices"], {})
@Entity("services_order", { schema: "mydb" })
export class ServicesOrder {
  @PrimaryGeneratedColumn({ type: "int", name: "idservices_order" })
  idservicesOrder: number;

  @Column("float", { name: "total_price", precision: 12 })
  totalPrice: number;

  @Column("date", { name: "date_of_order" })
  dateOfOrder: string;

  @Column("int", { primary: true, name: "users_idusers" })
  usersIdusers: number;

  @Column("int", { primary: true, name: "services_idservices" })
  servicesIdservices: number;

  @ManyToOne(() => Services, (services) => services.servicesOrders, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([
    { name: "services_idservices", referencedColumnName: "idservices" },
  ])
  servicesIdservices2: Services;

  @ManyToOne(() => Users, (users) => users.servicesOrders, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "users_idusers", referencedColumnName: "idusers" }])
  usersIdusers2: Users;
}
