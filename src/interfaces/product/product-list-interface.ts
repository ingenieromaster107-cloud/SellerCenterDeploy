
export interface ProductListInterface {
  id: string;
  sku: string;
  productName: string;
  thumbnail: string;
  category: string;
  finalPrice: number;
  discount: number;
  discountPercent: number;  
  stock: number;
  inStock: boolean;
  rating: number;
};