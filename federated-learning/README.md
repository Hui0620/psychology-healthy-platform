# 联邦学习实验

本目录存放联邦学习实验的**复现脚本**与说明。实验基于开源库
[PFLlib](https://github.com/TsingZ0/PFLlib)（Zhang et al., arXiv:2312.04992，GPL-2.0），
框架代码体积较大且为第三方许可，未随本仓库分发，请自行克隆：

```bash
git clone https://github.com/TsingZ0/PFLlib.git
cd PFLlib
conda env create -f env_cuda_latest.yaml
conda activate pfl
```

## 一键跑对比实验

```bash
cd PFLlib/system
bash <仓库路径>/federated-learning/experiments.sh mnist cnn 0
```

脚本会依次运行 **FedAvg / FedProx / pFedMe / PerAvg / FedFomo / FedAMP / FedMTL**，
并额外跑一组「客户端掉线率 50%（`-cdr 0.5`）」的非 IID 鲁棒性对比。

## 单条运行

```bash
cd ./system
python main.py -data mnist -m cnn -algo FedAvg -gr 2000 -did 0
```

常用参数：

| 参数 | 含义 |
| --- | --- |
| `-data` | 数据集：`mnist` / `Cifar10` / `Cifar100` / `fmnist` / `agnews` |
| `-m` | 模型：`dnn` / `cnn` / `resnet` / `lstm` |
| `-algo` | 算法：`FedAvg` / `FedProx` / `pFedMe` / `PerAvg` / `FedFomo` / `FedAMP` / `FedMTL` |
| `-nc` | 参与客户端（机构）数量 |
| `-jr` | 每轮参与比例 |
| `-lbs` | 本地批大小 |
| `-gr` | 全局通信轮次 |
| `-cdr` | 客户端掉线率，用于模拟不稳定机构 |
| `-did` | GPU device id |

## 方案设计与平台落地

见 [docs/FEDERATED_LEARNING.md](../docs/FEDERATED_LEARNING.md)：
机构本地训练 → 只交换模型参数 → 服务端聚合 → 个性化适配，
每轮梯度 / 评分 / 激励值上链，前端 `/admin/model-detail/:id` 可视化。
