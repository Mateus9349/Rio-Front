export interface ICliente {
  id: number;
  nome: string;
  email?: string;
  telefone?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ICreateClienteDto {
  nome: string;
  email?: string;
  telefone?: string;
}

export interface IUpdateClienteDto extends Partial<ICreateClienteDto> { }
