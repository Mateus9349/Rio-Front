export interface ICliente {
  id: number;
  nome: string;
  email?: string;
  telefone?: string;
  imagem?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ICreateClienteDto {
  nome: string;
  email?: string;
  telefone?: string;
}

export type IUpdateClienteDto = Partial<ICreateClienteDto>;
