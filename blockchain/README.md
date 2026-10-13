# 区块链存证模块（FISCO BCOS）

本目录是平台的**链上存证**部分：Solidity 合约 + 基于 FISCO BCOS Java SDK 的合约调用服务。
心理评估记录、转诊单据的**哈希上链、原文不出域**，保证不可篡改、可验真、可追溯。

> 设计说明见 [docs/BLOCKCHAIN.md](../docs/BLOCKCHAIN.md)。
> 本模块源自协作项目 [SoarCollab/RecordPlatform](https://github.com/SoarCollab/RecordPlatform)（Apache-2.0），由本项目组共同维护。

## 目录结构

```
blockchain/
├── contracts/                  # 合约源码与编译产物（便于直接查看）
│   ├── Storage.sol             # 文件存证主合约
│   ├── Sharing.sol             # 授权分享合约（继承 Storage）
│   ├── abi/                    # 合约 ABI
│   └── bin/                    # 合约 BIN
│       ├── ecc/                # 非国密版本
│       └── sm/                 # 国密版本
├── fisco-service/              # 可编译运行的 Java 服务（Dubbo Provider，端口 8091）
│   ├── pom.xml
│   └── src/main/
│       ├── java/cn/flying/fisco_bcos/
│       │   ├── config/         # BcosConfig、ContractConfig、SdkBeanConfig、SystemConfig
│       │   ├── constants/      # ContractConstants
│       │   ├── model/          # Result、各合约方法的输入 BO
│       │   ├── service/        # BlockChainServiceImpl、StorageService、SharingService
│       │   └── utils/          # Convert（类型转换）
│       └── resources/
│           ├── abi/ bin/       # 合约 ABI 与 BIN
│           └── application.yml # 节点、群组、合约地址、Dubbo 配置
└── docs/                       # 区块链学习与部署材料
```

## 合约说明

### `Storage.sol`

| 成员 | 说明 |
| --- | --- |
| `struct File` | `fileName`、`uploader`、`content`、`param`、`fileHash`、`uploadTime` |
| `mapping(bytes32 => File) files` | 文件哈希 → 文件信息 |
| `mapping(string => bytes32[]) userFiles` | 上传者 → 文件哈希列表 |
| `mapping(string => mapping(bytes32 => uint256)) userFileIndexes` | 用户文件索引，配合 O(1) 删除 |
| `storeFile()` | 非空校验 → 生成 `keccak256` 哈希 → 去重校验 → 写入 → 触发 `FileStored` 事件 |
| `getUserFiles()` / `getFile()` | 列表查询 / 单文件查询（校验归属） |
| `deleteFile()` / `deleteFiles()` | 单个 / 批量删除，触发 `FileDeleted` / `FilesDeleted` 事件 |
| `removeFromUserFiles()` | 私有方法：用「末位元素填补空位」实现 O(1) 删除 |

### `Sharing.sol`（`contract Sharing is Storage`）

| 成员 | 说明 |
| --- | --- |
| `struct ShareInfo` | `uploader`、`fileHashes[]`、`expireTime`、`isValid` |
| `generateShareCode()` | 基于 `block.timestamp`、`block.difficulty`、`msg.sender`、nonce 生成 6 位随机分享码 |
| `shareFiles(uploader, fileHashes, expireMinutes)` | 逐个校验所有权后生成分享码，有效期 ≤ 43200 分钟（30 天），触发 `FileShared` 事件 |
| `getSharedFiles(shareCode)` | 校验分享码长度、有效性与过期时间，返回分享者、文件列表、过期时间 |

## 部署与运行

### 1. 准备链环境

- 搭建 FISCO BCOS 3.x 链与 WeBase 管理平台：见 [docs/04-fisco-bcos-and-webase-setup.docx](./docs/04-fisco-bcos-and-webase-setup.docx)
- 若在 Windows 上通过 WSL / Ubuntu 部署：见 [docs/05-ubuntu-wsl-setup.docx](./docs/05-ubuntu-wsl-setup.docx)

### 2. 编译与部署合约

使用控制台或 Solidity 编译器编译 `contracts/Storage.sol`、`contracts/Sharing.sol`，
将生成的 ABI / BIN 覆盖到 `fisco-service/src/main/resources/abi`、`bin` 下
（仓库中已提供 ecc 与 sm 两套编译产物，可直接使用）。

部署后把合约地址填入 `fisco-service/src/main/resources/application.yml`：

```yaml
bcos:
  cryptoMaterial:
    certPath: conf        # 证书目录
  network:
    peers[0]: 127.0.0.1:20200
system:
  groupId: group0
  hexPrivateKey:          # 部署账户私钥
contract:
  sharingAddress: '0x...'
  storageAddress: '0x...'
```

### 3. 启动服务

```bash
cd fisco-service
mvn clean package -DskipTests
java -jar target/platform-fisco-*.jar
```

服务以 **Dubbo（Triple 协议，端口 8091）** 暴露接口并注册到 Nacos，
`platform-backend` 通过 RPC 调用完成存证与验真。

### 4. 验证

`fisco-service/src/test/java/cn/flying/fisco_bcos/FiscoTest.java` 提供了合约调用的最小示例，
可先跑通该用例确认节点连通性与合约地址配置正确。

## 学习材料

| 文件 | 内容 |
| --- | --- |
| `docs/01-blockchain-fundamentals.pptx` | 区块链基础知识 |
| `docs/02-blockchain-operations.pptx` | 区块链操作实践 |
| `docs/03-smart-contract-deployment-and-java-dev.docx` | 智能合约部署及 Java 开发 |
| `docs/04-fisco-bcos-and-webase-setup.docx` | FISCO BCOS 与 WeBase 安装部署 |
| `docs/05-ubuntu-wsl-setup.docx` | Ubuntu / WSL 环境安装 |

> 原始压缩包中的 `docker-compose-linux-x86_64`（25 MB）与 `wsl_update_x64.msi`（16 MB）
> 属于安装二进制，未纳入版本库，请从官方渠道获取。

## 注意事项

- 上链内容仅为**哈希与元信息**，心理评估原文存储在 MinIO / 数据库中，链上不落原文；
- `hexPrivateKey` 等敏感配置请勿提交，建议通过环境变量或配置中心注入；
- 国密（sm）与非国密（ecc）两套 BIN 需与链的加密模式匹配。
