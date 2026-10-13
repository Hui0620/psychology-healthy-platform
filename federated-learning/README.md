# 联邦学习实验

本目录存放联邦学习实验的复现命令与结果。实验基于开源库
[PFLlib](https://github.com/TsingZ0/PFLlib)（Zhang et al., arXiv:2312.04992），
框架代码不在本仓库中，请按以下步骤准备：

```bash
git clone https://github.com/TsingZ0/PFLlib.git
cd PFLlib
conda env create -f env_cuda_latest.yaml
conda activate pfl

cd ./system
python main.py -data mnist -m cnn -algo FedAvg -gr 2000 -did 0
```

方案设计、参数说明与平台中的落地映射见
[docs/FEDERATED_LEARNING.md](../docs/FEDERATED_LEARNING.md)。
