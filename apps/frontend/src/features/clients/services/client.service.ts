import { api } from "@/infrastructure/api/axios";

import type { Client, CreateClientDto, UpdateClientDto } from "../types/client";
import { ENDPOINTS } from "../api/endpoints";

class ClientService {
  async getClients(): Promise<Client[]> {
    const response = await api.get<Client[]>(ENDPOINTS.GET.FIND_BY_TENANT_ID);

    return response.data;
  }
  async getClientById(id: string): Promise<Client> {
    const response = await api.get<Client>(ENDPOINTS.GET.FIND_BY_ID.replace(':id', id));

    return response.data;
  }
  async createClient(client: CreateClientDto) {
    const response = await api.post<Client>(ENDPOINTS.CREATE, client);

    return response.data;
  }
  async updateClient(client: UpdateClientDto) {
    try {
      const { id, ...rest } = client;

      console.log("PATCH BODY", rest);

      const response = await api.patch<Client>(
        ENDPOINTS.UPDATE.replace(":id", id),
        rest
      );

      return response.data;
    } catch (error: any) {
      console.log("ERROR RESPONSE");
      console.log(error.response?.data);

      throw error;
    }
  }
  
  async deleteClient(id: string) {
    console.log('Serivice delete: ', id);
    const response = await api.delete<Client>(ENDPOINTS.REMOVE.replace(":id", id));
    console.log(ENDPOINTS.REMOVE.replace(":id", id) );
    console.log('response: ', response);

    return response.data;
  }
}

export const clientService = new ClientService();