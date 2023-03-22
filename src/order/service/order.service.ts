import { Injectable } from '@nestjs/common';
import { OrderEntity } from '../order.entity';
import { Repository, getManager, getConnection } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CartService } from 'src/cart/service/cart.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>,
    private cartService: CartService,
  ) {}

  async order(user: string): Promise<OrderEntity> {
    const cartItems = await this.cartService.getItemsInCard(user);
    const userOrder = cartItems.filter((item) => item.userId === user);
    console.log('useorder', userOrder);
    console.log('cartitemr', cartItems);

    const subTotal = cartItems
      .map((item) => item.total)
      .reduce((acc, next) => acc + next);
    const miOrder = new OrderEntity();
     
    miOrder.payed = false;
    //miOrder.items = userOrder;
    miOrder.subTotal = subTotal;
    const order = await this.orderRepository.save(miOrder);
    await this.cartService.UpdateOrderId(user, order.id);
    return;
  }

  async getOrders(user: string): Promise<OrderEntity[]> {
    const orders = await this.orderRepository.find();
    return orders;
  }
}
