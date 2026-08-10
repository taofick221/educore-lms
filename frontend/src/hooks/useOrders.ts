import { useEffect, useState } from "react";
import {
  getOrder,
  getOrders,
} from "../api/orders";
import type { Order } from "../types/order";

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getOrders();
        setOrders(data);
      } catch {
        setError("Failed to load orders.");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  return {
    orders,
    loading,
    error,
  };
}

export function useOrder(orderId: string) {
  const [order, setOrder] = useState<Order | null>(
    null,
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrder = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getOrder(orderId);
        setOrder(data);
      } catch {
        setError("Failed to load order.");
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [orderId]);

  return {
    order,
    loading,
    error,
  };
}