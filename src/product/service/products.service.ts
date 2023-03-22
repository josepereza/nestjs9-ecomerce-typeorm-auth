import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ProductEntity } from '../product.entity';
import { Repository, UpdateResult, DeleteResult, Equal } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/auth/user.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
  ) {}

  async getAll(): Promise<ProductEntity[]> {
    return await this.productRepository.find();
  }

  async create(product: ProductEntity, user: Users): Promise<ProductEntity> {
    if (user.role == 'admin') {
      return await this.productRepository.save(product);
    }
    throw new UnauthorizedException();
  }

  async getOne(productoId: string): Promise<ProductEntity> {
    return this.productRepository.findOne({
      where: {
        id: productoId,
      },
    });
  }
  async update(
    id: number,
    product: ProductEntity,
    user: Users,
  ): Promise<UpdateResult> {
    if (user.role == 'admin') {
      return await this.productRepository.update(id, product);
    }
    throw new UnauthorizedException();
  }

  async delete(id: number, user: Users): Promise<DeleteResult> {
    if (user.role == 'admin') {
      return await this.productRepository.delete(id);
    }
    throw new UnauthorizedException();
  }

  async updateQuantity(id: string, quantity: number): Promise<any> {
    return await this.productRepository.update(id, { quantity });

    throw new UnauthorizedException();
  }
}
