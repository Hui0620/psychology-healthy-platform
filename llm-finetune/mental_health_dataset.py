import json
import random
import pandas as pd

# ============================================
# 配置部分（改成你的实际路径）
# ============================================

CSV_PATH = "Updated Processed Diu.csv"  # 👈 改成你的CSV文件路径
OUTPUT_JSON_PATH = "mental_health_dataset.json"
NUM_SAMPLES = -1  # -1表示全部，也可以写500


# ============================================
# 根据用户问题关键词判断用户关心什么
# ============================================

def detect_main_issue(user_question: str) -> str:
    """根据用户问题判断主要关心焦虑/压力/抑郁"""
    user_lower = user_question.lower()

    anxiety_keywords = ["担心", "害怕", "紧张", "心慌", "不安", "焦虑", "控制不住", "莫名"]
    stress_keywords = ["压力", "硬撑", "喘不过气", "累", "崩溃", "撑不住"]
    depression_keywords = ["没意思", "提不起兴趣", "没用", "不想见人", "低落", "意义", "没劲", "不想动"]

    scores = {"anxiety": 0, "stress": 0, "depression": 0}

    for kw in anxiety_keywords:
        if kw in user_lower:
            scores["anxiety"] += 1
    for kw in stress_keywords:
        if kw in user_lower:
            scores["stress"] += 1
    for kw in depression_keywords:
        if kw in user_lower:
            scores["depression"] += 1

    # 返回得分最高的
    if scores["anxiety"] >= scores["stress"] and scores["anxiety"] >= scores["depression"]:
        return "anxiety"
    elif scores["stress"] >= scores["depression"]:
        return "stress"
    else:
        return "depression"


# ============================================
# 回复模板
# ============================================

RESPONSE_TEMPLATES = {
    "anxiety": {
        0: [
            "你现在的焦虑水平其实挺低的，属于正常范围。很多人都会有这种偶尔的小担心，不用太在意。继续保持就好～",
            "从你描述的情况看，焦虑程度很轻，基本不构成问题。放心啦，你状态挺好的。"
        ],
        1: [
            "你的焦虑属于轻度。就是那种'事情有点多，脑子里总是转'的状态。不是大问题，但建议你每天晚上花10分钟把所有担心写下来，然后就不想了。试试看？",
            "轻度焦虑其实挺常见的，不是你一个人的问题。你最近可能事情有点密集，给自己放个小假吧。"
        ],
        2: [
            "你现在的焦虑程度属于中度。这种时候可能会睡不好、容易烦躁、脑子里停不下来。很多同学到这个阶段都会觉得自己'是不是有问题'，其实不是，是你的警报系统太灵敏了。我建议你去学校心理中心聊一聊，他们很擅长处理这种情况。",
            "中度焦虑意味着你的身体已经在给你发信号了。不是你不坚强，是你真的太累了。找个人说一说，或者去做个评估，不丢人的。"
        ],
        3: [
            "从你的描述来看，焦虑水平已经比较高了。这种程度靠硬撑是很难自己缓解的。我不是吓你，但真的建议你去三甲医院心理科或者精神科看一下。就像感冒了要看医生一样，这个也是一样的道理。你不需要一个人扛着。",
            "你的焦虑程度比较高，这已经超出了'只是有点紧张'的范围。请一定去找专业人士评估一下，很多人从这里开始慢慢好起来的，你也可以。"
        ]
    },
    "stress": {
        0: [
            "你的压力水平其实挺低的，偶尔觉得累是正常的。整体状态不错，继续保持就行～",
            "从数据看，压力这块你是很健康的。不用担心，有波动很正常。"
        ],
        1: [
            "轻度压力，就是那种'事情有点多，但还能应付'的状态。这种压力有时候还能帮你提高效率，但要记得别让它一直积累。周末找个时间彻底放空一下？",
            "你的压力在轻度范围，说明你最近有点紧绷，但还在可控范围内。可以试着每天做一件让自己开心的小事。"
        ],
        2: [
            "你现在的压力水平属于中度。这种时候你可能会觉得心累、睡眠变差、容易烦躁。不是你不够好，是你真的背了太多东西。建议你把最重的那件事先放一放，或者找个人帮你分担一下。",
            "中度压力在大学生里越来越常见了。它不是在说'你不行'，而是你的身体在说'我需要休息'。先照顾好自己，其他的可以慢慢来。"
        ],
        3: [
            "从你的描述看，压力水平已经很高了。这种状态下能撑到现在已经很不容易。但你不能一直这样下去。我建议你尽快去学校心理中心或者医院评估一下，他们可以帮你找到缓解的方法。",
            "重度压力意味着你的负担已经远远超出了你能承受的范围。这不是你的错。请一定去找专业的人帮你，你值得被帮助。"
        ]
    },
    "depression": {
        0: [
            "从情绪状态看，你这边其实挺好的。偶尔的低落很正常，不用太担心。继续保持你现在的社交和生活节奏就好。",
            "你的抑郁评分很低，说明整体状态是健康的。如果有不开心的时候，找人聊聊天会好很多。"
        ],
        1: [
            "你的情况属于轻度抑郁倾向。可能会觉得做什么都提不起劲，或者比以前容易累。这不是你'懒'，是你在消耗自己。建议你试着找回一件曾经喜欢的小事，哪怕只是听一首老歌。如果持续超过两周，再去看看医生也不晚。",
            "轻度抑郁在数据里很常见，很多同学都会有阶段性的低落。你不需要马上'好起来'，但可以试着找人聊一聊，别把自己锁住。"
        ],
        2: [
            "从你的描述看，情绪状态属于中度抑郁了。这不是'想开了就好'的问题，是需要认真对待的信号。很多同学到了这个阶段会觉得自己'没用'或者'没意义'，请你一定记得：这不是真的，是你的情绪在骗你。去看医生吧，他们真的能帮你。",
            "中度抑郁意味着你的情绪状态已经影响到日常生活了。你不需要自己扛着，去找专业人士评估一下，就像身体不舒服要去看医生一样正常。"
        ],
        3: [
            "你的情绪状态已经到了需要认真重视的程度了。我非常认真地建议你：尽快去三甲医院心理科或者精神科看一下。这不是你意志力的问题，是你的大脑需要专业帮助了。你很重要，不要自己判断自己不值得。",
            "重度抑郁靠自己一个人是很难走出来的。你不是不够坚强，是你在黑暗中走了太久。请一定让别人来帮你，去看医生，去告诉信任的人。"
        ]
    }
}

