export class CreateProductDto {
  name: string;
  price: number;
  categories: {
    name: string;
    description?: string;
  }[];
}
