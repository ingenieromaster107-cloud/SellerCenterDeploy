export interface SellerCustomer {
  customer_since: string;
  email: string;
  full_name: string;
  location: string;
}

export interface SellerCustomersResponse {
  message: string;
  success: boolean;
  total_count: number;
  data: SellerCustomer[];
}

export interface ClientListData {
  sellerCustomers: SellerCustomersResponse;
}

export interface ClientListApiResponse {
  data: ClientListData;
}

export interface ClientListDataTable {
  full_name: string;
  email: string;
  location: string;
  customer_since: string;
}
