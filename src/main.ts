import ExpressHttp from "./adapters/ExpressHttp"
import { IHttp } from "./interfaces/IHttp"

const getHttp = (): IHttp => new ExpressHttp()

const main = async (): Promise<void> => {
  const http = getHttp()
  await http.listen(+(process.env.PORT ?? 9001))
  process.on('SIGINT', () => {
    console.log('Process is finishing')
    process.exit()
  })
}

main().catch(console.log)