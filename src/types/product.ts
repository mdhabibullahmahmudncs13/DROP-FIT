export type Collection = 'anime' | 'series' | 'minimal';

export interface Product {
  $id: string;
  title: string;
  description: string;
  price: number;
  collection: Collection;
  images: string[];
  sizes: string[];
  stock: number;
  is_drop: boolean;
  drop_id?: string;
}

export interface ProductFilters {
  collection?: Collection | 'all';
  priceSort?: 'asc' | 'desc';
  size?: string;
  search?: string;
}
