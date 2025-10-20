<h1 id="top">case-tecnico-arkmeds</h1>

<h2>Índice</h2>

> ⚠️ **Notas Importantes**: Este projeto contém algumas decisões técnicas deliberadas e limitações de escopo. Recomendo ler a seção [Disclaimers](#disclaimers) para entender o contexto completo da implementação.

- [Quick Start](#quickstart)
- [Rodando o Projeto](#running)
  - [Live](#running_live)
  - [Localmente via Docker Compose](#running_compose)
- [Desenvolvimento](#dev)
  - [Rodando em Dev](#dev_run)
  - [Executando testes](#dev_test)
- [Projeto](#project)
  - [Estrutura](#project_structure)
    - [Arquitetura Limpa](#project_structure_clean)
    - [Monolito ao invés de Microsserviços](#project_structure_monolith)
  - [Tecnologias](#project_tech)
  - [Variáveis de Ambiente](#project_env)
  - [Requisitos Técnicos](#project_technical_requirements)
    - [Arquitetura Limpa](#project_technical_requirements_clean)
    - [Padrões de Projeto](#project_technical_requirements_patterns)
    - [Testes](#project_technical_requirements_tests)
  - [Requisitos Funcionais](#project_functional_requirements)
    - [Como funcionam internamente](#project_functional_requirements_internals)
- [Disclaimers](#disclaimers)
  - [Domínio aparentemente "incompleto"](#disclaimers_domain)
  - [Operações sem Error Handling](#disclaimers_errors)
  - [Uso de Tecnologia](#disclaimers_tech)
  - [AI](#disclaimers_ai)

---

<h2 id="quickstart">Quick Start <a href="#top" title="voltar ao topo">🔝</a></h2>

```bash
# Clonar o repositório
git clone git@github.com:mkvlrn/case-tecnico-arkmeds.git
cd case-tecnico-arkmeds

# Rodar com Docker Compose (recomendado)
docker-compose up -d

# Acessar documentação
open http://localhost:4000/docs

# Acessar recibos após criados
open http://localhost:4000/tmp
```

Mais detalhes abaixo, em [Rodando o Projeto](#running).

---

<h2 id="running">Rodando o Projeto <a href="#top" title="voltar ao topo">🔝</a></h2>

<h3 id="running_live">Live <a href="#top" title="voltar ao topo">🔝</a></h3>

Documentação: https://case-tecnico-arkmeds-mkvlrn.up.railway.app/docs

Coleção Insomnia: [insomnia.yaml](./insomnia.yaml)

Listagem de recibos: https://case-tecnico-arkmeds-mkvlrn.up.railway.app/tmp

**Preview da documentação:**

A API possui documentação interativa completa usando [Scalar](https://github.com/scalar/scalar), oferecendo uma interface moderna e intuitiva para explorar e testar todos os endpoints diretamente no navegador.

![Documentação Principal](./docs/scalar-main.png)
_Página principal com todos os endpoints organizados por tags_

![Detalhe do Endpoint](./docs/scalar-request.png)
_Visualização detalhada com validações, exemplos e interface de teste_

<h3 id="running_compose">Localmente via Docker Compose <a href="#top" title="voltar ao topo">🔝</a></h3>

Requisitos:

- Docker (desenvolvido com v28.5.1, build e180ab8ab8)
- Ambiente capaz de rodar imagens Docker criadas em Linux
- Portas livres/abertas:
  - 4000 (aplicação)
  - 5432 (Postgres)
  - 5672 (RabbitMQ)
  - 6379 (Redis)

Imagens necessárias:

| Imagem                      | Tag            | Tamanho de Download | Tamanho em Disco |
| --------------------------- | -------------- | ------------------- | ---------------- |
| postgres                    | `18.0-alpine`  | _~106MB_            | _~280MB_         |
| redis                       | `8.2.2-alpine` | _~26MB_             | _~71MB_          |
| rabbitmq                    | `4.1.4-alpine` | _~78MB_             | _~160MB_         |
| mkvlrn/case-tecnico-arkmeds | `latest`       | _~590MB_            | _~661MB_         |

Recomendo fazer pull antes de iniciar:

```bash
docker-compose pull
```

E para rodar:

```bash
docker-compose up -d
```

Documentação: http://localhost:4000/docs

Coleção Insomnia: [insomnia.yaml](./insomnia.yaml)

Listagem de recibos: http://localhost:4000/tmp

---

<h2 id="dev">Desenvolvimento <a href="#top" title="voltar ao topo">🔝</a></h2>

Requisitos:

- Docker (desenvolvido com v28.5.1, build e180ab8ab8)
- Node.js LTS (desenvolvido com v22.20.0)
- npm (desenvolvido com v11.6.2)
- Ambiente capaz de rodar imagens Docker criadas em Linux
- Portas livres/abertas:
  - 4000 (aplicação)
  - 5432 (Postgres)
  - 5672 (RabbitMQ)
  - 6379 (Redis)

Imagens necessárias:

| Imagem   | Tag            | Tamanho de Download | Tamanho em Disco |
| -------- | -------------- | ------------------- | ---------------- |
| postgres | `18.0-alpine`  | _~106MB_            | _~280MB_         |
| redis    | `8.2.2-alpine` | _~26MB_             | _~71MB_          |
| rabbitmq | `4.1.4-alpine` | _~78MB_             | _~160MB_         |

<h3 id="dev_run">Rodando em Dev <a href="#top" title="voltar ao topo">🔝</a></h3>

Faça pull das imagens necessárias:

```bash
docker-compose pull postgres redis rabbitmq
```

Inicie os containers:

```bash
docker-compose up postgres redis rabbitmq -d
```

Instale as dependências:

```bash
npm install
```

Inicie a aplicação:

```bash
npm run dev
```

Documentação: http://localhost:4000/docs

Coleção Insomnia: [insomnia.yaml](./insomnia.yaml)

Listagem de recibos: http://localhost:4000/tmp

<h3 id="dev_test">Executando testes <a href="#top" title="voltar ao topo">🔝</a></h3>

Siga todos os passos de [Rodando em Dev](#dev_run) até a instalação de dependências, então:

Para testes unitários e de integração:

```bash
npm run test
```

E testes e2e junto aos anteriores:

```bash
npm run test-e2e
```

Mais detalhes sobre os testes em [Testes](#project_technical_requirements_tests).

---

<h2 id="project">Projeto <a href="#top" title="voltar ao topo">🔝</a></h2>

<h3 id="project_structure">Estrutura <a href="#top" title="voltar ao topo">🔝</a></h3>

<h4 id="project_structure_clean">Arquitetura Limpa <a href="#top" title="voltar ao topo">🔝</a></h4>

Nunca vai existir um acordo completo entre desenvolvedores sobre como organizar código, mas a estrutura escolhida busca um equilíbrio entre simplicidade e clareza.

É minimalista, se comparada com estruturas demonstradas em grandes cursos/tutoriais ou projetos corporativos, mas acho que consegui encontrar um bom equilíbrio entre simplicidade e organização.

<h4 id="project_structure_monolith">Monolito ao invés de Microsserviços <a href="#top" title="voltar ao topo">🔝</a></h4>

Separar a API e o processamento de trips em microsserviços seria uma alternativa válida. Porém, um monolito é igualmente viável para um projeto deste tamanho, sendo possivelmente mais fácil de manter e entender.

<h3 id="project_tech">Tecnologias <a href="#top" title="voltar ao topo">🔝</a></h3>

Foram utilizadas as tecnologias previstas no documento do projeto, com outras sendo utilizadas, quando não existia uma determinação, a meu critério. Aqui segue uma listagem não exaustiva:

- Geral
  - [node](https://github.com/nodejs/node)
  - [typescript](https://github.com/microsoft/TypeScript)
  - [tsx](https://github.com/privatenumber/tsx) - executor de typescript
  - [awilix](https://github.com/jeffijoe/awilix) - container de DI
  - [varlock](https://github.com/dmno-dev/varlock) - gerenciamento de variáveis de ambiente
- Qualidade/Testes
  - [biome](https://github.com/biomejs/biome) - linter e formatter de código
  - [commitlint](https://github.com/conventional-changelog/commitlint) - linter de mensagens de commit
  - [husky](https://github.com/typicode/husky) - hooks de git
  - [lint-staged](https://github.com/lint-staged/lint-staged) - execução de tasks de qualidade junto aos hooks de git
  - [jest](https://github.com/jestjs/jest) - testes
  - [testcontainers](https://github.com/testcontainers) - containers para garantir resiliência em cenários reais durante testes de integração e e2e
- API
  - [express](https://github.com/expressjs/express) - framework de api
  - [postgres](https://www.postgresql.org) - banco para persistência de drivers e passengers
  - [redis](https://redis.io/) - persistência efêmera de fares
  - [rabbitmq](https://www.rabbitmq.com/) - broker de mensagens para criação de recibos de forma assíncrona
  - [scalar](https://github.com/scalar/scalar) - documentação e referência de api
  - [zod](https://github.com/colinhacks/zod) - validação de dados através de schemas
- Infra
  - [prisma](https://github.com/prisma/prisma) - orm para interação entre a API e o banco de dados
  - [@redis/client](https://github.com/redis/node-redis) - interação com o redis
  - [amqplib](https://github.com/amqp-node/amqplib) - interação com o rabbitmq

<h3 id="project_env">Variáveis de ambiente <a href="#top" title="voltar ao topo">🔝</a></h3>

O projeto usa [varlock](https://github.com/dmno-dev/varlock) para gerenciamento de variáveis de ambiente com defaults inteligentes:

**Funcionamento:**

- **Desenvolvimento**: valores padrão do `.env.schema` são usados automaticamente
- **Produção**: variáveis injetadas pelo ambiente sobrescrevem os padrões
- **Tipos**: geração automática de types TypeScript em `env.d.ts`
- **Validação**: tipos e constraints são validados em runtime

**Sobre Credenciais:**

Os valores como `postgres://postgres:postgres@localhost:5432/db` no schema são **apenas padrões de desenvolvimento**. Eles funcionam out-of-the-box com o docker-compose local e são substituídos por credenciais reais em produção (via Railway, Kubernetes, Docker secrets, etc).

Não é necessário criar arquivo `.env` para rodar localmente - o setup funciona imediatamente após o `docker-compose up`.

Se alguma variável não estiver definida, o projeto irá falhar ao iniciar.

**Variáveis disponíveis:**

| variável       | tipo            | padrão                                           | descrição                     |
| -------------- | --------------- | ------------------------------------------------ | ----------------------------- |
| `PORT`         | number          | `4000`                                           | Porta da aplicação            |
| `DATABASE_URL` | string          | `postgres://postgres:postgres@localhost:5432/db` | Connection string do postgres |
| `REDIS_URL`    | string          | `redis://localhost:6379`                         | Connection string do redis    |
| `BROKER_URL`   | string          | `amqp://localhost:5672`                          | Connection string do rabbitmq |
| `FARE_TTL`     | number          | `300`                                            | TTL das fares em segundos     |
| `RECEIPT_DIR`  | string          | `./tmp`                                          | Diretório para salvar recibos |
| `API_ENV`      | `dev` \| `prod` | `dev`                                            | Ambiente do server em `/docs` |

<h3 id="project_technical_requirements">Requisitos Técnicos <a href="#top" title="voltar ao topo">🔝</a></h3>

<h4 id="project_technical_requirements_clean">Arquitetura Limpa <a href="#top" title="voltar ao topo">🔝</a></h4>

Como [já descrito acima](#project_structure_clean), usei uma arquitetura limpa de acordo com meu conhecimento teórico e alguma experiência prática; não foram muitos os projetos onde clean arch foi usada, mas eu entendo muito bem o conceito e a importância dele.

<h4 id="project_technical_requirements_patterns">Padrões de Projeto <a href="#top" title="voltar ao topo">🔝</a></h4>

**Padrões Criacionais:**

- **Factory**: usado na função `createCrudRouter` que cria routers do express com configurações padronizadas e middlewares de validação aplicados automaticamente
- **Singleton**: aplicado junto ao container de DI
- **Dependency Injection / IoC Container**: implementado com awilix para configuração e gerenciamento de dependências em toda a aplicação

**Padrões Estruturais:**

- **Adapter**: implementado nos controllers base que adaptam use cases do domínio (lógica de negócio pura) para a interface http/express, e também para a interface de comunicação com o banco de dados
- **Repository**: interfaces de repositório abstratas foram criadas, com implementações concretas para diferentes tecnologias de persistência

**Padrões Comportamentais:**

- **Strategy**: implementado no sistema de cálculo de tarifas com diferentes estratégias baseadas em horário e dia da semana
- **Template Method**: implementado em classes base abstratas como `CreateUserBaseUseCase` que definem o fluxo algorítmico comum para operações CRUD de usuários, permitindo reutilização de lógica enquanto subclasses customizam partes específicas
- **Command**: usado nos use cases (`CreateTripUseCase`, `CreateFareUseCase`, etc.) que encapsulam comandos de negócio completos com validação e orquestração de dependências
- **Observer**: implementado através da interface `TripNotifier` com implementação `TripAmqpPublish` para notificações assíncronas de criação de viagens via amqp
- **Middleware**: usado na camada de API com middlewares express para validação, tratamento de erros e outras interceptações de requisições http de forma modular e componentizada

**Padrões de Tratamento de Erros:**

- **Result**: implementado um tipo `Result<T, E>` para tratamento de erros sem exceptions, propagando erros de forma segura e explícita em toda a aplicação, especialmente em use cases e repositórios; é _absolutamente_ a parte mais interessante de linguagens como rust e go (e programação funcional como um todo) que obrigatoriamente uso em _todos_ os meus projetos

<h4 id="project_technical_requirements_tests">Testes <a href="#top" title="voltar ao topo">🔝</a></h4>

Testes unitários e de integração foram escritos para todos os use cases, repositórios e controllers, além de testes de integração e e2e para a API.

Arquivos de produção e de testes foram criados e persistidos no Git de acordo com o que dita o TDD; os testes e2e foram criados após a conclusão de cada feature, para garantir que ela está funcionando corretamente.

Os testes unitários e integração (que não fazem uso de testcontainers) deixam de fora da cobertura alguns arquivos, porém os testes e2e (que são um pouco mais pesados de se executar) cobrem toda a aplicação, _100% se for deixado de fora o `main.ts`_.

Na configuração do Jest alguns arquivos foram deliberadamente excluídos da contagem, com motivo de cada grupo comentado:

```ts
coveragePathIgnorePatterns: [
  "generated/", // prisma generated code
  ".*(test|spec).ts", // test files
  ".*(model|repository|notifier|consumer|types).ts", // interfaces
  ".*fixtures.ts", // fixture files don't have production code
  "setup.ts", // not production code
],
```

<h3 id="project_functional_requirements">Requisitos Funcionais <a href="#top" title="voltar ao topo">🔝</a></h3>

Os endpoints solicitados foram criados (com pequenas alterações em nome para se adequarem ao padrão REST).

Use a documentação própria do projeto (recomendado) em `/docs` para conferir tudo, mas também há a coleção do Insomnia, criada a partir do [documento de especificação OpenAPI](./openapi.json); eu realmente não uso Postman ou Insomnia por terem se tornado _extremamente_ bloated, terríveis de se usar.

- `/drivers` (pluralizando a recomendação do documento do case)
  - `POST /drivers`
  - `GET /drivers`
  - `GET /drivers/:id`
  - `PUT /drivers/:id`
  - `DELETE /drivers/:id`
- `/passengers` (pluralizando a recomendação do documento do case)
  - `POST /passengers`
  - `GET /passengers`
  - `GET /passengers/:id`
  - `PUT /passengers/:id`
  - `DELETE /passengers/:id`
- `/fares` (pluralizando a recomendação do documento do case)
  - `POST /fares`
- `/trips` (alterando "race" para "trip" e pluralizando)
  - `POST /trips`

Validações foram executadas em todos os endpoints de acordo com o documento do projeto.

Além disso, os endpoints para documentação, spec OpenAPI, e listagem do diretório de recibos também estão disponíveis (mas não documentados em `/docs`, é uma limitação do Scalar):

- `GET /docs`
- `GET /openapi.json`
- `GET /tmp`

<h4 id="project_functional_requirements_internals">Como funcionam internamente <a href="#top" title="voltar ao topo">🔝</a></h4>

**CRUD de Drivers e Passengers:**

Ambas as entidades seguem o padrão CRUD completo com validação de dados via Zod schemas. CPFs são validados e não podem ser duplicados. Drivers devem ter pelo menos 18 anos e passengers pelo menos 15 anos. Todas as operações de listagem são paginadas (10 itens por página) e os dados são persistidos no PostgreSQL via Prisma ORM.

**Criação de Fares:**

O sistema calcula o preço baseado na distância, horário e dia da semana, gerando um `requestId` único. A fare fica armazenada temporariamente no Redis com TTL configurável (padrão 5 minutos).

**Criação de Trips:**

Ao criar uma viagem, o sistema valida se o passageiro e a fare existem, então **seleciona aleatoriamente um motorista disponível** do banco de dados. Se não houver motoristas cadastrados, retorna erro 503. A trip é criada com os dados da fare e o motorista selecionado, **a fare é removida do cache para evitar reutilização**, e um recibo é gerado assincronamente via message broker.

_Nota: a seleção de motorista é completamente aleatória (`ORDER BY RANDOM()`) - não há lógica de proximidade geográfica real implementada._

---

<h2 id="disclaimers">Disclaimers <a href="#top" title="voltar ao topo">🔝</a></h2>

<h3 id="disclaimers_domain">Domínio aparentemente "incompleto" <a href="#top" title="voltar ao topo">🔝</a></h3>

Eu sei que a implementação peca em um fator importante: a lógica de criação de trips simplesmente pede o `passengerId` e o `requestId` no corpo do request, o que é _absurdo_, mas eu escolhi não criar um sistema de autenticação para permitir envio de ID através de headers por questão de tempo - iria levar alguns dias a mais para fazer tudo certo.

<h3 id="disclaimers_errors">Operações sem Error Handling <a href="#top" title="voltar ao topo">🔝</a></h3>

A notificação da criação de trips é "fire and forget" deliberadamente. O retorno para o usuário é imediato, mas não fiz tratamento de erro no caso de problemas com o broker de mensagens. Novamente, o constraint foi tempo hábil.

<h3 id="disclaimers_tech">Uso de Tecnologia <a href="#top" title="voltar ao topo">🔝</a></h3>

Faz anos que não uso Express diretamente em aplicações; NestJS tem sido a escolha usual. Porém, a transição foi direta dada a similaridade entre os frameworks.

Mas acontece que há algumas outras tecnologias que eu realmente não uso há muito tempo: Jest sendo a principal. Tenho usado Vitest desde sempre, e como a API de utilização é extremamente igual, vi como um upgrade, assim como muitos outros devs. Então confesso que tive uma certa dificuldade em configurar (não em usar, o uso foi 99% idêntico ao uso de Vitest) o projeto para funcionar com TypeScript e ESM. Mas funcionou, no fim.

<h3 id="disclaimers_ai">AI <a href="#top" title="voltar ao topo">🔝</a></h3>

Finalmente, acho que devo informar que fiz uso de LLM em dois pontos:

1. Criar os fixtures dos testes e2e partindo de um fixture inicial
2. Criar o spec OpenAPI

Como podem ver pelo tamanho dos arquivos em questão, eu decidi acionar os robôs para me ajudarem a completar essas tarefas. TODOS os fixtures e TODA a documentação OpenAPI foram conferidos e ajustados, então não há absolutamente nada no projeto que eu não saiba o motivo ou como foi implementado.

Realmente não sou fã do uso de AI para tarefas de pensamento crítico e criação de lógica - mas negar que é útil para criação de boilerplate repetitivo (como no caso dos fixtures ou do spec OpenAPI) é um erro.
