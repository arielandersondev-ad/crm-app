import axios from "axios";

import { env } from "../config/env";

export const api = axios.create({
  baseURL: env.apiUrl,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
})

let interceptorsReady = false;

export function initApi() {
  if (interceptorsReady) return;
  interceptorsReady = true;

  const { setupInterceptors } = require("./interceprtors");
  setupInterceptors();
}
