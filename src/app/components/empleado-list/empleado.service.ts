import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Empleado } from "../../models/empleado.model";

@Injectable({
    providedIn: 'root'
})
export class EmpleadoService {
    
    private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/empleados';

  // Añadimos el parámetro term para el filtro
  getEmpleados(term: string = ''): Observable<any> {
    // Si hay término, enviamos ?search=... (o el nombre que use tu Backend)
    const url = term ? `${this.apiUrl}?search=${term}` : this.apiUrl;
    return this.http.get<any>(url);
  }

  saveEmpleado(empleado: Partial<Empleado>): Observable<Empleado> {
    return this.http.post<Empleado>(this.apiUrl, empleado);
  }

  deleteEmpleado(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}