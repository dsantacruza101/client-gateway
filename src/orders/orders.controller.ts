import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Inject, 
  Query,
  ParseUUIDPipe,
  Patch
} from '@nestjs/common';
import { 
  ClientProxy, 
  RpcException 
} from '@nestjs/microservices';
import { 
  catchError, 
  throwError, 
  firstValueFrom 
} from 'rxjs';
import { 
  CreateOrderDto, 
  OrderPaginationDto, 
  StatusDto 
} from './dto';
import { NATS_SERVICE } from 'src/config';

@Controller('orders')
export class OrdersController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
  ) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {

    const newOrder = await firstValueFrom(this.client.send({ cmd: 'createOrder' }, createOrderDto).pipe(
      catchError(err => throwError(() => new RpcException(err)))
    ));

    return newOrder;
    
  }

  @Get()
  findAll(@Query() orderPaginationDto: OrderPaginationDto) {
     
    return this.client.send({ cmd: 'findAllOrders' }, orderPaginationDto);
  
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    
    const order = await firstValueFrom(this.client.send({ cmd: 'findOneOrder' }, { id }).pipe(
      catchError(err => throwError(() => new RpcException(err)))
    ));
    return order;
  }

  @Patch(':id')
  async changeStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() statusDto: StatusDto
  ) {
    try {

      const order = await firstValueFrom(this.client.send({ cmd: 'changeOrder_status' }, { id, statusDto }).pipe(
        catchError(err => throwError(() => new RpcException(err)))
      ));

      return order;
      
    } catch (error) {
      throw new RpcException(error);
    }
  }

}
