#!/bin/bash
# ==============================================================================
# 大学生心理健康平台 —— 联邦学习对比实验脚本
#
# 依赖：PFLlib（https://github.com/TsingZ0/PFLlib）
#   1) 在本脚本所在目录执行：git clone https://github.com/TsingZ0/PFLlib.git
#   2) 本脚本默认 PFLlib 与仓库同级，或通过环境变量 PFL_HOME 指定路径
#
# 用法：
#   cd PFLlib/system && bash ../../experiments.sh mnist cnn
#   PFL_HOME=/path/to/PFLlib bash experiments.sh Cifar10 cnn
# ==============================================================================

set -euo pipefail

PFL_HOME="${PFL_HOME:-../PFLlib}"
DATA="${1:-mnist}"      # 数据集：mnist / Cifar10 / Cifar100 / fmnist / agnews
MODEL="${2:-cnn}"       # 模型：dnn / cnn / resnet / lstm
DEVICE="${3:-0}"        # GPU device id

# 参与机构数量（本项目场景：校医院 + 心理中心 + 合作医院 …）
NUM_CLIENTS=20
JOIN_RATIO=1
LOCAL_BS=16
GLOBAL_ROUNDS=2000

run() {
    local algo="$1"; shift
    echo ">>> [${DATA}] ${algo} ${MODEL} extra: $*"
    python -u main.py \
        -data "${DATA}" \
        -m "${MODEL}" \
        -algo "${algo}" \
        -lbs "${LOCAL_BS}" \
        -nc "${NUM_CLIENTS}" \
        -jr "${JOIN_RATIO}" \
        -gr "${GLOBAL_ROUNDS}" \
        -did "${DEVICE}" \
        "$@"
}

# ------------------------------------------------------------------------------
# 1) 传统联邦（tFL）基线
# ------------------------------------------------------------------------------
run FedAvg                                  # 基线：参数平均
run FedProx  -mu 0.001                      # 近端项约束，缓解 client drift

# ------------------------------------------------------------------------------
# 2) 个性化联邦（pFL）—— 本项目重点
# ------------------------------------------------------------------------------
run pFedMe   -lrp 0.09 -bt 1 -lam 15        # 双层优化，兼顾全局与个性化
run PerAvg   -bt 0.001                      # 个性化梯度一步微调
run FedFomo  -M 5                           # 客户端自适应选择聚合对象
run FedAMP   -alk 1e3 -lam 1 -sg 1e-1       # 注意力消息传递，同类机构相互增强
run FedMTL   -itk 4000                      # 联邦多任务学习

# ------------------------------------------------------------------------------
# 3) 非独立同分布（non-IID）鲁棒性对比
#    项目场景天然非 IID：各机构人群结构、量表分布差异大
# ------------------------------------------------------------------------------
run FedAvg   -cdr 0.5 -go unstable          # 客户端掉线率 50%
run pFedMe   -lrp 0.09 -bt 1 -lam 15 -cdr 0.5 -go unstable
run PerAvg   -bt 0.001 -cdr 0.5 -go unstable

echo ">>> 全部实验完成，结果见 ../results/ 与 *.out 日志"
