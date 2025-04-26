export class CustomerDto {
  id: string;
  name: string;
  email: string;
  addresses: {
    id: string;
    address: string;
  }[];
}
