import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ServicesOrder } from "./ServicesOrder";

@Entity("services", { schema: "mydb" })
export class Services {
  @PrimaryGeneratedColumn({ type: "int", name: "idservices" })
  idservices: number;

  @Column("varchar", { name: "name_service", length: 45 })
  nameService: string;

  @Column("varchar", { name: "description", length: 150 })
  description: string;

  @Column("float", { name: "price", precision: 12 })
  price: number;

  @OneToMany(
    () => ServicesOrder,
    (servicesOrder) => servicesOrder.servicesIdservices2
  )
  servicesOrders: ServicesOrder[];
}
