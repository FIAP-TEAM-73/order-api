import type Order from '../entities/Order'

export interface IPaymentIntegrationResponse {
  integrationId: string
  qrCode: string
}
export interface IPaymentIntegrationGateway {
  createPayment: (order: Order) => Promise<IPaymentIntegrationResponse>
}
