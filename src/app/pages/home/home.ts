import { ChangeDetectorRef, Component, OnInit, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ServiceHome } from './service';
import { Livro } from './model';
import { comprimirImagem } from './imagem';

@Component({
  imports: [FormsModule],
  selector: 'app-home',
  styleUrls: ['./home.css'],
  templateUrl: './home.html',
})
export class Home implements OnInit {
  generos = ['Romance', 'Ficção', 'Tecnologia', 'História', 'Biografia', 'Outros'];
  livros = signal<Livro[]>([]);
  busca = signal('');
  generoFiltro = signal('');
  formAberto = signal(false);
  editandoId: string | null = null;
  livro: Livro = this.novoLivro();
  usuario = sessionStorage.getItem('user') ?? 'Visitante';

  livrosFiltrados = computed(() => {
    const termo = this.busca().trim().toLowerCase();
    const genero = this.generoFiltro();

    return this.livros().filter(
      (livro) =>
        (!genero || livro.genero === genero) &&
        (!termo || `${livro.titulo} ${livro.autor}`.toLowerCase().includes(termo)),
    );
  });

  constructor(
    private serviceHome: ServiceHome,
    private changeDetectorRef: ChangeDetectorRef,
    private rota: Router,
  ) {}

  ngOnInit(): void {
    this.listar();
  }

  listar(): void {
    this.serviceHome.listar().subscribe({
      next: (livros) => this.livros.set(livros),
      error: (erro) => {
        console.error('Falha ao carregar livros.', erro);
        window.alert('Não foi possível carregar os livros.');
      },
    });
  }

  novo(): void {
    this.limpar();
    this.formAberto.set(true);
  }

  salvar(): void {
    const id = this.editandoId;
    const request =
      id === null
        ? this.serviceHome.salvar(this.livro)
        : this.serviceHome.atualizar(id, this.livro);

    request.subscribe({
      next: () => {
        this.limpar();
        this.listar();
      },
      error: (erro) => {
        console.error('Falha ao salvar livro.', erro);
        window.alert('Não foi possível salvar o livro.');
      },
    });
  }

  editar(livro: Livro): void {
    this.livro = { ...livro, capa: livro.capa ?? '' };
    this.editandoId = livro.id;
    this.formAberto.set(true);
    this.changeDetectorRef.markForCheck();
  }

  async selecionarCapa(evento: Event): Promise<void> {
    const campo = evento.target as HTMLInputElement;
    const arquivo = campo.files?.[0];
    campo.value = '';

    if (!arquivo) {
      return;
    }

    if (!arquivo.type.startsWith('image/')) {
      window.alert('Selecione um arquivo de imagem.');
      return;
    }

    try {
      this.livro.capa = await comprimirImagem(arquivo);
      this.changeDetectorRef.markForCheck();
    } catch (erro) {
      console.error('Falha ao processar imagem.', erro);
      window.alert('Não foi possível processar a imagem.');
    }
  }

  removerCapa(): void {
    this.livro.capa = '';
  }

  cancelarEdicao(): void {
    this.limpar();
  }

  excluir(livro: Livro): void {
    if (!window.confirm(`Deseja excluir o livro "${livro.titulo}"?`)) {
      return;
    }

    this.serviceHome.excluir(livro.id).subscribe({
      next: () => this.listar(),
      error: (erro) => {
        console.error('Falha ao excluir livro.', erro);
        window.alert('Não foi possível excluir o livro.');
      },
    });
  }

  limpar(): void {
    this.livro = this.novoLivro();
    this.editandoId = null;
    this.formAberto.set(false);
    this.changeDetectorRef.markForCheck();
  }

  sair(): void {
    sessionStorage.removeItem('user');
    this.rota.navigate(['/login']);
  }

  private novoLivro(): Livro {
    return {
      id: '',
      titulo: '',
      autor: '',
      genero: '',
      descricao: '',
      capa: '',
    };
  }
}
