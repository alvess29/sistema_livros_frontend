import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Button } from '../../components/button/button';

interface Pixel {
  x: number;
  y: number;
  largura: number;
  altura: number;
  cor: string;
}

interface Bloco {
  pixels: Pixel[];
}

interface Coluna {
  blocos: Bloco[];
}

const QUANTIDADE_DE_COLUNAS = 40;
const MAXIMO_DE_BLOCOS = 3;

const TABUA_CLARA = '#c29a5b';
const TABUA_ESCURA = '#9a7340';
const TABUA_SOMBRA = '#7e5c31';
const LIVROS = [
  '#7b2d2d',
  '#a33b3b',
  '#2f5d3a',
  '#3f7a4a',
  '#2e4a7a',
  '#4a6fa5',
  '#8a5a2b',
  '#c9a15a',
  '#5a3a6a',
  '#d8d2c0',
];

@Component({
  imports: [Button, FormsModule],
  selector: 'app-login',
  styleUrls: ['./login.css'],
  templateUrl: './login.html',
})
export class Login {
  userName = '';
  colunas = this.gerarColunas();

  constructor(private rota: Router) {}

  onAccess(): void {
    const nome = this.userName.trim();

    if (!nome) {
      return;
    }

    sessionStorage.setItem('user', nome);
    this.rota.navigate(['/home']);
  }

  // Semente fixa para a estante ficar sempre igual a cada carregamento
  private gerarColunas(): Coluna[] {
    let numero = 7919;
    const sortear = () => {
      numero = (numero * 9301 + 49297) % 233280;
      return numero / 233280;
    };
    const escolher = <T>(lista: T[]) => lista[Math.floor(sortear() * lista.length)];

    const tabua = (y: number): Pixel[] => {
      const pixels: Pixel[] = [
        { x: 0, y, largura: 16, altura: 1, cor: TABUA_CLARA },
        { x: 0, y: y + 1, largura: 16, altura: 1, cor: TABUA_ESCURA },
      ];

      for (let i = 0; i < 4; i++) {
        pixels.push({
          x: Math.floor(sortear() * 16),
          y: y + Math.floor(sortear() * 2),
          largura: 1,
          altura: 1,
          cor: TABUA_SOMBRA,
        });
      }

      return pixels;
    };

    const prateleira = (topo: number): Pixel[] => {
      const pixels: Pixel[] = [];
      let x = 0;

      while (x < 16) {
        if (sortear() < 0.1) {
          x += 1;
          continue;
        }

        const largura = Math.min(sortear() < 0.35 ? 2 : 1, 16 - x);
        const altura = sortear() < 0.55 ? 5 : 4;
        const cor = escolher(LIVROS);

        pixels.push({ x, y: topo + 5 - altura, largura, altura, cor });
        pixels.push({ x, y: topo + 5 - altura, largura, altura: 1, cor: 'rgba(255,255,255,0.22)' });
        x += largura;
      }

      return pixels;
    };

    const bloco = (): Bloco => ({
      pixels: [...tabua(0), ...prateleira(2), ...tabua(7), ...prateleira(9), ...tabua(14)],
    });

    return Array.from({ length: QUANTIDADE_DE_COLUNAS }, () => ({
      blocos: Array.from({ length: 1 + Math.floor(sortear() * MAXIMO_DE_BLOCOS) }, bloco),
    }));
  }
}