# 用户问题库
USER_QUESTIONS = [
    "最近总是忍不住担心很多事情，明知道没必要，但就是停不下来。",
    "我感觉压力好大，每天都在硬撑，快撑不住了。",
    "最近对什么都提不起兴趣，觉得很没意思。",
    "我睡不好，脑子里乱七八糟的。",
    "很容易烦躁，一点点小事就会生气。",
    "觉得自己很没用，什么都做不好。",
    "马上要考试了，整个人都很焦虑。",
    "我好像不太想见人，也不想说话。",
    "总觉得很累，哪怕什么都没做。",
    "有时候会突然心慌、喘不上气。",
    "感觉自己最近情绪很低落，也不知道为什么。",
    "室友好像都过得挺好，就我不行。",
    "考研复习到崩溃，感觉不行了。",
    "毕业季找工作好焦虑，别人都定了就我没有。",
    "最近总是失眠，脑子里转个不停。",
]


def get_response(anxiety: int, stress: int, depression: int, user_question: str) -> str:
    """根据标签和用户问题，生成回复"""

    main_issue = detect_main_issue(user_question)

    label_value = {
        "anxiety": anxiety,
        "stress": stress,
        "depression": depression
    }[main_issue]

    templates = RESPONSE_TEMPLATES[main_issue].get(label_value, RESPONSE_TEMPLATES[main_issue][0])
    response = random.choice(templates)

    # 如果其他标签也偏高，简单提一句
    other_high = []
    if anxiety >= 2 and main_issue != "anxiety":
        other_high.append("焦虑")
    if stress >= 2 and main_issue != "stress":
        other_high.append("压力")
    if depression >= 2 and main_issue != "depression":
        other_high.append("情绪")

    if other_high and label_value <= 2:
        extra = f" 对了，从数据上看你的{'和'.join(other_high)}也需要注意一下，别一起爆了。"
        response += extra

    return response


def generate_dataset(df: pd.DataFrame, num_samples: int = -1) -> list:
    """生成对话数据集"""
    dataset = []

    valid_df = df.dropna(subset=["Anxiety Label", "Stress Label", "Depression Label"])

    if num_samples > 0 and num_samples < len(valid_df):
        valid_df = valid_df.sample(n=num_samples, random_state=42)

    for _, row in valid_df.iterrows():
        try:
            anxiety = int(float(row["Anxiety Label"]))
            stress = int(float(row["Stress Label"]))
            depression = int(float(row["Depression Label"]))
        except (ValueError, TypeError):
            continue

        user_question = random.choice(USER_QUESTIONS)
        assistant_response = get_response(anxiety, stress, depression, user_question)

        conversation = {
            "messages": [
                {
                    "role": "system",
                    "content": "你是一个温柔、有耐心的大学生心理支持助手。你懂心理健康知识，但从来不端着说话。你像朋友一样温暖，比朋友更懂情绪是怎么回事。说话自然，不说教，偶尔带点小幽默。"
                },
                {
                    "role": "user",
                    "content": user_question
                },
                {
                    "role": "assistant",
                    "content": assistant_response
                }
            ]
        }

        dataset.append(conversation)

    return dataset


def main():
    print("=" * 50)
    print("心理健康对话数据集生成器")
    print("=" * 50)

    print(f"\n📂 读取 CSV: {CSV_PATH}")
    try:
        df = pd.read_csv(CSV_PATH, encoding='utf-8')
    except UnicodeDecodeError:
        df = pd.read_csv(CSV_PATH, encoding='gbk')

    print(f"✅ 读取 {len(df)} 行")

    required = ["Anxiety Label", "Stress Label", "Depression Label"]
    missing = [c for c in required if c not in df.columns]
    if missing:
        print(f"❌ 缺少列: {missing}")
        return

    print("\n📊 标签分布:")
    for col in required:
        print(f"   {col}: {dict(df[col].value_counts().sort_index())}")

    print(f"\n🔧 生成对话数据...")
    dataset = generate_dataset(df, NUM_SAMPLES)
    print(f"✅ 生成 {len(dataset)} 条")

    with open(OUTPUT_JSON_PATH, 'w', encoding='utf-8') as f:
        json.dump(dataset, f, ensure_ascii=False, indent=2)

    print(f"\n💾 保存到: {OUTPUT_JSON_PATH}")

    if dataset:
        print("\n📝 示例:")
        print(f"   用户: {dataset[0]['messages'][1]['content']}")
        print(f"   助手: {dataset[0]['messages'][2]['content'][:100]}...")


if __name__ == "__main__":
    main()