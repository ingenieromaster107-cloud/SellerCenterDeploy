export interface SubAccountInterface {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  status: string;
  createdAt: string;
  permissions: Permission[];
}

export type Permission = {
  [key: string]: string;
};

export interface SubAccountResponseInterface {
  created_at: string,
  customer_id: number,
  email: string,
  entity_id: number,
  firstname: string,
  lastname: string,
  parent_account_id: number,
  permission_type: string,
  seller_id: number,
  status: number,
  updated_at: string
}
