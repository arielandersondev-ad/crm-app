import { api } from "@/infrastructure/api/axios";
import { CreatePaymentDto, Payment, UpdatePaymentDto } from "../types/visit";
import { ENDPOINTS } from "../api/endpoints";

class VisitPaymentService {
  async getPayments(visitId: string){
    const response = await api.get<Payment[]>(ENDPOINTS.VISIT_PAYMENT.GET.FIND_ALL.replace(':visitId',visitId))
    return response.data
  }

  async createPayment(data: CreatePaymentDto): Promise<Payment>{
    const response = await api.post<Payment>(ENDPOINTS.VISIT_PAYMENT.CREATE, data)
    return response.data
  }

  async updatePayment(data: UpdatePaymentDto): Promise<Payment>{
    const {id, ...rest} = data
    const response = await api.patch<Payment>(ENDPOINTS.VISIT_PAYMENT.UPDATE.replace(':id',data.id), rest)
    return response.data
  }

  async activarPayment(id: string) {
    const response = await api.patch(ENDPOINTS.VISIT_PAYMENT.ACTIVAR.replace(':id',id))
    return response.data
  }
  async desactivarPayment(id: string) {
    const response = await api.patch(ENDPOINTS.VISIT_PAYMENT.DESACTIVAR.replace(':id',id))
    return response.data
  }
  async sumary(visitId:string){
    console.log('sumary in service: ',visitId)
    const response = await api.get(ENDPOINTS.VISIT_PAYMENT.GET.SUMARY.replace(':visitId',visitId))
    console.log('post res: ',response.data)
    return response.data
  }
}

export const visitPaymentService = new VisitPaymentService();