# Psychology Healthy Platform

> An AI-powered, privacy-preserving platform for university student mental health — connecting **Family, University and Hospital** ("家校医") in one closed loop.

[简体中文](./README.md) | English

**Live demo:** <https://super-vacherin-e44237.netlify.app/>

## Overview

University mental-health data is fragmented across the campus hospital, the counseling center, faculty advisors and partner hospitals — and it is highly sensitive. This platform tackles that with three pillars:

| Pillar | What it does |
| --- | --- |
| **Personalized Federated Learning** | Institutions train locally and exchange only model parameters; raw data never leaves the institution. |
| **Blockchain Attestation (FISCO BCOS)** | File hashes and sharing authorizations are written on-chain, making assessment records tamper-proof and traceable. |
| **Domain-tuned LLM (QLoRA)** | A 1.5B model fine-tuned with 4-bit QLoRA (0.27% trainable params) for empathetic, severity-aware mental-health support. |

## Features

- **Multi-role Web console** — doctor workstation, counseling-center workstation, admin (federated model management / user management), blockchain monitor.
- **WeChat mini program** — student self-assessment & peer community, parent watchlist, advisor alert list.
- **AI report & referral** — PHQ-9 / LSAS / IAT / SAD PERSONS input, ECharts-based AI report, DSM-5 five-axis referral letter.
- **Full audit trail** — AOP operation logs, MySQL views & stored procedures for anomaly detection, Excel export.

## Tech Stack

| Layer | Stack |
| --- | --- |
| Frontend | Vue 3.4, Vue Router 4, Pinia 2, Element Plus 2.7, ECharts 5.5, Vite 5 |
| Mini program | Native WeChat Mini Program |
| Backend | Java 21, Spring Boot 3.2.11, Spring Security + JWT, MyBatis-Plus 3.5.9, Apache Dubbo 3.3.3 (Triple), Nacos |
| Storage & MQ | MySQL 8, Redis, RabbitMQ, MinIO |
| Blockchain | FISCO BCOS 3.8.0, Solidity ^0.8.11 |
| ML | PFLlib (PyTorch) for FL; Transformers + PEFT + bitsandbytes for QLoRA |

## Repository Layout

```
platform-frontend/   Vue 3 web console
platform-backend/    Spring Boot 3 multi-module backend (web/service/dao/api/common + db migrations)
mini-program/        WeChat mini program
llm-finetune/        QLoRA scripts + mental-health instruction dataset
federated-learning/  Federated learning reproduction notes
docs/                Architecture, database, API, blockchain, FL, LLM docs
```

## Quick Start

```bash
# Frontend
cd platform-frontend && npm install && npm run dev      # http://localhost:8080

# Backend (requires platform-api installed first)
git clone https://github.com/SoarCollab/RecordPlatform.git
mvn -f RecordPlatform/platform-api/pom.xml clean install -DskipTests
cd platform-backend && mvn clean package -DskipTests
java -jar backend-web/target/backend-web-*.jar --spring.profiles.active=local
```

Initialize the database with the scripts under `platform-backend/db/migration/`.
See [docs/GETTING_STARTED.md](./docs/GETTING_STARTED.md) for the full setup.

## Documentation

- [Architecture](./docs/ARCHITECTURE.md)
- [Getting Started](./docs/GETTING_STARTED.md)
- [Database Design](./docs/DATABASE.md)
- [API Reference](./docs/API.md)
- [Blockchain Attestation](./docs/BLOCKCHAIN.md)
- [Federated Learning](./docs/FEDERATED_LEARNING.md)
- [LLM Fine-tuning](./docs/LLM_FINETUNE.md)
- [Mini Program](./docs/MINI_PROGRAM.md)

## Acknowledgements

- Blockchain & distributed storage foundation derived from [SoarCollab/RecordPlatform](https://github.com/SoarCollab/RecordPlatform) (Apache-2.0).
- FL experiments based on [PFLlib](https://github.com/TsingZ0/PFLlib).
- Mental health dataset: DIU Extended Mental Health Dataset (CC BY 4.0).

## License

Apache License 2.0 — see [LICENSE](./LICENSE).
