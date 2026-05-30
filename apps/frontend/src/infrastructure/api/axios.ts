import axios from "axios";
import { setupInterceptors } from "./interceprtors";

import { env } from "../config/env";

export const api = axios.create({
  baseURL: env.apiUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
})

setupInterceptors() // personalmente prefiero evitar dependencias circulares y hacerlo desde un provider de infraestructura más adelante. (recuerdame cambiarlo en un futuro)
