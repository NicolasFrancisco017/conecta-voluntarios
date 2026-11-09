#!/usr/bin/env bash
# Executar após publicar o primeiro commit na main e ter autenticado com gh.
# Uso: bash scripts/configurar-github.sh NOME_DO_COLEGA
set -euo pipefail

COLEGA="${1:-}"
if [[ -z "$COLEGA" ]]; then
  echo 'Uso: bash scripts/configurar-github.sh USUARIO_GITHUB_DO_COLEGA' >&2
  exit 2
fi

for comando in gh git; do
  command -v "$comando" >/dev/null || { echo "Falta instalar: $comando" >&2; exit 1; }
done

gh auth status >/dev/null
REPO="$(gh repo view --json nameWithOwner --jq '.nameWithOwner')"
LIDER="$(gh api user --jq '.login')"
LIDER_ID="$(gh api user --jq '.id')"
DONO="${REPO%%/*}"
NOME="${REPO#*/}"

if [[ "${DONO,,}" != "${LIDER,,}" || "$NOME" != 'conecta-voluntarios' ]]; then
  echo "Por segurança, este script só configura $LIDER/conecta-voluntarios; repositório atual: $REPO" >&2
  exit 1
fi
if [[ "${COLEGA,,}" == "${LIDER,,}" ]]; then
  echo 'O par de revisão precisa ser outra pessoa.' >&2
  exit 1
fi
if [[ "$(gh repo view --json visibility --jq '.visibility')" != 'PUBLIC' ]]; then
  echo 'O repositório precisa estar PUBLIC para as proteções e os revisores de ambiente no GitHub Free.' >&2
  exit 1
fi

gh api "repos/$REPO/branches/main" >/dev/null
printf 'Configurando %s\nVocê: %s\nPar de revisão: %s\n' "$REPO" "$LIDER" "$COLEGA"

# Repositório: merges apenas por squash, histórico linear e exclusão da branch após merge.
echo '[1/4] Configurando merge por squash...'
gh api -X PATCH "repos/$REPO" \
  -F allow_squash_merge=true \
  -F allow_merge_commit=false \
  -F allow_rebase_merge=false \
  -F delete_branch_on_merge=true \
  -f squash_merge_commit_title=PR_TITLE \
  -f squash_merge_commit_message=PR_BODY >/dev/null

# O convite será pendente até o colega aceitar.
echo '[2/4] Convidando o par como colaborador com escrita (Write)...'
gh api -X PUT "repos/$REPO/collaborators/$COLEGA" -f permission=push >/dev/null

# Aula 1: não exigir status checks ainda; na Aula 2 os checks serão adicionados.
echo '[3/4] Protegendo a branch main...'
gh api -X PUT "repos/$REPO/branches/main/protection" --input - >/dev/null <<'JSON'
{
  "required_status_checks": null,
  "enforce_admins": true,
  "required_pull_request_reviews": {
    "dismiss_stale_reviews": true,
    "require_code_owner_reviews": false,
    "required_approving_review_count": 1
  },
  "restrictions": null,
  "required_linear_history": true,
  "allow_force_pushes": false,
  "allow_deletions": false,
  "required_conversation_resolution": false
}
JSON

# Gate de produção exige aprovação manual do dono, mesmo que tenha acionado o workflow.
echo '[4/4] Criando staging e production...'
gh api -X PUT "repos/$REPO/environments/staging" --input - >/dev/null <<'JSON'
{
  "deployment_branch_policy": {
    "protected_branches": true,
    "custom_branch_policies": false
  }
}
JSON

gh api -X PUT "repos/$REPO/environments/production" --input - >/dev/null <<JSON
{
  "wait_timer": 0,
  "prevent_self_review": false,
  "reviewers": [{"type": "User", "id": ${LIDER_ID}}],
  "deployment_branch_policy": {
    "protected_branches": true,
    "custom_branch_policies": false
  }
}
JSON

printf '\nConfiguração enviada. Verifique:\n'
printf '  https://github.com/%s/settings/branches\n' "$REPO"
printf '  https://github.com/%s/settings/environments\n' "$REPO"
printf '  https://github.com/%s/settings/access\n' "$REPO"
printf '\nIMPORTANTE: o colega deve aceitar o convite de colaboração.\n'
printf 'IMPORTANTE: o workflow de produção é só uma SIMULAÇÃO de aprovação, não faz deploy real.\n'
