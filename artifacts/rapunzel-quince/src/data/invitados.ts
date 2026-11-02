export interface Familia {
  id: string;
  nombre: string;
  maxCupos: number;
}

export const LISTA_INVITADOS: Familia[] = [
  { id: '1', nombre: 'Familia Hernández', maxCupos: 5 },
  { id: '2', nombre: 'Familia Rodríguez', maxCupos: 2 },
  { id: '3', nombre: 'Familia Pérez', maxCupos: 4 },
  { id: '4', nombre: 'Familia García', maxCupos: 3 },
  // Agrega aquí todos los invitados que necesites en el futuro:
  // { id: '5', nombre: 'Familia Gómez', maxCupos: 3 },
];
