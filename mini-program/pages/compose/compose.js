// pages/compose/compose.js
const app = getApp();

Page({
  data: {
    title: '',
    content: '',
    images: [],
    categories: [
      '专家分享',
      '家长交流',
      '辅导员专区',
      '缓解焦虑',
      '压力管理',
      '情绪调节',
      '心理健康小知识'
    ],
    categoryIndex: -1,
    category: ''
  },

  // 输入处理
  onTitleInput(e) {
    this.setData({ title: e.detail.value });
  },

  onContentInput(e) {
    this.setData({ content: e.detail.value });
  },

  // 选择图片
  selectImage() {
    wx.chooseImage({
      count: 3 - this.data.images.length,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.setData({
          images: [...this.data.images, ...res.tempFilePaths]
        });
      }
    });
  },

  // 移除图片
  removeImage(e) {
    const index = e.currentTarget.dataset.index;
    const images = [...this.data.images];
    images.splice(index, 1);
    this.setData({ images });
  },

  // 选择分类
  bindCategoryChange(e) {
    const value = e.detail.value;
    this.setData({
      categoryIndex: value,
      category: this.data.categories[value]
    });
  },

  // 提交帖子
  submitPost() {
    const { title, content, category, images } = this.data;
    
    if (!title.trim()) {
      wx.showToast({ title: '请填写标题', icon: 'none' });
      return;
    }
    
    if (!content.trim()) {
      wx.showToast({ title: '请填写内容', icon: 'none' });
      return;
    }
    
    if (!category) {
      wx.showToast({ title: '请选择分类', icon: 'none' });
      return;
    }
    
    // 获取用户类型
    const userType = app.globalData.userType;
    let userInfo = {};
    
    // 根据用户类型设置匿名信息
    if (userType === 'parent') {
      userInfo = {
        name: '匿名家长',
        role: '家长',
        avatar: '/images/anonymous_parent.png'
      };
    } else if (userType === 'counselor') {
      userInfo = {
        name: '匿名辅导员',
        role: '辅导员',
        avatar: '/images/anonymous_counselor.png'
      };
    } else {
      // 医生使用真实信息
      userInfo = {
        name: app.globalData.userInfo.nickName || '心理医生',
        role: '心理医生',
        avatar: app.globalData.userInfo.avatarUrl || '/images/doctor_avatar.png'
      };
    }
    
    // 创建新帖子
    const newPost = {
      id: Date.now(),
      title: title.trim(),
      content: content.trim(),
      likes: 0,
      comments: 0,
      time: this.formatTime(new Date()),
      user: userInfo,
      category: this.getCategoryKey(category)
    };
    
    // 获取当前社区页面实例
    const pages = getCurrentPages();
    const communityPage = pages.find(page => page.route === 'pages/community/community');
    
    if (communityPage) {
      // 更新社区页面的帖子列表
      communityPage.data.posts.unshift(newPost);
      communityPage.setData({
        filteredPosts: communityPage.filteredPosts
      });
    }
    
    // 模拟发帖成功
    wx.showLoading({ title: '发布中...' });
    
    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({ title: '发布成功' });
      
      // 返回社区页面
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    }, 1500);
  },
  
  // 格式化时间
  formatTime(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  },
  
  // 获取分类键
  getCategoryKey(categoryName) {
    const map = {
      '专家分享': 'doctors',
      '家长交流': 'parents',
      '辅导员专区': 'counselors',
      '缓解焦虑': 'anxiety',
      '压力管理': 'stress',
      '情绪调节': 'emotion',
      '心理健康小知识': 'knowledge'
    };
    
    return map[categoryName] || 'all';
  }
});