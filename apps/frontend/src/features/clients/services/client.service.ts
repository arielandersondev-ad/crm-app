import { api } from "@/infrastructure/api/axios";

import type { Client } from "../types/client";
import { ENDPOINTS } from "../api/endpoints";

class ClientService {
  async getClients(): Promise<Client[]> {
    const response = await api.get<Client[]>(ENDPOINTS.GET.FIND_ALL);

    return response.data;
  }
}

export const clientService = new ClientService();