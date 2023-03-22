import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CartEntity } from '../cart.entity';
import { ProductsService } from 'src/product/service/products.service';
import { emit } from 'process';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartEntity)
    private cartRepository: Repository<CartEntity>,
    private productsService: ProductsService,
  ) {}

  async addToCart(
    productId: string,
    quantity: number,
    user: string,
  ): Promise<any> {
    const cartItems = await this.cartRepository.find();
    const product = await this.productsService.getOne(productId);
    const inventario = product.quantity - quantity;
    await this.productsService.updateQuantity(productId, inventario);

    if (product) {
      //confirm if item is exists in the cart
      const cart = cartItems.filter(
        (item) =>
          item.productId === productId &&
          item.userId === user &&
          !item.assigned,
      );
      if (cart.length < 1) {
        const newItem = {
          productId: product.id,
          price: product.price,
          quantity,
          total: product.price * quantity,
          userId: user,
        };
        return await this.cartRepository.save(newItem);
      } else {
        //Update the item quantity
        const tQuantity = cart[0].quantity + quantity;
        const total = cart[0].price * quantity;

        return await this.cartRepository.update(cart[0].id, {
          quantity: tQuantity,
          total,
        });
      }
    }
    return null;
  }
  async getItemsInCard(user: string): Promise<CartEntity[]> {
    const userCart = this.cartRepository.find({
      where: { userId: user, assigned: false },
    });
    return userCart;
  }
  async UpdateOrderId(userId, orderId) {
    console.log(userId, orderId);
    await this.cartRepository.update(
      { userId: userId, assigned: false },
      { items: orderId, assigned: true },
    );
  }
}
