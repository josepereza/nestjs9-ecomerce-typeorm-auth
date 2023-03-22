import {
  Entity,
  ManyToOne,
  JoinColumn,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderEntity } from 'src/order/order.entity';

@Entity()
export class CartEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  productId: string;

  @Column()
  quantity: number;

  @Column()
  price: number;

  @Column()
  total: number;

  @Column()
  userId: string;

  @Column({ default: false })
  assigned: boolean;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createAt: Date;

  @ManyToOne(() => OrderEntity, (order) => order.id, {
    cascade: true,
  })
  items: OrderEntity; // Este campo es el pedido (OrderEntity ) al cual pertenece una linea del carrito(CartEntity)
}
