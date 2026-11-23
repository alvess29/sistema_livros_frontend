import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { vi } from 'vitest';
import { Home } from './home';

const domCasmurro = {
  id: 'abc123',
  titulo: 'Dom Casmurro',
  autor: 'Machado de Assis',
  genero: 'Romance',
  descricao: 'Clássico da literatura brasileira',
};

describe('Home', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
    httpTestingController = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
    httpTestingController.expectOne('http://localhost:8080/livros/list').flush([domCasmurro]);
    await fixture.whenStable();
  });

  afterEach(() => {
    httpTestingController.verify();
    vi.restoreAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load books using the backend field names', () => {
    expect(component.livros()).toEqual([domCasmurro]);
  });

  it('should register a book without sending an ID, then reload the list', async () => {
    const memorial = {
      id: '',
      titulo: 'Memorial de Aires',
      autor: 'Machado de Assis',
      genero: 'Romance',
      descricao: 'Diário de um diplomata aposentado',
    };
    component.livro = { ...memorial };

    component.salvar();

    const request = httpTestingController.expectOne('http://localhost:8080/livros');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({
      titulo: memorial.titulo,
      autor: memorial.autor,
      genero: memorial.genero,
      descricao: memorial.descricao,
      capa: '',
    });

    request.flush({ ...memorial, id: 'def456' });
    httpTestingController
      .expectOne('http://localhost:8080/livros/list')
      .flush([domCasmurro, { ...memorial, id: 'def456' }]);
    await fixture.whenStable();

    expect(component.livros().length).toBe(2);
    expect(component.editandoId).toBeNull();
  });

  it('should update the selected book', async () => {
    component.editar(component.livros()[0]);
    component.livro = { ...component.livro, titulo: 'Dom Casmurro (edição revisada)' };
    expect(component.editandoId).toBe('abc123');

    component.salvar();

    const request = httpTestingController.expectOne('http://localhost:8080/livros/abc123');
    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual({
      titulo: 'Dom Casmurro (edição revisada)',
      autor: domCasmurro.autor,
      genero: domCasmurro.genero,
      descricao: domCasmurro.descricao,
      capa: '',
    });

    request.flush({ ...domCasmurro, titulo: 'Dom Casmurro (edição revisada)' });
    httpTestingController
      .expectOne('http://localhost:8080/livros/list')
      .flush([{ ...domCasmurro, titulo: 'Dom Casmurro (edição revisada)' }]);
    await fixture.whenStable();

    expect(component.livros()[0].titulo).toBe('Dom Casmurro (edição revisada)');
  });

  it('should delete a book after confirmation', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    component.excluir(component.livros()[0]);

    const request = httpTestingController.expectOne('http://localhost:8080/livros/abc123');
    expect(request.request.method).toBe('DELETE');
    request.flush(null);

    httpTestingController.expectOne('http://localhost:8080/livros/list').flush([]);
    await fixture.whenStable();

    expect(component.livros()).toEqual([]);
  });

  it('should not delete a book when confirmation is cancelled', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false);

    component.excluir(component.livros()[0]);

    httpTestingController.expectNone('http://localhost:8080/livros/abc123');
  });

  it('should filter books by search and genre', () => {
    component.livros.set([
      domCasmurro,
      { ...domCasmurro, id: 'def456', titulo: 'Clean Code', autor: 'Robert Martin', genero: 'Tecnologia' },
    ]);

    component.busca.set('machado');
    expect(component.livrosFiltrados().map((livro) => livro.id)).toEqual(['abc123']);

    component.busca.set('');
    component.generoFiltro.set('Tecnologia');
    expect(component.livrosFiltrados().map((livro) => livro.id)).toEqual(['def456']);
  });

  it('should open the drawer for a new book and close it on cancel', () => {
    component.novo();
    expect(component.formAberto()).toBe(true);
    expect(component.editandoId).toBeNull();

    component.cancelarEdicao();
    expect(component.formAberto()).toBe(false);
  });

  it('should set and remove the cover image', () => {
    component.livro.capa = 'data:image/jpeg;base64,AAAA';
    component.removerCapa();
    expect(component.livro.capa).toBe('');
  });

  it('should reject a cover that is not an image', async () => {
    const alerta = vi.spyOn(window, 'alert').mockImplementation(() => undefined);
    const arquivo = new File(['texto'], 'nota.txt', { type: 'text/plain' });
    const evento = { target: { files: [arquivo], value: 'nota.txt' } } as unknown as Event;

    await component.selecionarCapa(evento);

    expect(alerta).toHaveBeenCalled();
    expect(component.livro.capa).toBe('');
  });
});
