// interfaces/plantioBack.interface.ts (V2)
export interface IPlantioBack {
  id: string;
  anoCompensacao: number;
  tCO2Compensadas: number | string;
  numeroArvores: number;
  areaM2: number | string;
  imagens?: string[]; // imagens do PLANTIO (se existirem), mantém como string[]

  cliente: {
    id: string;
    nome: string;
  };

  saf: {
    id: string;
    identificacao: string;
    latitude?: number | string;   // backend pode enviar decimal como string
    longitude?: number | string;  // idem
    imagens?: import('./SAF.interface').IImagemSaf[]; // <- mudou p/ objetos
  };

  comunidade: {
    id: string;
    nome: string;
  };

  proprietario: {
    id: string;
    nome: string;
    telefone?: string;
    email?: string;
  };
}

