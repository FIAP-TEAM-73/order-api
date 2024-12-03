import Order from "../entities/Order";
import { IIntegration } from "../interfaces/IIntegration";
import { IPaymentGateway } from "../interfaces/IPaymentGateway";

export default class PaymentGateway implements IPaymentGateway {

    constructor (private readonly paymentIntegration: IIntegration) {}

    async createPayment (order: Order): Promise<void> {
        const request = {
            orderId: order.id,
            orderValue: order.getTotal(),
            cpf: order.cpf?.value
        }
        await this.paymentIntegration.post('/payment', request, {})
    }
}