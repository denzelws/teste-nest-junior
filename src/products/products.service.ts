import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { ProductResponseDto } from './dto/product-response.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
  ) {}

  async create(dto: CreateProductDto): Promise<ProductResponseDto> {
    const existing = await this.productRepo.findOneBy({ sku: dto.sku });
    if (existing) {
      throw new BadRequestException('SKU já cadastrado');
    }

    const product = this.productRepo.create(dto);
    const saved = await this.productRepo.save(product);

    return {
      ...saved,
      missingLetter: this.getMissingLetter(saved.name),
    };
  }

  async findAll(): Promise<ProductResponseDto[]> {
    const products = await this.productRepo.find({
      order: { name: 'ASC' },
    });

    return products.map((p) => ({
      ...p,
      missingLetter: this.getMissingLetter(p.name),
    }));
  }

  async findOne(id: number): Promise<ProductResponseDto> {
    const product = await this.productRepo.findOneBy({ id });
    if (!product) throw new NotFoundException('Produto não encontrado');

    return {
      ...product,
      missingLetter: this.getMissingLetter(product.name),
    };
  }

  async update(id: number, dto: UpdateProductDto): Promise<Product> {
    const product = await this.productRepo.findOneBy({ id });
    if (!product) throw new NotFoundException('Produto não encontrado');

    Object.assign(product, dto);
    return this.productRepo.save(product);
  }

  async remove(id: number): Promise<void> {
    const result = await this.productRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Produto não encontrado');
    }
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
