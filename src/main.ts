import ExpressHttp from "./adapters/ExpressHttp"
import { IHttp } from "./interfaces/IHttp"
import * as doc from '../docs/swagger.json'

const getHttp = (): IHttp => new ExpressHttp()

const main = async (): Promise<void> => {
  const http = getHttp()
  await http.doc('/swagger', doc)
  await http.listen(+(process.env.PORT ?? 9002))
  process.on('SIGINT', () => {
    console.log('Process is finishing')
    process.exit()
  })
}

main().catch(console.log)