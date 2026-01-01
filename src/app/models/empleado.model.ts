export interface Empleado {
    id: number;
    nombre: string;
    email: string;
    telefono: string;
    salario: number;
    fechaIngreso: string; // Fecha en formato ISO
    departamento?: {
        id: number;
        nombre: string;
    };
}

export interface PageResponse<T> {
    content: T[];
    totalELements: number;
}