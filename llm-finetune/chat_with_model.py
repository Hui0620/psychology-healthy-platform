# -*- coding: utf-8 -*-
"""
甄嬛AI对话程序
使用ModelScope下载模型
"""

from modelscope import AutoTokenizer, AutoModelForCausalLM
import torch
import time

print("=" * 50)
print("正在加载甄嬛AI模型，请稍候...")
print("（第一次运行会下载模型，大约需要2-3GB空间）")
print("=" * 50)

# 记录开始时间
start_time = time.time()

# 使用ModelScope的模型
model_name = "deepseek-ai/DeepSeek-R1-Distill-Qwen-1.5B"

print("\n1. 加载分词器...")
tokenizer = AutoTokenizer.from_pretrained(
    model_name,
    trust_remote_code=True
)

print("2. 加载模型（CPU版本，需要几分钟）...")
model = AutoModelForCausalLM.from_pretrained(
    model_name,
    trust_remote_code=True,
    torch_dtype=torch.float32,  # CPU用float32
    low_cpu_mem_usage=True
)

# 设置模型为评估模式
model.eval()

end_time = time.time()
print(f"✅ 模型加载完成！用时：{end_time - start_time:.1f}秒")
print("=" * 50)

# 甄嬛角色设定
system_prompt = "现在你要扮演皇帝身边的女人--甄嬛"


def chat_with_zhenhuan(user_input):
    """
    与甄嬛对话的函数
    """
    # 构造对话格式
    prompt = f"<|system|>{system_prompt}<|end|><|user|>{user_input}<|end|><|assistant|>"

    # 将文本转换为模型输入
    inputs = tokenizer(prompt, return_tensors="pt", truncation=True, max_length=512)

    # 生成回复
    with torch.no_grad():
        outputs = model.generate(
            inputs.input_ids,
            max_new_tokens=100,
            temperature=0.7,
            do_sample=True,
            top_p=0.9,
            repetition_penalty=1.1,
            pad_token_id=tokenizer.eos_token_id
        )

    # 解码生成的文本
    full_response = tokenizer.decode(outputs[0], skip_special_tokens=False)

    # 提取助手的回复部分
    try:
        assistant_response = full_response.split("<|assistant|>")[-1].split("<|end|>")[0].strip()
    except:
        assistant_response = "嬛嬛不知如何回答..."

    return assistant_response


# 对话主循环
print("\n" + "=" * 50)
print("✨ 甄嬛AI已上线！输入'退出'结束对话 ✨")
print("=" * 50)

while True:
    # 获取用户输入
    user_input = input("\n👤 你: ")

    # 检查是否退出
    if user_input.lower() in ['退出', 'exit', 'quit']:
        print("👋 甄嬛: 妹妹慢走，改日再来叙话。")
        break

    if user_input.strip() == "":
        continue

    # 获取甄嬛回复
    print("💭 甄嬛正在思考...")

    # 记录回复时间
    response_start = time.time()
    response = chat_with_zhenhuan(user_input)
    response_end = time.time()

    # 打印回复
    print(f"👸 甄嬛: {response}")
    print(f"   (用时: {response_end - response_start:.1f}秒)")

print("\n对话结束，感谢使用！")