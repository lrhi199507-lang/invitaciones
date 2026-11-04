export interface Invitado {
  id: number;
  nombre: string;
  pases: number;
  pasesMaximos?: number; // Compatibilidad por si App.tsx usa pasesMaximos
}

export const LISTA_INVITADOS: Invitado[] = [
  { id: 1, nombre: "Marmy Graterol", pases: 2, pasesMaximos: 2 },
  { id: 2, nombre: "Luisabel Rodriguez", pases: 2, pasesMaximos: 2 },
  { id: 3, nombre: "Yolis Graterol", pases: 4, pasesMaximos: 4 },
  { id: 4, nombre: "Francisco Graterol", pases: 2, pasesMaximos: 2 },
  { id: 5, nombre: "Franklin Graterol", pases: 3, pasesMaximos: 3 },
  { id: 6, nombre: "Francisco Graterol Hijo", pases: 3, pasesMaximos: 3 },
  { id: 7, nombre: "Fernando Graterol", pases: 2, pasesMaximos: 2 },
  { id: 8, nombre: "Aguedo Graterol", pases: 2, pasesMaximos: 2 },
  { id: 9, nombre: "Isaias Graterol", pases: 2, pasesMaximos: 2 },
  { id: 10, nombre: "Yaneth Irigoyen", pases: 6, pasesMaximos: 6 },
  { id: 11, nombre: "Miguel Acosta", pases: 2, pasesMaximos: 2 },
  { id: 12, nombre: "Maribel Mendoza", pases: 6, pasesMaximos: 6 },
  { id: 13, nombre: "Leticia Tovar", pases: 3, pasesMaximos: 3 },
  { id: 14, nombre: "Ramon Rivas", pases: 2, pasesMaximos: 2 },
  { id: 15, nombre: "Yubreska", pases: 2, pasesMaximos: 2 },
  { id: 16, nombre: "Nelsi", pases: 2, pasesMaximos: 2 },
  { id: 17, nombre: "Brisaida Marquez", pases: 3, pasesMaximos: 3 },
  { id: 18, nombre: "Fredery Sanchez", pases: 2, pasesMaximos: 2 },
  { id: 19, nombre: "Soide Vegas", pases: 2, pasesMaximos: 2 },
  { id: 20, nombre: "José Ángel Herrera", pases: 4, pasesMaximos: 4 },
  { id: 21, nombre: "David Martinez", pases: 2, pasesMaximos: 2 },
  { id: 22, nombre: "Genesis Mercado", pases: 2, pasesMaximos: 2 },
  { id: 23, nombre: "Zoylimar Arias", pases: 2, pasesMaximos: 2 },
  { id: 24, nombre: "Gisel Coen", pases: 2, pasesMaximos: 2 },
  { id: 25, nombre: "Sofia Arcila", pases: 4, pasesMaximos: 4 },
  { id: 26, nombre: "Anabella Ledezma", pases: 2, pasesMaximos: 2 },
  { id: 27, nombre: "Fabiana Castillo", pases: 4, pasesMaximos: 4 },
  { id: 28, nombre: "Maria Guedes", pases: 2, pasesMaximos: 2 },
  { id: 29, nombre: "Ashley Borrero", pases: 3, pasesMaximos: 3 },
  { id: 30, nombre: "Nicole Sosa", pases: 2, pasesMaximos: 2 }
];
