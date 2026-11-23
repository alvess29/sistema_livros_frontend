export interface Livro {
  id: string;
  titulo: string;
  autor: string;
  genero: string;
  descricao: string;
  capa?: string | null;
}
