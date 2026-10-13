# 接口速览

- 本地开发：`http://localhost:8080`
- 生产 profile（`prod`）：`http://{host}/record-platform`
- 交互式文档：Knife4j `/doc.html`、OpenAPI `/v3/api-docs`
- 鉴权：`Authorization: Bearer <jwt>`（除登录、注册、验证码外均需携带）

统一响应体由 `backend-common` 的 `RestBean` 封装，全局异常处理见 `GlobalExceptionHandler`。

## 1. 认证 `/api/auth`

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| POST | `/api/auth/login` | 账号密码登录，返回 JWT |
| GET | `/api/auth/logout` | 退出登录 |
| GET | `/api/auth/ask-code` | 申请邮箱验证码（60s 冷却） |
| POST | `/api/auth/register` | 注册 |
| POST | `/api/auth/reset-confirm` | 校验验证码 |
| POST | `/api/auth/reset-password` | 重置密码 |

## 2. 账户 `/api/user`

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/api/user/info` | 当前用户信息 |
| POST | `/api/user/modify-email` | 修改邮箱 |
| POST | `/api/user/change-password` | 修改密码 |

## 3. 文件与存证 `/api/file`

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/api/file/list` | 文件列表 |
| GET | `/api/file/page` | 分页查询 |
| DELETE | `/api/file/deleteByHash` | 按哈希删除 |
| DELETE | `/api/file/deleteById` | 按 ID 删除 |
| GET | `/api/file/address` | 获取下载地址 |
| GET | `/api/file/getTransaction` | **按交易哈希查询链上存证记录** |
| GET | `/api/file/download` | 下载（大文件走 Streams 分片） |
| POST | `/api/file/share` | 生成分享码（可设过期时间，≤30 天） |
| GET | `/api/file/getSharingFiles` | 按分享码获取分享文件 |
| POST | `/api/file/saveShareFile` | 保存分享文件到自己空间 |

## 4. 分片上传 `/api/file/uploader`

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| POST | `/start` | 初始化上传任务 |
| POST | `/chunk` | 上传分片（支持并发） |
| POST | `/complete` | 合并分片并完成存证 |
| POST | `/pause` / `/resume` / `/cancel` | 暂停 / 续传 / 取消 |
| GET | `/check` | 秒传校验（哈希命中直接完成） |
| GET | `/progress` | 上传进度 |

## 5. 图片 `/api/image`

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| POST | `/api/image/upload/avatar` | 上传头像 |
| POST | `/api/image/upload/image` | 上传图片 |
| GET | `/api/image/download/images/**` | 从 MinIO 拉取图片 |

## 6. 审计与日志（需 `ROLE_admin`）

### `/api/system/audit`

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/overview` | 审计概览 |
| GET | `/logs/page` | 日志分页 |
| GET | `/logs/{id}` | 日志详情 |
| POST | `/logs/export` | 导出 Excel（Apache POI） |
| GET | `/high-frequency` | 高频操作 |
| POST | `/sensitive/page` | 敏感操作分页 |
| GET | `/error-stats` | 错误统计 |
| GET | `/time-distribution` | 时间分布 |
| GET/POST | `/configs` | 审计配置读取 / 更新 |
| GET | `/anomalies` | 异常检测 |
| POST | `/backup` | 日志备份 |

### `/api/system/logs`

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/page` | 操作日志分页 |
| GET | `/{id}` | 详情 |
| GET | `/export` | 导出 |
| DELETE | `/clean` | 清空 |

## 7. 由底座服务提供的接口

以下接口由协作仓库的 **区块链服务（platform-fisco）** 提供，前端直接调用，不在本工程 Controller 中：

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/api/fisco/getData?AgencyId=` | 联邦任务与模型列表 |
| GET | `/api/fisco/Model?GroupId&AgencyId&File_id&Round` | 下载指定轮次的模型 |
| GET | `/api/fisco/getBlockAndTransactionNumber?GroupId=` | 区块高度与交易数 |
| GET | `/api/fisco/getLength?AgencyId=` | 机构存证数量 |
| POST | `/api/model/startTraining` | 发起新一轮联邦训练 |

## 8. 限流与错误码

| 场景 | 策略 |
| --- | --- |
| 接口限流 | 周期 3s / 阈值 50 次 / 封禁 30s（`FlowLimitingFilter`） |
| 邮件验证码 | 60s 冷却，JWT 有效期 72h |
| 参数校验失败 | 由 `ValidationController` 统一返回字段级错误 |
| 业务异常 / 系统异常 | 由 `GlobalExceptionHandler` 统一封装 |
