import { IsOptional, IsString, IsIn, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class ListUsersQueryDto {
  @IsOptional()
  @IsIn(['all', 'free', 'premium'])
  plan?: 'all' | 'free' | 'premium';

  // Búsqueda por prefijo de email (para autocompletar mientras se escribe).
  // Se resuelve aparte del listado normal — no se combina con `plan` — para
  // no mezclar un filtro de rango con un where en otro campo, que sí
  // necesitaría un índice compuesto que hoy no existe en Firestore.
  @IsOptional()
  @IsString()
  search?: string;

  // uid del último usuario de la página anterior, para paginar con startAfter.
  @IsOptional()
  @IsString()
  cursor?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;
}
