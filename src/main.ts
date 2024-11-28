import ExpressHttp from "./adapters/ExpressHttp"
import { IHttp } from "./interfaces/IHttp"
import * as doc from '../docs/swagger.json'
import MongoDBConnection from "./adapters/MongoDBConnection"
import FakeCheckoutHandler from "./handlers/FakeCheckoutHandler"
import IOrderGateway from "./interfaces/IOrderGateway"
import EventHandler from "./handlers/EventHandler"
import { OrderGateway } from "./gateways/OrderGateway"
import OrderApi from "./apis/OrderApi"
import { IPaymentGateway } from "./interfaces/IPaymentGateway"
import AxiosIntegration from "./adapters/AxiosIntegration"
import PaymentGateway from "./gateways/PaymentGateway"

const uri = `mongodb+srv://${process.env.DB_USER ?? 'admin'}:${process.env.DB_PASSWORD ?? 1234}@cluster0.zwrft.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

const connection = new MongoDBConnection(uri, process.env.DB_NAME ?? 'tech-challenge-73')

const orderGateway = new OrderGateway(connection)

const getHanlders = (orderGateway: IOrderGateway, paymentGateway: IPaymentGateway): EventHandler => {
   return new EventHandler([new FakeCheckoutHandler(orderGateway, paymentGateway)])
}

const initRoutes = (http: IHttp): void => {
   const integration = new AxiosIntegration(process.env.PAYMENT_API_HOST ?? 'http://localhost:9003/api/v1')
   const paymentGateway = new PaymentGateway(integration)
   const handlers = getHanlders(orderGateway, paymentGateway)
   new OrderApi(http, orderGateway, handlers).init()
}

const getHttp = (): IHttp => new ExpressHttp()

const main = async (): Promise<void> => {
   await connection.connect()
   const http = getHttp()
   initRoutes(http)
   await http.doc('/swagger/order', doc)
   await http.listen(+(process.env.PORT ?? 9002))
   process.on('SIGINT', async () => {
      await connection.close()
      console.log('Process is finishing')
      process.exit()
   })
}

main().catch(console.log)