import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { ProductResponseDto } from './dto/product-response.dto';

@Injectable()
export class ProductsService {
  private products: Product[] = [];
  private nextId = 1;

  create(dto: CreateProductDto): Product {
    const skuExists = this.products.some((p) => p.sku === dto.sku);
    if (skuExists) throw new BadRequestException('SKU já cadastrado');

    const newProduct: Product = {
      id: this.nextId++,
      ...dto,
    };

    this.products.push(newProduct);
    return newProduct;
  }

  findAll(): ProductResponseDto[] {
    return this.products
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((product) => ({
        ...product,
        missingLetter: this.getMissingLetter(product.name),
      }));
  }

  findOne(id: number): ProductResponseDto {
    const product = this.products.find((p) => p.id === id);
    if (!product) throw new NotFoundException('Produto não encontrado');

    return {
      ...product,
      missingLetter: this.getMissingLetter(product.name),
    };
  }

  update(id: number, dto: UpdateProductDto): Product {
    const product = this.findOne(id);
    Object.assign(product, dto);
    return product;
  }

  remove(id: number): void {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) throw new NotFoundException('Produto não encontrado');
    this.products.splice(index, 1);
  }

  private getMissingLetter(name: string): string {
    const normalized = name.toLowerCase().replace(/[^a-z]/g, '');
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';

    for (const char of alphabet) {
      if (!normalized.includes(char)) return char;
    }
    return '_';
  }
}
