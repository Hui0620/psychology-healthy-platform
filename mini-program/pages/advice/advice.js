// health/pages/advice/advice.js
Page({
    data: {
      adviceList: [
        {
          id: 1,
          title: "应对考试焦虑",
          content: "考试前感到紧张是正常的。尝试深呼吸练习：吸气4秒，屏住4秒，呼气6秒，重复5次。",
          likes: 126,
          category: "学习压力",
          comments: [
            { id: 101, user: "小明", avatar: "/images/avatar_student.png", content: "这个方法很有效，考试前我都这样做！", time: "2023-05-20 10:30" },
            { id: 102, user: "小红", avatar: "/images/avatar_student.png", content: "尝试过了，确实有放松的效果", time: "2023-05-19 15:20" }
          ]
        },
        {
          id: 2,
          title: "改善睡眠质量",
          content: "保持规律的睡眠时间，睡前1小时避免使用电子设备。可以尝试听轻音乐或进行10分钟冥想。",
          likes: 89,
          category: "生活习惯",
          comments: []
        },
        {
          id: 3,
          title: "处理人际关系",
          content: "当遇到矛盾时，尝试用'我觉得...'而不是'你总是...'来表达感受，避免指责性语言。",
          likes: 143,
          category: "社交关系",
          comments: [
            { id: 103, user: "小刚", avatar: "/images/avatar_student.png", content: "这个方法让我和同桌的关系变好了", time: "2023-05-18 14:15" }
          ]
        }
      ],
      showCommentPopup: false,
      showPostPopup: false,
      currentAdviceId: null,
      newComment: "",
      postContent: "",
      userName: "同学",
      activeNav: "" // 当前激活的导航项
    },
  
    onLoad() {
      // 设置学生姓名
      const userName = wx.getStorageSync('userName');
      if (userName) {
        this.setData({ userName });
      }
      
      // 学生无导航菜单
      wx.hideTabBar();
      
      // 开启转发功能
      wx.showShareMenu({
        withShareTicket: true,
        menus: ['shareAppMessage', 'shareTimeline']
      });
    },
  
    // 右上角分享按钮处理
    onShareAppMessage() {
      return {
        title: '心理健康小建议',
        path: '/pages/advice/advice',
        imageUrl: '/images/share_advice.png'
      };
    },
  
    // 点击分享按钮触发
    onShareTap(e) {
      const adviceId = e.currentTarget.dataset.id;
      const advice = this.data.adviceList.find(item => item.id === adviceId);
      
      // 使用 showShareMenu 弹出分享菜单
      wx.showShareMenu({
        withShareTicket: true,
        menus: ['shareAppMessage', 'shareTimeline'],
        success: () => {
          wx.shareAppMessage({
            title: advice.title,
            path: `/pages/advice/advice?adviceId=${adviceId}`,
            imageUrl: '/images/share_advice.png',
            success(res) {
              console.log('分享成功', res);
            },
            fail(err) {
              console.error('分享失败', err);
            }
          });
        }
      });
    },
  
    // 打开评论弹窗
    openComment(e) {
      this.setData({
        showCommentPopup: true,
        currentAdviceId: e.currentTarget.dataset.id,
        newComment: ""
      });
    },
  
    // 关闭评论弹窗
    closeCommentPopup() {
      this.setData({ showCommentPopup: false });
    },
  
    // 评论输入处理
    onCommentInput(e) {
      this.setData({ newComment: e.detail.value });
    },
  
    // 提交评论
    submitComment() {
      const { newComment, currentAdviceId, adviceList } = this.data;
      
      if (!newComment.trim()) {
        wx.showToast({ title: '评论内容不能为空', icon: 'none' });
        return;
      }
  
      // 找到对应的建议
      const updatedAdviceList = adviceList.map(advice => {
        if (advice.id === currentAdviceId) {
          const newCommentObj = {
            id: Date.now(),
            user: this.data.userName,
            avatar: "/images/avatar_student.png",
            content: newComment.trim(),
            time: this.formatTime(new Date())
          };
          
          // 添加新评论
          return {
            ...advice,
            comments: [...advice.comments || [], newCommentObj]
          };
        }
        return advice;
      });
  
      wx.showToast({ title: '评论成功', icon: 'success' });
      this.setData({
        adviceList: updatedAdviceList,
        showCommentPopup: false,
        newComment: ""
      });
    },
  
    // 打开发帖弹窗
    openPostPopup() {
      this.setData({ showPostPopup: true, postContent: "" });
    },
  
    // 关闭发帖弹窗
    closePostPopup() {
      this.setData({ showPostPopup: false });
    },
  
    // 发帖内容输入
    onPostInput(e) {
      this.setData({ postContent: e.detail.value });
    },
  
    // 提交新帖
    submitPost() {
      const { postContent } = this.data;
      
      if (!postContent.trim()) {
        wx.showToast({ title: '内容不能为空', icon: 'none' });
        return;
      }
  
      wx.showToast({ title: '提交成功，审核中', icon: 'success' });
      this.setData({
        showPostPopup: false,
        postContent: ""
      });
    },
  
    // 添加到收藏
    addToFavorites(e) {
      const id = e.currentTarget.dataset.id;
      const advice = this.data.adviceList.find(item => item.id === id);
      
      wx.showToast({
        title: '已添加到收藏',
        icon: 'success'
      });
      
      // 在实际应用中，这里应该保存到本地存储
      console.log('收藏建议:', advice.title);
    },
  
    // 导航到心理问卷页面
    goToQuestionnaire() {
      this.setData({ activeNav: 'questionnaire' });
      wx.navigateTo({
        url: '/pages/questionnaire/questionnaire'
      });
    },
  
    // 导航到预约医生页面
    goToAppointment() {
      this.setData({ activeNav: 'appointment' });
      wx.navigateTo({
        url: '/pages/appointment/appointment'
      });
    },
  
    // 格式化时间
    formatTime(date) {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    }
  });