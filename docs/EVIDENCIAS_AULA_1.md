# Evidências da Aula 1 (preencher após configurar o GitHub)

**Repositório público:** https://github.com/NicolasFrancisco017/conecta-voluntarios  
**Par de revisão:** @USUARIO_DO_COLEGA (convite aceito / Write)  
**Data da conferência:** a preencher

## Checklist auditável

- [ ] Repositório público com README, código funcional, testes, lockfile, `.gitignore`, `.gitattributes` e `.env.example`.
- [ ] Plano de GCS em `docs/PLANO_GCS.md` e referência PDF versionada.
- [ ] `CODEOWNERS`, template de Pull Request e templates de Issues configurados.
- [ ] Colaborador convidado e convite aceito, com permissão Write.
- [ ] Merge somente por squash e exclusão de branches após merge.
- [ ] `main` com PR obrigatório, aprovação de 1 outro revisor, histórico linear, sem bypass de administradores.
- [ ] Push direto na `main` realmente recusado pelo GitHub.
- [ ] Evidência textual da recusa adicionada em `docs/evidencias/recusa-push-main.txt`.
- [ ] Ambiente `staging` criado, com branches protegidas.
- [ ] Ambiente `production` criado, com proprietário como required reviewer.
- [ ] Convite do colega aceito e PR de evidência aprovado.

## Registro do push bloqueado

Após executar `bash scripts/testar-bloqueio-main.sh`, este arquivo deve existir:

`docs/evidencias/recusa-push-main.txt`

O resultado esperado contém mensagem do GitHub sobre atualização rejeitada em branch protegida (`GH006`, `GH013` ou equivalente). Falha de autenticação/rede **não comprova** o requisito.

Tire também um print do terminal mostrando comando e mensagem de rejeição. Não edite nem simule a saída do GitHub.

## Capturas de tela sugeridas

Guarde, se desejar, prints da tela real do GitHub em `docs/evidencias/`:

1. Configuração de proteção da `main`.
2. Collaborators: colega com acesso Write (convite aceito).
3. Environments: `staging` e `production`.
4. `production`: Required reviewers com o seu usuário.
5. PR revisado e aprovado (quando concluído).

**Importante:** capturas e marcações devem refletir o estado real. Este documento é um checklist inicial, não uma certificação de que as configurações já foram aplicadas.
