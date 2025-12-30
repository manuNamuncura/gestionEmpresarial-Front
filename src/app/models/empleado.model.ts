export interface Empleado {
    id: number;
    nombre: string;
    email: string;
    departamento?: {
        id: number;
        nombre: string;
    };
}

export interface PageResponse<T> {
    content: T[];
    totalELements: number;
}