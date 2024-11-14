import { OrderGateway } from '../../src/gateways/OrderGateway'
import type IConnection from '../../src/interfaces/IConnection'
import Order from '../../src/entities/Order'
import OrderItem from '../../src/entities/OrderItem'
import { ObjectId } from 'mongodb'

const orderItems: OrderItem[] = [
  new OrderItem('1', '1', 30, 2),
  new OrderItem('2', '1', 10, 2),
  new OrderItem('3', '1', 25, 2),
  new OrderItem('4', '1', 25, 1)
]

const mockCollectionMethods = {
  find: (filter: any) => {
    console.log({ filter })

    return {
      toArray: () => Promise.resolve([{
        _id: '1',
        tableNumber: 2,
        status: 'CREATED',
        cpf: null,
        orderItems: [
          {
            itemId: '1',
            orderId: '1',
            price: 30,
            quantity: 2
          },
          {
            itemId: '2',
            orderId: '1',
            price: 10,
            quantity: 2
          },
          {
            itemId: '3',
            orderId: '1',
            price: 25,
            quantity: 2
          },
          {
            itemId: '4',
            orderId: '1',
            price: 25,
            quantity: 1
          },
        ]
      },
      ])
    }
  },
  insertOne: (doc: any) => {
    return Promise.resolve({
      "acknowledged": true,
      "insertedId": doc._id
    })
  },
  updateOne: (_doc: any) => {
    return Promise.resolve({ "acknowledged": true, "matchedCount": 1, "modifiedCount": 1 })
  }
}

describe('Order Gateway', () => {
  const mockConnection: IConnection = {
    isAlive: async () => await Promise.resolve(true),
    close: async () => { },
    connect: async () => { },
    getCollection: jest.fn(async (collection: string) => {
      console.log({ collection })
      return await Promise.resolve(mockCollectionMethods)
    })
  }
  describe('Create an Order', () => {
    it('Should save an Order when every data was correct provided', async () => {
      const order = new Order('1', 2, 'CREATED', orderItems)
      const sut = new OrderGateway(mockConnection)
      const result = await sut.save(order)
      expect(result).toEqual('1')
    })
    it('Should throw an error when Connection throws', async () => {
      const mockConnectionReject = {
        ...mockConnection,
        getCollection: jest.fn(async (collection: string) => {
          console.log({ collection })
          return { ...mockCollectionMethods, updateOne: await Promise.reject(new Error('Generec gateway erro!')) }
        })
      }
      const order = new Order('1', 2, 'CREATED', orderItems)
      const sut = new OrderGateway(mockConnectionReject)
      const result = sut.save(order)
      await expect(result).rejects.toEqual(new Error('Generec gateway erro!'))
    })
  })
  describe('Find an Order by ID', () => {
    it('Should find an Order by ID when it exists', async () => {
      const orderId = '1'
      const sut = new OrderGateway(mockConnection)
      const result = await sut.findById(orderId)
      expect(result).toEqual(new Order('1', 2, 'CREATED', orderItems))
    })
    it('Should throw when Connection throws', async () => {
      const mockConnectionReject = {
        ...mockConnection,
        getCollection: jest.fn(async (collection: string) => {
          console.log({ collection })
          return { ...mockCollectionMethods, find: await Promise.reject(new Error('Generec gateway erro!')) }
        })
      }
      const orderId = '1'
      const sut = new OrderGateway(mockConnectionReject)
      const result = sut.findById(orderId)
      await expect(result).rejects.toEqual(new Error('Generec gateway erro!'))
    })
    it('Should return undefined when Order does not exist', async () => {
      const mockConnectionEmpty = {
        ...mockConnection,
        getCollection: jest.fn(async (collection: string) => {
          console.log({ collection })
          return { ...mockCollectionMethods, find: () => ({ toArray: async () => await Promise.resolve([]) }) }
        })
      }
      const wrongId = 'missingID'
      const sut = new OrderGateway(mockConnectionEmpty)
      const result = await sut.findById(wrongId)
      expect(result).toBeUndefined()
    })
  })
})
