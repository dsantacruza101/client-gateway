import { 
  Body, 
  Controller, 
  Delete, 
  Get, 
  Inject, 
  Param, 
  ParseIntPipe, 
  Patch, 
  Post, 
  Query 
} from '@nestjs/common';
import { 
  ClientProxy, 
  RpcException 
} from '@nestjs/microservices';
import { 
  catchError, 
  firstValueFrom, 
  throwError 
} from 'rxjs';
import { 
  PaginationDto, 
  CreateProductDto, 
  UpdateProductoDto 
} from 'src/common/dto';
import { NATS_SERVICE } from 'src/config';

@Controller('products')
export class ProductsController {

  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
  ) { }

  @Post()
  async createProcut(@Body() createProductDto: CreateProductDto) {
    const newProduct = await firstValueFrom(this.client.send(
      { cmd: 'create_product' },
      createProductDto
    ).pipe(
      catchError(err => throwError(() => new RpcException(err)))
    ));

    return newProduct;
  }

  @Get()
  findAllProducts(@Query() paginationDto: PaginationDto) {
    return this.client.send({ cmd: 'find_all' }, paginationDto);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {

    const product = await firstValueFrom(this.client.send({ cmd: 'find_one' }, { id }).pipe(
      catchError(err => throwError(() => new RpcException(err)))
    ));

    return product;

  }

  @Delete(':id')
  async deleteProduct(@Param('id', ParseIntPipe) id: number) {
    const deleteProduct = await firstValueFrom(this.client.send(
      { cmd: 'delete_product' },
      { id: id }).pipe(
        catchError(err => throwError(() => new RpcException(err)))
      ));

    return deleteProduct;
  }

  @Patch(':id')
  async updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductoDto
  ) {
    const updateProduct = await firstValueFrom(this.client.send(
      { cmd: 'update_product' },
      {
        id,
        ...updateProductDto
      }).pipe(
        catchError(err => throwError(() => new RpcException(err)))
      ));

    return updateProduct;
  }
}
