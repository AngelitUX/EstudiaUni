import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';

export interface Career {
  id: string;
  universidad: string;
  abreviatura: string;
  nombre: string;
  area: string;
  ubicacion: string;
  descripcion: string;
  intereses: string[];
  puntajes: {
    nem: number;
    ranking: number;
    lectora: number;
    matematica1: number;
    matematica2: number;
    electiva: number;
  };
  puntajeCorte2025: number;
}

export interface CareerFilters {
  ubicacion?: string;
  universidad?: string;
  area?: string;
  intereses?: string[];
  query?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CareerService {
  private http = inject(HttpClient);
  private dataUrl = 'assets/universidades-carreras.json';

  getCareers(): Observable<Career[]> {
    return this.http.get<Career[]>(this.dataUrl);
  }

  getAreas(): Observable<string[]> {
    return this.getCareers().pipe(
      map(careers => Array.from(new Set(careers.map(c => c.area))).sort())
    );
  }

  getUbicaciones(): Observable<string[]> {
    return this.getCareers().pipe(
      map(careers => Array.from(new Set(careers.map(c => c.ubicacion))).sort())
    );
  }

  getUniversidades(): Observable<string[]> {
    return this.getCareers().pipe(
      map(careers => Array.from(new Set(careers.map(c => c.universidad))).sort())
    );
  }

  private normalize(str: string): string {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  }

  recommendCareers(filters: CareerFilters): Observable<Career[]> {
    return this.getCareers().pipe(
      map(careers => {
        return careers.filter(c => {
          let matches = true;
          
          if (filters.ubicacion && !this.normalize(c.ubicacion).includes(this.normalize(filters.ubicacion))) {
            matches = false;
          }

          if (filters.universidad && this.normalize(c.universidad) !== this.normalize(filters.universidad)) {
            matches = false;
          }
          
          if (filters.area && c.area !== filters.area) {
            matches = false;
          }
          
          if (filters.intereses && filters.intereses.length > 0) {
            const hasCommonInterest = filters.intereses.some(interest => 
              c.intereses.some(cInterest => this.normalize(cInterest) === this.normalize(interest))
            );
            if (!hasCommonInterest) matches = false;
          }

          if (filters.query) {
            const q = this.normalize(filters.query);
            const inName = this.normalize(c.nombre).includes(q);
            const inUni = this.normalize(c.universidad).includes(q);
            const inAbbr = this.normalize(c.abreviatura).includes(q);
            if (!inName && !inUni && !inAbbr) matches = false;
          }

          return matches;
        });
      })
    );
  }
}
