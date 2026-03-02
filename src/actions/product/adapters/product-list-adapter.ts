import type { ProductListInterface } from 'src/interfaces/product/product-list-interface';

import { CONFIG } from 'src/global-config';

export function productListAdapter(data: any): ProductListInterface[] {
    if (!data?.products?.items) {
        console.warn("No found products:", data);
        return [];
    }

    return data.products.items.map((product: any) => ({
        id: product.id,
        sku: product.sku,
        productName: product.name,
        thumbnail: product.thumbnail?.url ?? CONFIG.assetsDir + '/assets/images/img-not-found.jpg',
        category: product.categories?.[0]?.name ?? "-",
        finalPrice: product.price_range?.minimum_price?.regular_price?.value ?? 0,
        discount: product.price_range?.minimum_price?.discount?.amount_off ?? 0,
        discountPercent: product.price_range?.minimum_price?.discount?.percent_off ?? 0,            
        stock: product.stock_saleable ?? 0,
        inStock: product.stock_status === "IN_STOCK",
        rating: product.rating_summary ?? 0        
    }));
}
