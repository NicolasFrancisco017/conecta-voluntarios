import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, sep, extname } from 'node:path';

const raiz = resolve(import.meta.dirname ?? new URL('.', import.meta.url).pathname);
const porta = Number(process.env.PORT || 3000);
const tipos = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
};

const servidor = createServer(async (req, res) => {
  let caminho;
  try {
    caminho = decodeURIComponent(new URL(req.url ?? '/', 'http://localhost').pathname);
  } catch {
    res.writeHead(400).end('Requisição inválida');
    return;
  }
  if (caminho === '/') caminho = '/index.html';
  const partes = caminho.split('/').filter(Boolean);
  if (partes.some((parte) => parte.startsWith('.'))) {
    res.writeHead(403).end('Acesso negado');
    return;
  }
  const destino = resolve(raiz, `.${caminho}`);
  if (!destino.startsWith(`${raiz}${sep}`)) {
    res.writeHead(403).end('Acesso negado');
    return;
  }
  try {
    const info = await stat(destino);
    if (!info.isFile() || !tipos[extname(destino)]) {
      res.writeHead(404).end('Não encontrado');
      return;
    }
    const conteudo = await readFile(destino);
    res.writeHead(200, { 'Content-Type': tipos[extname(destino)], 'X-Content-Type-Options': 'nosniff' });
    res.end(conteudo);
  } catch {
    res.writeHead(404).end('Não encontrado');
  }
});

servidor.listen(porta, () => console.log(`Conecta Voluntários: http://localhost:${porta}`));
