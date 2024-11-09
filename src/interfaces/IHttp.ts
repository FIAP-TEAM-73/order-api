type Method = 'post' | 'get' | 'put' | 'delete' | 'patch'

export type Callback = (req: any, res: any) => Promise<{ statusCode: number, payload: unknown }>
export interface IHttp {
  route: (method: Method, url: string, callback: Callback) => Promise<any>
  listen: (port: number) => Promise<void>
  doc: (urlPath: string, doc: any) => Promise<void>
}
