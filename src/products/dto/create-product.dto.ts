import { IsNotEmpty, IsString, IsNumber, Min } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty({ message: 'O nome não pode estar vazio' })
  @IsString()
  name: string;

  @IsNumber()
  @Min(0.01, { message: 'O preço deve ser maior que zero' })
  price: number;

  @IsNotEmpty({ message: 'SKU obrigatório' })
  @IsString()
  sku: string;
}
