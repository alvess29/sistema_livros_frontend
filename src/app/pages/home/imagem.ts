const LADO_MAXIMO_INICIAL = 480;
const LADO_MINIMO = 120;
const LIMITE_CARACTERES = 150_000;

export async function comprimirImagem(arquivo: File): Promise<string> {
  const imagem = await createImageBitmap(arquivo);

  try {
    let ladoMaximo = LADO_MAXIMO_INICIAL;
    let resultado = desenhar(imagem, ladoMaximo);

    // O documento do Firestore tem limite de 1 MiB, então a imagem encolhe até caber
    while (resultado.length > LIMITE_CARACTERES && ladoMaximo > LADO_MINIMO) {
      ladoMaximo = Math.round(ladoMaximo * 0.75);
      resultado = desenhar(imagem, ladoMaximo);
    }

    return resultado;
  } finally {
    imagem.close();
  }
}

function desenhar(imagem: ImageBitmap, ladoMaximo: number): string {
  const escala = Math.min(1, ladoMaximo / Math.max(imagem.width, imagem.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(imagem.width * escala);
  canvas.height = Math.round(imagem.height * escala);

  const contexto = canvas.getContext('2d');

  if (!contexto) {
    throw new Error('Canvas indisponível.');
  }

  contexto.fillStyle = '#fff';
  contexto.fillRect(0, 0, canvas.width, canvas.height);
  contexto.drawImage(imagem, 0, 0, canvas.width, canvas.height);

  return canvas.toDataURL('image/jpeg', 0.8);
}
