Page({
    data: {
      questionnaireId: null,
      title: '',
      questions: [],
      currentIndex: 0,
      completed: 0,
      totalQuestions: 0,
      questionTime: 1,
      currentQuestion: {}
    },
  
    onLoad(options) {
      const questionnaireId = options.id;
      this.setData({
        questionnaireId,
        currentIndex: 0
      }, () => {
        this.loadQuestionnaire(questionnaireId);
      });
    },
  
    // 加载问卷数据 - 匹配图片中的问题
    loadQuestionnaire(id) {
      let title = '';
      let questions = [];
      
      // 示例问卷数据 (使用您图片中的问题)
      title = '心理健康问卷';
      questions = [
        {
          id: 'q1',
          text: '感到紧张、焦虑或急燥',
          type: 'single',
          selected: null,
          options: [
            { id: 'a1', text: '完全没有', score: 0 },
            { id: 'a2', text: '有几天', score: 1 },
            { id: 'a3', text: '一半以上的时间', score: 2 },
            { id: 'a4', text: '几乎每天', score: 3 }
          ]
        },
        // 添加更多问题 (示例)...
        {
          id: 'q2',
          text: '感觉疲倦或没有活力',
          type: 'single',
          selected: null,
          options: [
            { id: 'a1', text: '完全没有', score: 0 },
            { id: 'a2', text: '有几天', score: 1 },
            { id: 'a3', text: '一半以上的时间', score: 2 },
            { id: 'a4', text: '几乎每天', score: 3 }
          ]
        },
        {
          id: 'q3',
          text: '入睡困难、睡不安稳或睡眠过多',
          type: 'single',
          selected: null,
          options: [
            { id: 'a1', text: '完全没有', score: 0 },
            { id: 'a2', text: '有几天', score: 1 },
            { id: 'a3', text: '一半以上的时间', score: 2 },
            { id: 'a4', text: '几乎每天', score: 3 }
          ]
        }
      ];
  
      this.setData({
        title,
        questions,
        totalQuestions: questions.length,
        currentQuestion: questions[0]
      });
      
      wx.setNavigationBarTitle({
        title
      });
    },
  
    // 选择选项
    selectOption(e) {
      const optionId = e.currentTarget.dataset.optionId;
      const { questions, currentIndex } = this.data;
      
      // 创建questions的深拷贝
      const updatedQuestions = JSON.parse(JSON.stringify(questions));
      
      // 更新当前问题的选中状态
      updatedQuestions[currentIndex].selected = optionId;
      
      // 计算完成数量
      const completed = updatedQuestions.filter(q => q.selected !== null).length;
      
      this.setData({
        questions: updatedQuestions,
        completed,
        currentQuestion: updatedQuestions[currentIndex]
      });
      
      // 如果不是最后一题且选好答案，自动跳转到下一题
      if (currentIndex < updatedQuestions.length - 1) {
        setTimeout(() => {
          this.setData({
            currentIndex: currentIndex + 1,
            currentQuestion: updatedQuestions[currentIndex + 1]
          });
        }, 300);
      }
    },
  
    // 上一题
    prevQuestion() {
      const { currentIndex } = this.data;
      if (currentIndex > 0) {
        this.setData({
          currentIndex: currentIndex - 1,
          currentQuestion: this.data.questions[currentIndex - 1]
        });
      }
    },
  
    // 下一题
    nextQuestion() {
      const { currentIndex, questions } = this.data;
      if (currentIndex < questions.length - 1) {
        this.setData({
          currentIndex: currentIndex + 1,
          currentQuestion: questions[currentIndex + 1]
        });
      }
    },
  
    // 提交问卷
    submitQuestionnaire() {
      const hasUnanswered = this.data.questions.some(q => q.selected === null);
      if (hasUnanswered) {
        wx.showToast({
          title: '请回答所有问题',
          icon: 'none'
        });
        return;
      }
      
      // 计算结果分数
      let totalScore = 0;
      this.data.questions.forEach(q => {
        const selectedOption = q.options.find(opt => opt.id === q.selected);
        totalScore += selectedOption ? selectedOption.score : 0;
      });
      
      // 显示结果
      wx.showToast({
        title: '问卷提交成功',
        icon: 'success',
        duration: 1500,
        complete: () => {
          setTimeout(() => {
            // 返回到问卷列表页
            wx.navigateBack();
          }, 1500);
        }
      });
    }
  });