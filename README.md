# Conecta Voluntários

Protótipo web acadêmico para divulgar oportunidades de voluntariado e registrar inscrições demonstrativas. Desenvolvido para praticar **Gestão de Configuração de Software (GCS)**, Git, GitHub, revisão por pares e ambientes protegidos, conforme a Aula 1 do projeto de referência ONGConecta.

> **Atenção:** aplicação de demonstração. Não é uma ONG real. Inscrições são gravadas somente no `localStorage` do navegador; não existe envio de dados a um servidor.

## Funcionalidades

- Listar e pesquisar oportunidades de voluntariado.
- Registrar interesse com validação do nome e da atividade.
- Contabilizar e remover inscrições locais.
- Executar testes automatizados das regras de negócio.
- Demonstrar o bloqueio de `push` direto na branch `main` e a aprovação de ambiente `production`.

## Stack e execução

**Node.js 20+**, HTML, CSS, JavaScript (módulos ES), npm, Node Test Runner e GitHub Actions. Não há pacotes de terceiros em runtime.

```bash
npm ci
npm run check
npm test
npm start
```

Acesse **http://localhost:3000**. Porta alternativa: `PORT=4000 npm start`.

## Estrutura do repositório

```text
conecta-voluntarios/
├── .github/
│   ├── workflows/              # testes e demonstração de gate production
│   ├── ISSUE_TEMPLATE/         # sugestões e defeitos
│   ├── CODEOWNERS              # responsável pelo projeto
│   └── pull_request_template.md
├── docs/
│   ├── PLANO_GCS.md            # plano adaptado a ESTE projeto
│   ├── Plano_GCS_DevOps_ONGConectaR.pdf  # referência fornecida
│   ├── EVIDENCIAS_AULA_1.md    # checklist e evidências
│   ├── ROTEIRO_ENTREGA.md      # instruções Arch Linux/GitHub
│   └── evidencias/             # prova real de push bloqueado
├── scripts/                    # configuração e teste de proteção
├── src/                        # regras de negócio e interface
├── tests/                      # testes automatizados
├── index.html                  # página do protótipo
├── styles.css                  # estilos responsivos
├── server.mjs                  # servidor de desenvolvimento
├── package.json
├── package-lock.json
├── .gitignore
├── .gitattributes
└── .env.example
```

## Como entregar a Aula 1

Leia **[docs/ROTEIRO_ENTREGA.md](docs/ROTEIRO_ENTREGA.md)** e siga a sequência, especialmente **publicar tudo antes de proteger a `main`**. O plano está em **[docs/PLANO_GCS.md](docs/PLANO_GCS.md)**.

O GitHub Free permite proteção de branch e Required reviewers em Environments para **repositórios públicos**. Você precisa de **outro usuário GitHub** que aceite o convite de colaborador e aprove seu PR. Você não consegue aprovar o próprio Pull Request.

## Fluxo de colaboração

`Issue → feature/* ou docs/* → commit → push da branch → Pull Request → CI → revisão de colega → squash merge na main`

Convenção de commits: `feat`, `fix`, `docs`, `test`, `chore`.

## Ambientes

- **staging:** simulação de homologação, sem aprovação manual.
- **production:** simulação de aprovação obrigatória do dono do repositório. O workflow demonstrativo **não realiza deploy real**.

## Fonte acadêmica

Projeto de referência: https://github.com/lzcamargo/ongconecta  
Enunciado da Aula 1: https://github.com/lzcamargo/ongconecta/blob/main/docs/aulas/aula-1-repositorio.md

O plano original em PDF foi anexado ao repositório como item de configuração de referência, e o plano em Markdown documenta as decisões implementadas neste projeto.
