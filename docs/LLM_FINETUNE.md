# 心理健康领域大模型微调

## 1. 目标

通用大模型在心理支持场景下容易出现「说教感强、缺乏共情、不会分级引导」的问题。平台通过**领域指令微调**让模型具备：

- 温柔、像朋友一样的表达风格，不说教、不评判；
- 能根据焦虑 / 压力 / 抑郁的严重程度（0–3 级）给出**分级建议**；
- 达到中重度时明确引导寻求专业帮助，而不是自行诊断。

## 2. 微调方法：QLoRA

以 `deepseek-ai/DeepSeek-R1-Distill-Qwen-1.5B` 为基座，使用 **4-bit QLoRA**，单张消费级显卡即可完成训练。

| 配置项 | 取值 |
| --- | --- |
| 量化 | `BitsAndBytesConfig` nf4 + 双重量化，fp16 |
| 训练准备 | `prepare_model_for_kbit_training` + `gradient_checkpointing` |
| LoRA | `r=16`、`lora_alpha=32`、`lora_dropout=0.05` |
| 目标模块 | `q_proj`、`k_proj`、`v_proj` |
| 优化器 | `paged_adamw_8bit`，cosine 调度，lr `1e-4` |
| 批次 | batch `4` × grad_accum `4` |
| 训练 | 3 epoch，`max_len` 384，训练/验证 7:3 |

**训练结果**

- 可训练参数：`2,981,888 / 1,124,972,032 = 0.2651%`
- 训练步数 492 步，耗时约 2h36m
- Loss：`8.196 → 4.874`
- 权重保存：`./deepseek_finetuned/best_lora_weights`

推理：

```python
from peft import PeftModel
model = PeftModel.from_pretrained(base_model, "./deepseek_finetuned/best_lora_weights")
```

可运行的完整 Notebook 见 `llm-finetune/qlora-demo/`（含数据集与训练脚本）。

## 3. 数据集构造

### 3.1 来源

[DIU Extended Mental Health Dataset](llm-finetune/dataset/diu-extended-mental-health/)（孟加拉大学生心理健康数据，约 2038 条，CC BY 4.0），字段包含：

| 字段 | 说明 |
| --- | --- |
| `Age` / `Gender` / `Current_CGPA` | 基础信息 |
| `GAD1–7` | 焦虑量表（GAD-7） |
| `PSS1–10` | 压力量表（PSS-10） |
| `DASS_D1–7` | 抑郁量表（DASS-21 简版） |
| `Anxiety/Stress/Depression Label` | 0–3 级严重程度标签 |

> 使用第三方数据集请遵守其许可与伦理声明，见 `docs/ETHICS_STATEMENT.md`、`docs/DATA_DICTIONARY.md`。

### 3.2 指令数据生成

`llm-finetune/mental_health_dataset.py` 将结构化量表数据转成对话式微调样本：

1. 用关键词规则判断用户主诉属于 **anxiety / stress / depression**；
2. 结合该维度的 0–3 分级标签，选择对应严重程度的共情回复模板；
3. 若其它维度也偏高（≥2 级），追加提醒；
4. 输出 `messages` 格式的指令数据（system / user / assistant）。

```bash
cd llm-finetune
pip install pandas
python mental_health_dataset.py
# 输出：mental_health_dataset.json
```

System Prompt 示例：

> 你是一个温柔、有耐心的大学生心理支持助手。你懂心理健康知识，但从来不端着说话。你像朋友一样温暖，比朋友更懂情绪是怎么回事。说话自然，不说教，偶尔带点小幽默。

## 4. 与平台的结合

| 平台能力 | 大模型作用 |
| --- | --- |
| AI 心理健康报告 | 基于量表与画像生成文字解读（ECharts 图表由前端渲染） |
| 辅助诊断 | 结合本地 / 全局模型给出参考结论，供医生复核 |
| 小程序「心理建议」 | 学生端即时倾诉与自助建议 |
| 转诊建议书 | 依据 SAD PERSONS 评分与 DSM-5 五轴生成转诊文本 |

## 5. 免责声明

模型输出仅作为**辅助参考**，不构成医学诊断。中重度风险必须由专业心理工作者或精神科医师介入。

## 6. 后续规划

- [ ] 扩充真实中文咨询语料（需脱敏与伦理审批），替换模板生成的回复；
- [ ] 引入人类反馈（偏好标注）做 DPO / RLHF 对齐；
- [ ] 将推理封装为独立服务，提供流式接口与并发限流。
