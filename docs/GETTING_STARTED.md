# 环境搭建与启动指南

## 1. 前置条件

| 组件 | 版本 | 必需性 | 说明 |
| --- | --- | --- | --- |
| JDK | 21 | 必需 | 后端编译运行 |
| Maven | 3.9+ | 必需 | 后端构建 |
| Node.js | 18+（推荐 20 LTS） | 必需 | 前端构建 |
| MySQL | 8.0+ | 必需 | 业务库 |
| Redis | 7.x | 必需 | 缓存、限流 |
| RabbitMQ | 3.x | 推荐 | 异步消息 |
| MinIO | 最新 | 推荐 | 对象存储 |
| Nacos | 2.x | 必需（RPC） | Dubbo 注册中心 |
| FISCO BCOS | 3.x | 可选 | 区块链存证（不启动则存证功能不可用） |
| Python | 3.10+ | 可选 | 联邦学习 / 微调实验 |

可用 Docker Compose 快速拉起基础设施（示例）：

```yaml
# docker-compose.infra.yml
services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: root
    ports: ["3306:3306"]
  redis:
    image: redis:7
    ports: ["6379:6379"]
  rabbitmq:
    image: rabbitmq:3-management
    ports: ["5672:5672", "15672:15672"]
  minio:
    image: minio/minio
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: minioadmin
    ports: ["9000:9000", "9001:9001"]
  nacos:
    image: nacos/nacos-server:v2.3.0
    environment:
      MODE: standalone
    ports: ["8848:8848"]
```

## 2. 数据库初始化

```bash
mysql -u root -p -e "CREATE DATABASE RecordPlatform DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;"

mysql -u root -p RecordPlatform < platform-backend/db/migration/V1.0_Entity.sql
mysql -u root -p RecordPlatform < platform-backend/db/migration/V1.0_Operation_Log.sql
mysql -u root -p RecordPlatform < platform-backend/db/migration/V1.0_Audit.sql
```

> `V1.0_Audit.sql` 中包含 MySQL 事件调度器相关定义，若需启用事件请先执行：
> `SET GLOBAL event_scheduler = ON;`

## 3. 后端

### 3.1 安装共享 Dubbo 接口

本工程通过 Dubbo 调用底座服务，依赖 `cn.flying:platform-api`。该模块位于协作仓库：

```bash
git clone https://github.com/SoarCollab/RecordPlatform.git
mvn -f RecordPlatform/platform-api/pom.xml clean install -DskipTests
```

### 3.2 配置文件

`platform-backend/backend-web/src/main/resources/` 下：

| 文件 | 说明 |
| --- | --- |
| `application.yml` | 公共配置（JWT、限流、MyBatis-Plus、Knife4j、ID 安全），默认 `spring.profiles.active: local` |
| `application-prod.yml` | 生产配置：端口 80、context-path `/record-platform`、MySQL / Redis / RabbitMQ / MinIO / Dubbo |
| `application-local.yml` | 本地开发配置（已提供模板，按本机环境修改账号密码即可） |

敏感信息统一通过占位符注入，推荐用环境变量：

```bash
export SPRING_DATASOURCE_USERNAME=root
export SPRING_DATASOURCE_PASSWORD=your_password
export SPRING_MAIL_HOST=smtp.qq.com
export SPRING_MAIL_USERNAME=xxx@qq.com
export SPRING_MAIL_PASSWORD=your_auth_code
export SPRING_RABBITMQ_ADDRESSES=localhost:5672
export SPRING_RABBITMQ_USERNAME=guest
export SPRING_RABBITMQ_PASSWORD=guest
export MINIO_ACCESS_KEY=minioadmin
export MINIO_SECRET_KEY=minioadmin
export NACOS_USERNAME=nacos
export NACOS_PASSWORD=nacos
export ID_SECURITY_KEY=change-me
```

### 3.3 构建与运行

```bash
cd platform-backend
mvn clean package -DskipTests
java -jar backend-web/target/backend-web-*.jar --spring.profiles.active=local
```

启动后可访问：

- Knife4j 接口文档：<http://localhost:8080/doc.html>
- OpenAPI：<http://localhost:8080/v3/api-docs>
- 健康检查：<http://localhost:8080/actuator/health>

### 3.4 常见编译问题

| 问题 | 原因 | 处理 |
| --- | --- | --- |
| `Could not find artifact cn.flying:platform-api` | 未安装共享接口模块 | 执行 3.1 |
| `backend-common` 报 javac 路径错误 | 该模块 POM 中曾硬编码 JDK 路径 | 删除 `<executable>` 配置，或改为本机 JDK 路径 |
| Java 版本不一致 | 父 POM 为 21，部分子模块为 17 | 统一为 21 |

## 4. 前端

```bash
cd platform-frontend
npm install
npm run dev        # 开发服务器 http://localhost:8080/
npm run build      # 生产构建，产物 dist/
npm run preview    # 预览构建产物
```

Vite 已配置 `@` → `src` 别名，并按需自动引入 Element Plus 组件与图标。

若后端不在 `localhost:8080`，修改 `src/net/index.js` 中的 `axios` `baseURL`。

### 部署到 Netlify / Vercel

```bash
npm run build
# 发布目录：dist    构建命令：npm run build
```

> 单页应用需配置 history fallback 重写规则（`/* → /index.html`），否则刷新子路由会 404。

## 5. 微信小程序

1. 打开微信开发者工具 → 导入项目 → 选择 `mini-program/` 目录；
2. AppID 选择「测试号」；
3. 勾选「不校验合法域名」（当前为 Mock 数据）。

> 若要接入真实接口，请在 `app.js` 中配置 `baseUrl`，并把各页面的本地数据替换为 `wx.request` 调用。

## 6. 联邦学习 / 大模型微调（可选）

参见 [FEDERATED_LEARNING.md](./FEDERATED_LEARNING.md) 与 [LLM_FINETUNE.md](./LLM_FINETUNE.md)。
