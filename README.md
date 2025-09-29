
# 🚀 SOAT-FIAP User Application Microservice

## Visão Geral
Microserviço Node.js/TypeScript para gestão de usuários, arquitetura limpa, observabilidade e pronto para produção em Docker/Kubernetes. Métricas expostas para Prometheus/Grafana.

---

## 🧩 Arquitetura

- **Application**: Casos de uso (UseCases) e interfaces de repositório
- **Domain**: Entidades, value objects e erros de domínio
- **Infra**: Repositórios, banco (DynamoDB), middlewares, controllers REST, métricas
- **Testes**: Cobertura unitária/integrada com Jest
- **Observabilidade**: Métricas HTTP/sistema para Prometheus/Grafana
- **Deploy**: Docker/Kubernetes, CI/CD

---

## ✨ Funcionalidades

- Autenticação Local: Login e validação de token JWT
- Gestão de Usuários: CRUD completo
- Métricas: Requisições HTTP, latência, status, `/metrics` para Prometheus
- Health Check: `/health` para disponibilidade
- Swagger: `/api-docs` documentação interativa
- Testes Automatizados: Cobertura alta (>90%)
- Configuração via .env

---

## 🔗 Principais Endpoints

- `POST /api/auth/login` — Autenticação de usuário
- `POST /api/auth/validate` — Validação de token JWT
- `GET /api/users` — Listagem de usuários
- `GET /api/users/:id` — Buscar usuário por ID
- `POST /api/users` — Criar usuário
- `DELETE /api/users/:id` — Remover usuário
- `GET /metrics` — Métricas Prometheus
- `GET /health` — Health check
- `GET /api-docs` — Swagger

---

## 📊 Observabilidade

- Métricas HTTP: total, latência, status
- Métricas de sistema: CPU, memória, event loop
- Pronto para Prometheus/Grafana

---

## 🧪 Testes

- Executar: `npm run test`
- Cobertura: `npm run test -- --coverage`

---

## 🚢 Deploy

- Dockerfile e docker-compose para local
- Arquivos Kubernetes (`k8s/`) para produção

---

## ▶️ Como rodar

1. Instale dependências: `npm install`
2. Configure variáveis em `.env`
3. Suba o ambiente: `docker-compose up` ou `npm run dev`
4. Acesse endpoints conforme documentação

---
