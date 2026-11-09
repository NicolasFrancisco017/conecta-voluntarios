# Roteiro de entrega — Arch Linux e GitHub

## 1. Pré-requisitos

```bash
sudo pacman -Syu --needed git github-cli nodejs npm unzip
node --version
git --version
gh --version
```

Abra uma conta GitHub com e-mail confirmado e 2FA ativa. Escolha um colega que também tenha GitHub.

## 2. Preparar e testar

Extraia o ZIP disponibilizado e entre na pasta `conecta-voluntarios`.

```bash
npm ci
npm run check
npm test
npm start
```

Abra http://localhost:3000, faça uma inscrição de teste e finalize o servidor com Ctrl+C.

## 3. Autenticar e publicar o repositório (ANTES de proteger a main)

```bash
gh auth login -h github.com -p https -w
gh auth setup-git
MEU_GITHUB="$(gh api user --jq .login)"
sed -i "s/@SEU_USUARIO/@${MEU_GITHUB}/g" .github/CODEOWNERS
sed -i "s@SEU_USUARIO@${MEU_GITHUB}@g" docs/EVIDENCIAS_AULA_1.md
git init -b main
git add .
git commit -m "chore: inicia projeto e publica plano de GCS"
gh repo create conecta-voluntarios --public --source=. --remote=origin --push --description "Projeto acadêmico de GCS e DevOps - Aula 1"
```

Se faltar identidade do Git, configure `git config --global user.name "Seu Nome"` e `git config --global user.email "email-verificado-no-github"`.

## 4. Configurar o GitHub

```bash
bash scripts/configurar-github.sh USUARIO_DO_COLEGA
```

O GitHub enviará um convite: seu par precisa aceitá-lo. A configuração cria ambientes e ativa branch protection; não muda o repositório do professor.

## 5. Comprovar o bloqueio

```bash
bash scripts/testar-bloqueio-main.sh
```

O script cria um commit vazio temporário, tenta publicá-lo diretamente na `main`, coleta a resposta real de recusa e desfaz o commit local. Em seguida cria e envia a branch `docs/evidencia-bloqueio-main` contendo a prova. Ele **não fabrica** a mensagem.

Depois:

```bash
gh pr create --base main --head docs/evidencia-bloqueio-main --title "docs: registra recusa de push na main" --body "Evidência da Aula 1 para revisão do par."
```

Acesse o PR, peça revisão ao colega (Reviewers), aguarde a aprovação dele e conclua por Squash and merge. Você não pode aprovar seu próprio PR.

## 6. Verificar ambientes

```bash
REPO="$(gh repo view --json nameWithOwner --jq '.nameWithOwner')"
gh api "repos/$REPO/branches/main/protection" --jq '{enforce_admins: .enforce_admins.enabled, aprovacoes: .required_pull_request_reviews.required_approving_review_count}'
gh api "repos/$REPO/environments" --jq '.environments[].name'
gh api "repos/$REPO/environments/production" --jq '.protection_rules'
```

Também é possível abrir GitHub → Settings → Environments e fazer as capturas.

Para demonstrar o gate de aprovação sem deploy real, abra a aba Actions e execute o workflow **Demonstracao - aprovacao de ambientes** na `main`. O job `production` ficará esperando um Required reviewer (você), caso esteja tudo configurado corretamente.

## 7. Atualizar código depois da entrega

```bash
git switch main
git pull --ff-only origin main
git switch -c feature/minha-melhoria
# edite arquivos
npm test
git add .
git commit -m "feat(web): descreve minha melhoria"
git push -u origin feature/minha-melhoria
gh pr create --base main --title "feat(web): descreve minha melhoria" --body "Descreva a melhoria e como testar."
```

Solicite revisão ao colega. Depois do squash merge, sincronize `main` com `git switch main && git pull --ff-only origin main`.

## 8. Entrega ao professor

Envie (a) o link público do seu repositório, (b) o @usuario do colega revisor, (c) a captura ou texto real da recusa de push na `main`.

**Cuidado:** não use `git push --force` nem contorne a proteção. O objetivo é justamente demonstrar a recusa.
