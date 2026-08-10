import apiClient from "./client";
import type {
  CreateOrderData,
  Order,
} from "../types/order";

export const getOrders = async (): Promise<Order[]> => {
  const response = await apiClient.get<Order[]>(
    "/orders/",
  );

  return response.data;
};

export const getOrder = async (
  orderId: string,
): Promise<Order> => {
  const response = await apiClient.get<Order>(
    `/orders/${orderId}/`,
  );

  return response.data;
};

export const createOrder = async (
  data: CreateOrderData,
): Promise<Order> => {
  const response = await apiClient.post<Order>(
    "/orders/",
    data,
  );

  return response.data;
};

export const cancelOrder = async (
  orderId: string,
): Promise<Order> => {
  const response = await apiClient.post<Order>(
    `/orders/${orderId}/cancel/`,
  );

  return response.data;
};