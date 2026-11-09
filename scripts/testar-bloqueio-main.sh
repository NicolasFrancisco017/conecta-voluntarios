#!/usr/bin/env bash
# Faz um commit VAZIO na main, tenta o push, salva a recusa e desfaz o commit local.
# Só use depois que a proteção da main estiver ativa.
set -euo pipefail

if [[ -n "$(git status --porcelain)" ]]; then
  echo 'A árvore de trabalho precisa estar limpa: commit/salve suas alterações antes.' >&2
  exit 1
fi

git switch main
git pull --ff-only origin main
if git show-ref --verify --quiet refs/heads/docs/evidencia-bloqueio-main; then
  echo 'A branch docs/evidencia-bloqueio-main já existe. Não repita o teste sem revisar.' >&2
  exit 1
fi

git commit --allow-empty -m 'test: tentativa de push direto na main'
echo 'Tentando push direto na main (o resultado esperado é uma RECUSA)...'
set +e
RESULTADO="$(git push origin HEAD:main 2>&1)"
CODIGO=$?
set -e
printf '%s\n' "$RESULTADO"

if (( CODIGO == 0 )); then
  echo 'ATENÇÃO: o push foi aceito! A proteção da main NÃO funcionou. Revise a configuração.' >&2
  exit 1
fi

# Apenas bloqueios explícitos são aceitos como evidência; erros de rede/autenticação não contam.
if ! printf '%s\n' "$RESULTADO" | grep -Eqi 'GH006|GH013|protected branch|repository rule violations|must be made through a pull request|pull request is required|changes must be made through a pull request'; then
  git reset --soft HEAD~1
  echo 'O push falhou, mas não parece ser por proteção da main. Verifique a mensagem acima.' >&2
  exit 1
fi

git reset --soft HEAD~1
mkdir -p docs/evidencias
{
  printf '%s\n' 'Aula 1 - evidência real de recusa de push direto na main'
  printf '%s\n' 'Comando executado: git push origin HEAD:main'
  printf 'Data local: %s\n' "$(date '+%Y-%m-%d %H:%M:%S %z')"
  printf 'Código de saída: %s\n\n' "$CODIGO"
  printf '%s\n' "$RESULTADO"
} > docs/evidencias/recusa-push-main.txt

git switch -c docs/evidencia-bloqueio-main
git add docs/evidencias/recusa-push-main.txt
git commit -m 'docs: registra bloqueio de push direto na main'
git push -u origin docs/evidencia-bloqueio-main

echo
echo 'Evidência salva e enviada para branch própria.'
echo 'Agora crie um Pull Request e peça aprovação ao seu colega:'
echo '  gh pr create --base main --head docs/evidencia-bloqueio-main --title "docs: registra recusa de push na main" --body "Evidência da Aula 1. Revisar e aprovar."'
echo 'O merge na main só será liberado com aprovação de outra pessoa.'
