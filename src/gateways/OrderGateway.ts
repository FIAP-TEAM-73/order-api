import type IConnection from '../interfaces/IConnection'
import Order, { type OrderStatus } from '../entities/Order'
import OrderItem from '../entities/OrderItem'
import type IOrderGateway from '../interfaces/IOrderGateway'
import { type OrderParams, type OrderPageParams } from '../interfaces/IOrderGateway'
import { CPF } from '../entities/value-objects/Cpf'

interface OrderRow {
  _id: string
  tableNumber: number
  status: OrderStatus
  cpf: { value: string } | null
  orderItems: OrderItemRow[]
}

interface OrderItemRow {
  orderId: string
  itemId: string
  price: number
  quantity: number
}

export class OrderGateway implements IOrderGateway {
  constructor(private readonly connection: IConnection) { }


  async save({ id, ...order }: Order): Promise<string> {
    const collection = await this.connection.getCollection("order");
    await collection.updateOne({ _id: id }, { $set: { ...order, _id: id } }, { upsert: true });
    return id
  }

  async findById(id: string): Promise<Order | undefined> {
    const collection = await this.connection.getCollection("order");
    const result = await collection.find({ _id: id }).toArray();
    if (result.length === 0) return undefined
    const orders = result.map(({ _id: id, cpf, orderItems, status, tableNumber }: OrderRow): Order => {
      const orderItemsMapped = orderItems.map(({ itemId, orderId, price, quantity }) => (new OrderItem(itemId, orderId, price, quantity)))
      return new Order(id, tableNumber, status, orderItemsMapped, this.createTypeSafeCpf(cpf))
    })
    return orders[0]
  }

  private createTypeSafeCpf(cpf: { value: string } | null): CPF | undefined {
    if (cpf === null) return undefined
    return new CPF(cpf.value)
  }

  async find({ page, size, ...params }: OrderPageParams): Promise<Order[]> {
    const filter = Object.keys(params).reduce((acc: Record<string, unknown>, key: string) => {
      const paramKey = key as keyof Omit<OrderPageParams, "page" | "size">;
      if (key === 'status' && !params[paramKey]) return { ...acc, status: { $ne: 'DONE' } };
      if (!params[paramKey]) return acc;
      if (key === 'id' && params[paramKey]) return { ...acc, _id: params[paramKey] };
      return { ...acc, [`${key}`]: params[paramKey] };
    }, {})

    const pipeline = [
      {
        $match: filter
      },
      {
        $addFields: {
          sortKey: {
            $switch: {
              branches: [
                { case: { $eq: ["$status", "READY"] }, then: 1 },
                { case: { $eq: ["$status", "IN_PROGRESS"] }, then: 2 },
                { case: { $eq: ["$status", "RECEIVE"] }, then: 3 }
              ],
              default: 4
            }
          }
        }
      },
      {
        $sort: { sortKey: 1, createdAt: -1 }
      },
      {
        $skip: page * size
      },
      {
        $limit: +size
      }
    ]
    const collection = await this.connection.getCollection("order");
    const result = await collection.aggregate(pipeline).toArray()
    if (result.length === 0) return []
    return await Promise.all(result.map(async (row: OrderRow) => {
      const { _id: id, cpf, status, tableNumber, orderItems } = row
      const orderItemsMapped = orderItems.map(({ itemId, orderId, price, quantity }) => (new OrderItem(itemId, orderId, price, quantity)))
      return new Order(id, tableNumber, status, orderItemsMapped, this.createTypeSafeCpf(cpf))
    }))
  }

  async count(params: OrderParams): Promise<number> {
    const filter = Object.keys(params).reduce((acc: Record<string, unknown>, key: string) => {
      const paramKey = key as keyof OrderParams;
      if (!params[paramKey]) return acc;
      if (key === 'id' && params[paramKey]) return { ...acc, _id: params[paramKey] };
      return { ...acc, [`${key}`]: params[paramKey] };
    }, {})
    const collection = await this.connection.getCollection("order");
    const result = await collection.find(filter).toArray()
    return result.length;
  }
}
