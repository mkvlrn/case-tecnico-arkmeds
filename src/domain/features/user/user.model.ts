export interface User {
  id: string;
  name: string;
  cpf: string;
  age: number;
  gender: "male" | "female" | "other" | "undisclosed";
  address: string;
  phone: string;
}
