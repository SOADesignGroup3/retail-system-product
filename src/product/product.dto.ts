import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import {
  CreateProductRequest,
  DecreaseStockRequest,
  FindOneRequest,
} from './product.pb';

export class FindOneRequestDto implements FindOneRequest {
  @IsNumber({ allowInfinity: false, allowNaN: false })
  public readonly id: number;

  //   constructor(data: FindOneRequest) {
  //     console.log('Validating FindOneRequestDto:', data);
  //     this.id = data.id;
  //   }
}

export class CreateProductRequestDto implements CreateProductRequest {
  @IsString()
  @IsNotEmpty()
  public readonly name: string;

  @IsString()
  @IsNotEmpty()
  public readonly sku: string;

  @IsNumber({ allowInfinity: false, allowNaN: false })
  public readonly stock: number;

  @IsNumber({ allowInfinity: false, allowNaN: false })
  public readonly price: number;

  //   constructor(data: CreateProductRequest) {
  //     console.log('Validating CreateProductRequestDto:', data);
  //     this.name = data.name;
  //     this.sku = data.sku;
  //     this.stock = data.stock;
  //     this.price = data.price;
  //   }
}

export class DecreaseStockRequestDto implements DecreaseStockRequest {
  @IsNumber({ allowInfinity: false, allowNaN: false })
  public readonly id: number;

  //   @IsNumber({ allowInfinity: false, allowNaN: false })
  //   public readonly orderId: number;

  //   constructor(data: DecreaseStockRequest) {
  //     console.log('Validating DecreaseStockRequestDto:', data);
  //     this.id = data.id;
  //     this.orderId = data.orderId;
  //   }
}
