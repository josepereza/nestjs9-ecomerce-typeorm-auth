import {
  Entity,
  OneToMany,
  JoinColumn,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CartEntity } from '../cart/cart.entity';

@Entity()
export class OrderEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => CartEntity, (cart) => cart.id, {
    cascade: true,
  })
  items: CartEntity[];

  @Column()
  subTotal: number;

  @Column({ default: false })
  payed: boolean;
}
