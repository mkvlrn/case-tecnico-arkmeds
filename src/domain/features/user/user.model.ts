export interface User {
  id: string;
  name: string;
  cpf: string;
  dateOfBirth: string;
  gender: "male" | "female" | "other" | "undisclosed";
  address: string;
  phone: string;
}
