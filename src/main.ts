import ExpressHttp from "./adapters/ExpressHttp"
import { IHttp } from "./interfaces/IHttp"
import * as doc from '../docs/swagger.json'
import MongoDBConnection from "./adapters/MongoDBConnection"

const uri = `mongodb+srv://tech-challenge-order-api:${process.env.DB_PASSWORD ?? 1234}@cluster0.zwrft.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const getHttp = (): IHttp => new ExpressHttp()

const main = async (): Promise<void> => {
   const db = new MongoDBConnection(uri, 'tech-challenge-73')
   await db.connect();
   const http = getHttp()
   await http.doc('/swagger', doc)
   await http.listen(+(process.env.PORT ?? 9002))
   process.on('SIGINT', async () => {
      await db.close()
      console.log('Process is finishing')
      process.exit()
   })
}

main().catch(console.log)