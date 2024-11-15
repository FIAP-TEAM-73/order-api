import ExpressHttp from "./adapters/ExpressHttp"
import { IHttp } from "./interfaces/IHttp"
import * as doc from '../docs/swagger.json'
import MongoDBConnection from "./adapters/MongoDBConnection"
import FakeCheckoutHandler from "./handlers/FakeCheckoutHandler"
import IOrderGateway from "./interfaces/IOrderGateway"
import { IPaymentIntegrationGateway } from "./interfaces/IPaymentIntegrationGateway"
import EventHandler from "./handlers/EventHandler"
import { OrderGateway } from "./gateways/OrderGateway"
import PaymentIntegrationInMemoryGateway from "./gateways/PaymentIntegrationInMemoryGateway"
import OrderApi from "./apis/OrderApi"

const uri = `mongodb+srv://tech-challenge-order-api:${process.env.DB_PASSWORD ?? 1234}@cluster0.zwrft.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

const connection = new MongoDBConnection(uri, 'tech-challenge-73')

const orderGateway = new OrderGateway(connection)

const paymentIntegrationGateway = new PaymentIntegrationInMemoryGateway()

const getHanlders = (orderGateway: IOrderGateway, paymentIntegrationGateway: IPaymentIntegrationGateway): EventHandler => {
   return new EventHandler([new FakeCheckoutHandler(orderGateway, paymentIntegrationGateway)])
}

const initRoutes = (http: IHttp): void => {
   const handlers = getHanlders(orderGateway, paymentIntegrationGateway)
   new OrderApi(http, orderGateway, handlers).init()
}

const getHttp = (): IHttp => new ExpressHttp()

const main = async (): Promise<void> => {
   await connection.connect()
   const http = getHttp()
   initRoutes(http)
   await http.doc('/swagger', doc)
   await http.listen(+(process.env.PORT ?? 9002))
   process.on('SIGINT', async () => {
      await connection.close()
      console.log('Process is finishing')
      process.exit()
   })
}

main().catch(console.log)