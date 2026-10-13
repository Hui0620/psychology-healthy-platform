# 微信小程序端

小程序面向**学生、家长、辅导员**三类角色，是「家校医」闭环中的移动端入口。

## 1. 页面结构

`mini-program/app.json` 中 `tabBar` 含「首页」与「社区」两项，页面清单：

| 页面 | 角色 | 说明 |
| --- | --- | --- |
| `pages/login/login` | 全部 | 身份选择：学生 / 家长 / 辅导员（学生 → `advice`，其它 → `index`） |
| `pages/index/index` | 家长 / 辅导员 | 关注学生列表与状态：**良好 / 正常 / 需关注 / 预警** |
| `pages/detail/detail` | 家长 / 辅导员 | 单个学生的心理详情（由 `globalData.currentStudent` 传入） |
| `pages/advice/advice` | 学生 | 心理建议与互助帖：点赞、评论、收藏、分享；入口跳问卷 / 预约 |
| `pages/questionnaire/questionnaire` | 学生 | 心理测评量表列表（焦虑 / 压力 / 抑郁），含「已完成是否重测」逻辑 |
| `pages/questionnaire_detail/questionnaire_detail` | 学生 | 具体问卷答题（接收 `?id=`） |
| `pages/appointment/appointment` | 学生 | 预约医生列表 |
| `pages/community/community` | 全部 | 社区：全部 / 专家分享 / 家长交流 / 辅导员专区 / 缓解焦虑 / 压力管理 |
| `pages/compose/compose` | 全部 | 发帖 |
| `pages/comments/comments` | 全部 | 评论列表与发表 |

## 2. 目录结构

```
mini-program/
├── app.js        # 全局逻辑（globalData、身份状态）
├── app.json      # 页面注册与 tabBar
├── app.wxss      # 全局样式
├── pages/        # 各页面（.js / .wxml / .wxss / .json）
├── images/       # 图标与插图
├── utils/        # 工具函数
└── sitemap.json
```

## 3. 运行

1. 微信开发者工具 → 导入项目 → 选择 `mini-program/` 目录；
2. AppID 选择「测试号」；
3. 勾选「不校验合法域名」（当前为本地 Mock 数据）。

## 4. 状态说明

| 状态 | 含义 | 建议动作 |
| --- | --- | --- |
| 良好 | 量表各维度均在正常区间 | 保持关注 |
| 正常 | 存在轻微波动 | 定期复测 |
| 需关注 | 出现中度焦虑 / 压力 / 抑郁倾向 | 辅导员约谈，推送自助资源 |
| 预警 | 达到重度或出现风险信号 | 通知家长 + 转介心理中心 / 医院 |

## 5. 已知问题与后续规划

- [ ] 当前所有数据为本地 Mock，需替换为 `wx.request` 真实接口；
- [ ] `pages/appointment/appointment` 跳转的 `pages/appointment_detail/appointment_detail` 尚未在 `app.json` 注册；
- [ ] 需接入微信登录与手机号授权，打通与 Web 端的统一账号体系；
- [ ] 预警消息需通过订阅消息 / 服务通知推送给家长与辅导员。
