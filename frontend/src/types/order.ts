export interface OrderItem {
  id: string;
  course: string;
  course_title: string;
  price: string;
}

export interface Order {
  id: string;
  student_email?: string;
  status: string;
  payment_method: string;
  transaction_reference: string;
  total_amount: string;
  payment_verified: boolean;
  verified_by_email?: string;
  verified_at?: string | null;
  notes?: string;
  items: OrderItem[];
  created_at: string;
  updated_at?: string;
}

export interface CreateOrderData {
  courses: string[];
  payment_method: string;
  transaction_reference?: string;
  notes?: string;
}