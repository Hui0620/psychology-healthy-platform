# 数据库设计

建库：`CREATE DATABASE RecordPlatform DEFAULT CHARACTER SET utf8mb4;`
脚本位于 `platform-backend/db/migration/`，按 `V1.0_Entity.sql` → `V1.0_Operation_Log.sql` → `V1.0_Audit.sql` 顺序执行。

## 1. 业务实体（V1.0_Entity.sql）

### `account` — 用户账户

| 字段 | 说明 |
| --- | --- |
| `id` | 主键（雪花 ID，MyBatis-Plus `id-type: INPUT`） |
| `username` | 用户名 |
| `email` | 邮箱（用于验证码找回密码） |
| `role` | 角色：学生 / 家长 / 辅导员 / 心理咨询中心 / 医生 / 管理员 |
| `avatar` | 头像（关联 `image_store`） |
| `deleted` | 逻辑删除标记（全局逻辑删除字段） |

### `file` — 文件（心理评估记录 / 转诊单据）

| 字段 | 说明 |
| --- | --- |
| `file_hash` | 文件内容哈希，用于完整性校验 |
| `contract_hash` | 链上交易哈希，用于存证验真 |
| `status` | 上链状态（未上链 / 已上链 / 失败） |
| `origin` | 文件来源（机构） |
| `file_param` | 附加参数（如量表类型、评估轮次） |

### `image_store` — 图片存储

头像、报告配图等二进制对象的元信息。

## 2. 操作日志（V1.0_Operation_Log.sql）

### 表 `sys_operation_log`

| 字段 | 说明 |
| --- | --- |
| `module` | 业务模块 |
| `operation_type` | 操作类型（登录 / 上传 / 下载 / 删除 / 分享 …） |
| `url` / `method` | 请求地址与方法 |
| `ip` / `location` | 来源 IP |
| `params` / `response` | 入参与响应（脱敏后存储） |
| `status` / `error_msg` | 执行状态与错误信息 |
| `cost_time` | 耗时（ms） |
| `operator` / `operate_time` | 操作人与时间 |

### 视图

| 视图 | 用途 |
| --- | --- |
| `v_operation_log_stats` | 日志总体统计 |
| `v_user_operation_stats` | 按用户统计操作量 |
| `v_module_access_frequency` | 模块访问频次 |
| `v_user_stats` | 用户活跃度 |

### 存储过程

`proc_clean_old_operation_logs` — 清理过期日志（默认保留 180 天）。

## 3. 审计（V1.0_Audit.sql）

### 视图

| 视图 | 用途 |
| --- | --- |
| `v_high_frequency_operations` | 1 小时内操作次数 > 100 的高频行为 |
| `v_sensitive_operations` | 删除 / 修改 / 重置 / 密码 / 权限类敏感操作 |
| `v_error_operations_stats` | 错误操作统计 |
| `v_user_time_distribution` | 用户操作时间分布 |

### 存储过程

| 存储过程 | 用途 |
| --- | --- |
| `proc_query_logs_by_operation_type` | 按操作类型检索 |
| `proc_query_logs_by_user` | 按用户检索 |
| `proc_export_logs` | 审计日志导出 |
| `proc_check_operation_anomalies` | 操作异常检测 |
| `proc_create_monthly_log_partition` | 按月创建分区 |
| `proc_backup_operation_logs` | 日志备份 |

### MySQL 事件

| 事件 | 触发 |
| --- | --- |
| `evt_create_monthly_partition` | 每月创建下月分区 |
| `evt_daily_check_anomalies` | 每日执行异常检测 |

启用事件调度器：`SET GLOBAL event_scheduler = ON;`

### 表 `sys_audit_config` — 审计配置

| 配置项 | 默认值 | 含义 |
| --- | --- | --- |
| `LOG_RETENTION_DAYS` | 180 | 日志保留天数 |
| `HIGH_FREQ_THRESHOLD` | 100 | 高频操作阈值（次 / 小时） |
| `FAILED_LOGIN_THRESHOLD` | 5 | 登录失败阈值 |

## 4. MyBatis-Plus 约定

- 逻辑删除字段：`deleted`（1 删除 / 0 未删除）；
- 主键策略：`INPUT`（由雪花算法生成，`worker-id: 1`，`data-center-id: 20`）；
- 下划线转驼峰已开启。

## 5. 安全说明

- 对外暴露的 ID 经过 AES 混淆（`IdSecurityFilter` / `SecureIdAspect`），映射缓存 48 小时；
- 日志中的入参/响应需脱敏后再落库，避免心理评估内容明文留存。
