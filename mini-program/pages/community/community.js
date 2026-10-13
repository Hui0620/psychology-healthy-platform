// pages/community/community.js
const app = getApp();

Page({
  data: {
    categories: [
      { id: 'all', name: '全部' },
      { id: 'doctors', name: '专家分享' },
      { id: 'parents', name: '家长交流' },
      { id: 'counselors', name: '辅导员专区' },
      { id: 'anxiety', name: '缓解焦虑' },
      { id: 'stress', name: '压力管理' }
    ],
    activeTabId: 'all',
    posts: [
      {
        id: 1,
        title: '青少年焦虑情绪的识别与应对',
        content: '孩子最近情绪波动大？这可能是焦虑的表现。我建议家长多关注孩子的日常生活作息和心理变化，及时与学校心理辅导员沟通...',
        likes: 48,
        comments: 12,
        time: '2023-05-20 10:30',
        user: {
          name: '张医生',
          role: '心理医生',
          avatar: '/images/doctor_avatar.png'
        },
        category: 'doctors'
      },
      {
        id: 2,
        title: '孩子在学校被孤立怎么办？',
        content: '我家孩子最近总说没朋友，不愿意上学。有经验的家长能不能支个招？',
        likes: 24,
        comments: 8,
        time: '2023-05-19 15:20',
        user: {
          name: '匿名家长',
          role: '家长',
          avatar: '/images/anonymous_parent.png'
        },
        category: 'parents'
      },
      {
        id: 3,
        title: '考前减压小技巧分享',
        content: '今天为学生们进行了团体减压辅导，分享一些简单实用的压力释放方法：1. 深呼吸练习 2. 短暂冥想 3. 肢体放松...',
        likes: 36,
        comments: 11,
        time: '2023-05-18 14:15',
        user: {
          name: '匿名辅导员',
          role: '辅导员',
          avatar: '/images/anonymous_counselor.png'
        },
        category: 'counselors'
      },
      {
        id: 4,
        title: '如何帮助孩子建立良好睡眠习惯',
        content: '充足的睡眠是心理健康的基础。今天分享几个实用建议：1. 固定作息时间 2. 营造舒适的睡眠环境 3. 避免睡前使用电子设备...',
        likes: 52,
        comments: 9,
        time: '2023-05-17 09:45',
        user: {
          name: '赵医生',
          role: '心理医生',
          avatar: '/images/doctor_avatar.png'
        },
        category: 'doctors'
      },
      {
        id: 5,
        title: '孩子沉迷手机游戏怎么办？',
        content: '孩子每天回家就抱着手机玩游戏，作业也不做，有什么好的引导方法吗？',
        likes: 32,
        comments: 15,
        time: '2023-05-16 16:40',
        user: {
          name: '匿名家长',
          role: '家长',
          avatar: '/images/anonymous_parent.png'
        },
        category: 'parents'
      }
    ]
  },
  
  // 获取筛选后的帖子
  get filteredPosts() {
    const { activeTabId, posts } = this.data;
    if (activeTabId === 'all') return posts;
    return posts.filter(post => post.category === activeTabId);
  },
  
  onLoad() {
    this.setData({
      filteredPosts: this.filteredPosts
    });
  },
  
  // 切换分类
  switchTab(e) {
    const tabId = e.currentTarget.dataset.id;
    this.setData({
      activeTabId: tabId,
      filteredPosts: this.filteredPosts
    });
  },
  
  // 跳转到发帖页面
  navigateToCompose() {
    wx.navigateTo({
      url: '/pages/compose/compose'
    });
  }
});