# Plano de Gerenciamento de Configuração de Software (GCS)

**Projeto:** Conecta Voluntários — protótipo acadêmico de oportunidades de voluntariado  
**Versão:** 1.0  
**Data:** 09/11/2026  
**Responsável pela GCS:** proprietário(a) do repositório GitHub  
**Modelo:** GitHub Flow / DevOps, com revisão por pares

> **Base adotada:** documento `docs/Plano_GCS_DevOps_ONGConectaR.pdf`, fornecido como referência para a disciplina. Este Markdown adapta as seções ao projeto concreto. O PDF continua versionado como item de configuração de referência, não como prova de execução de controles no GitHub.

## 1. Objetivo e escopo

Definir procedimentos de identificação, versionamento, revisão, auditoria e liberação do Conecta Voluntários. O sistema é um protótipo web que apresenta oportunidades de voluntariado e permite registrar inscrições apenas no armazenamento local do navegador. Não há backend, banco de dados remoto ou publicação de informações pessoais.

O plano se aplica a código, testes, arquivos de configuração, documentação e scripts de automação. Alterações são rastreadas por commits e Pull Requests.

## 2. Papéis e responsabilidades

| Papel | Responsabilidade |
|---|---|
| Desenvolvedor líder / proprietário do repositório | Priorizar mudanças, manter repositório e plano de GCS, revisar configuração de ambientes e autorizar produção |
| Par de revisão (outro usuário GitHub) | Receber permissão de escrita, revisar Pull Requests e registrar aprovação antes do merge |
| GitHub Actions | Executar automaticamente as verificações sintáticas e os testes automatizados em Pull Requests |

A pessoa que propõe a alteração não aprova seu próprio Pull Request. O colega de revisão deve aceitar o convite de colaborador.

## 3. Ferramentas e infraestrutura

- Git + GitHub: controle de versão e histórico.
- GitHub Issues e Pull Requests: solicitação, revisão e aprovação de mudanças.
- GitHub Actions: execução de `npm ci`, `npm run check` e `npm test`.
- Node.js 20+ / npm: servidor estático demonstrativo e testes com ferramentas nativas, sem dependências externas.
- GitHub Environments: `staging` (homologação) e `production` (produção com aprovador obrigatório).

O workflow de ambientes incluído nesta atividade é **uma simulação controlada do gate**; ele não publica a aplicação em um servidor. O deploy real poderá ser incorporado em aula posterior.

## 4. Identificação dos itens de configuração

| Item de configuração | Local | Controle |
|---|---|---|
| Aplicação web | `index.html`, `styles.css`, `src/` | Git + PR |
| Servidor de desenvolvimento | `server.mjs` | Git + PR |
| Testes automatizados | `tests/` | Git + CI |
| Dependências e scripts npm | `package.json`, `package-lock.json` | Git + revisão |
| Templates e automações | `.github/` | Git + revisão |
| Scripts administrativos | `scripts/` | Git + revisão |
| Plano de GCS e referências | `docs/PLANO_GCS.md` e PDF anexo | Git + revisão |
| Evidências da atividade | `docs/evidencias/` | Git + PR |
| Variáveis ilustrativas | `.env.example` | Git, sem credenciais |

**Não versionar:** `.env`, senhas, tokens, `node_modules`, builds gerados e dados reais de usuários.

## 5. Estratégia de branches e versionamento

- `main`: branch protegida; não aceita `push` direto, inclusive do administrador.
- `feature/<descricao>`: implementação de funcionalidade.
- `fix/<descricao>`: correção de defeito.
- `docs/<descricao>`: documentação e evidências.
- Releases futuros: `vMAJOR.MINOR.PATCH` (SemVer).

**Padrão de commit:** Conventional Commits, por exemplo `feat(web): adiciona filtro por atividade`, `fix(core): corrige validação` e `docs: registra evidência do bloqueio`.

## 6. Controle de mudanças e revisão

1. Abrir uma Issue ou descrever a mudança no PR.
2. Criar uma branch a partir da `main` atualizada.
3. Implementar e executar localmente `npm run check` e `npm test`.
4. Enviar a branch e abrir Pull Request para `main`.
5. Solicitar aprovação do par com permissão Write.
6. Integrar por **squash merge** somente após **1 aprovação válida**.
7. Registrar evidência e histórico no GitHub.

A regra da `main` exige PR, uma aprovação, invalidação de aprovações obsoletas, histórico linear e aplicação aos administradores. O requisito de *status checks obrigatórios* poderá ser adicionado na Aula 2, depois que os checks estiverem disponíveis.

## 7. Ambientes

| Ambiente | Critério de entrada | Aprovação |
|---|---|---|
| `staging` | Branch protegida | Sem aprovador manual obrigatório |
| `production` | Branch protegida, após estágio anterior | **Proprietário como required reviewer**, sem Prevent self-review |

O ambiente de produção usa uma aprovação manual com GitHub Actions. Para a atividade, ela é testada pelo workflow `Demonstracao - aprovacao de ambientes`.

## 8. Garantia de qualidade

Critérios atuais e verificáveis:

- Ausência de erro sintático nos arquivos JavaScript verificados.
- Testes de validação de inscrições e busca de oportunidades aprovados.
- Arquivos de projeto e dependências versionados.
- Revisão humana para ingresso de mudanças na `main`.
- Proibição de commit de segredos e informações pessoais reais.

Cobertura mínima de 60%, scanner de dependências e outros gates são objetivos de evolução, não alegações de implantação concluída nesta Aula 1.

## 9. Baselines, auditoria e mudanças emergenciais

A baseline inicial corresponde ao commit de publicação do protótipo. Releases formais futuras receberão tags SemVer. As evidências de auditoria são o histórico de Git, PRs, logs do GitHub Actions, configurações de branch protection e de Environments.

Correções emergenciais seguem preferencialmente `fix/<descricao>` + PR + aprovação. Mudanças de alto risco exigem avaliação adicional do proprietário e do revisor. Não utilizar `--force` na `main`.

## 10. Verificação de conformidade da Aula 1

Verificar o checklist em `docs/EVIDENCIAS_AULA_1.md` e o roteiro de execução em `docs/ROTEIRO_ENTREGA.md`. A existência de scripts e deste documento **não substitui** a necessidade de configurar o GitHub real e comprovar o push rejeitado.

## Referências

- Plano de GCS fornecido: `Plano_GCS_DevOps_ONGConectaR.pdf` (14 páginas), presente em `docs/`.
- ONGConecta (projeto de referência): https://github.com/lzcamargo/ongconecta
- Aula 1: https://github.com/lzcamargo/ongconecta/blob/main/docs/aulas/aula-1-repositorio.md
- GitHub Docs — Protected branches e Environments: https://docs.github.com/
