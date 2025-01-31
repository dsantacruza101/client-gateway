import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-producto.dto';
import { IsNumber, IsPositive } from 'class-validator';

export class UpdateProductoDto extends PartialType(CreateProductDto) {
}
