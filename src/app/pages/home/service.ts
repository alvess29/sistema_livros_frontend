import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Livro } from './model';

@Injectable({
  providedIn: 'root',
})
export class ServiceHome {
  private apiUrl = 'http://localhost:8080/livros';

  constructor(private http: HttpClient) {}

  listar(): Observable<Livro[]> {
    return this.http.get<Livro[]>(`${this.apiUrl}/list`);
  }

  salvar(livro: Livro): Observable<Livro> {
    return this.http.post<Livro>(this.apiUrl, this.corpo(livro));
  }

  atualizar(id: string, livro: Livro): Observable<Livro> {
    return this.http.put<Livro>(`${this.apiUrl}/${id}`, this.corpo(livro));
  }

  excluir(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  private corpo({ titulo, autor, genero, descricao, capa }: Livro) {
    return { titulo, autor, genero, descricao, capa: capa ?? '' };
  }
}
