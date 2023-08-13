import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entity/product.entity';
import {
  CreateProductRequestDto,
  DecreaseStockRequestDto,
  FindOneRequestDto,
} from './product.dto';
import {
  CreateProductResponse,
  DecreaseStockResponse,
  FindOneResponse,
} from './product.pb';
import { StockDecreaseLog } from './entity/stock-decrease-log.entity';

@Injectable()
export class ProductService {
  @InjectRepository(Product)
  private readonly repository: Repository<Product>;

  @InjectRepository(StockDecreaseLog)
  private readonly decreaseLogRepository: Repository<StockDecreaseLog>;

  public async findOne({ id }: FindOneRequestDto): Promise<FindOneResponse> {
    const product: Product = await this.repository.findOne({ where: { id } });
    console.log('find one');
    if (!product) {
      return {
        data: null,
        error: ['Product not found'],
        status: HttpStatus.NOT_FOUND,
      };
    }

    return { data: product, error: null, status: HttpStatus.OK };
  }

  public async createProduct(
    payload: CreateProductRequestDto,
  ): Promise<CreateProductResponse> {
    const product: Product = new Product();

    product.name = payload.name;
    product.sku = payload.sku;
    product.stock = payload.stock;
    product.price = payload.price;

    await this.repository.save(product);

    return { id: product.id, error: null, status: HttpStatus.OK };
  }

  //   public async decreaseStock({
  //     id,
  //     orderId,
  //   }: DecreaseStockRequestDto): Promise<DecreaseStockResponse> {
  //     console.log('decreasing stock data');
  //     const product: Product = await this.repository.findOne({
  //       select: ['id', 'stock'],
  //       where: { id },
  //     });

  //     if (!product) {
  //       return { error: ['Product not found'], status: HttpStatus.NOT_FOUND };
  //     } else if (product.stock <= 0) {
  //       return { error: ['Stock too low'], status: HttpStatus.CONFLICT };
  //     }

  //     const isAlreadyDecreased: number = await this.decreaseLogRepository.count({
  //       where: { orderId },
  //     });

  //     if (isAlreadyDecreased) {
  //       // Idempotence
  //       return {
  //         error: ['Stock already decreased'],
  //         status: HttpStatus.CONFLICT,
  //       };
  //     }
  //     console.log('...decreasing');
  //     await this.repository.update(product.id, { stock: product.stock - 1 });
  //     console.log('...decreasing');
  //     await this.decreaseLogRepository.insert({ product, orderId });
  //     console.log('decrease sucessful ');

  //     return { error: null, status: HttpStatus.OK };
  //   }

  public async decreaseStock({
    id,
  }: DecreaseStockRequestDto): Promise<DecreaseStockResponse> {
    console.log('decreasing stock data');
    const product: Product = await this.repository.findOne({
      select: ['id', 'stock'],
      where: { id },
    });

    if (!product) {
      return { error: ['Product not found'], status: HttpStatus.NOT_FOUND };
    } else if (product.stock <= 0) {
      return { error: ['Stock too low'], status: HttpStatus.CONFLICT };
    }

    console.log('...decreasing');
    await this.repository.update(product.id, { stock: product.stock - 1 });
    console.log('...decreasing');
    // No need to insert decrease log, as orderId is not used

    console.log('decrease successful');
    return { error: null, status: HttpStatus.OK };
  }
}
