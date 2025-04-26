export class ProductDto {
  id: string;
  name: string;
  price: number;
  categories: {
    id: string;
    name: string;
    description?: string;
  }[];
}
