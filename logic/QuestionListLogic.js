var questionListLogic = {
  __name: 'hipa.logic.QuestionListLogic',
  model: hipa.data.QuestionDataModel,
  questionList: h5.core.data.createObservableArray(),

  getQuestionList: function() {
    return h5.ajax({
      type: 'GET',
      dataType: 'JSON',
      url: config.url + '/questions',
    }).then((json) => {
      const modelList = this.model.create(json);
      this.questionList.splice(0,this.questionList.length);
      this.questionList.copyFrom(modelList);
    });
  },

  add: function(question, nickname, slideNumber, password) {
    return h5.ajax({
      type: 'POST',
      dataType: 'JSON',
      url: config.url + '/questions',
      data: {question, nickname, slideNumber, password},
    }).then((json) => {
      const questionModelItem = this.model.create(json);
      this.questionList.push(questionModelItem);
    });
  },

  delete: function(question_id, password) {
    return h5.ajax({
      type: 'DELETE',
      dataType: 'JSON',
      url: config.url + '/questions',
      data: {question_id},
    }).then(() => {
      for (let i = 0, len = this.questionList.length; i < len; i++) {
        if (this.questionList.get(i).get('id') === question_id) {
          this.model.remove(question_id);
          this.questionList.splice(i, 1);
          break;
        }
      }
    });
  },

  toggleLike: function(question_id) {
    const questionModel = this.model.get(question_id);
    const isLiked = questionModel.get('isLiked');
    const origLike = questionModel.get('like');
    questionModel.set('isLiked', !isLiked);
    questionModel.set('like', origLike + (isLiked ? -1 : +1));
    return h5.ajax({
      type: 'POST',
      dataType: 'JSON',
      url: config.url + '/questions/like',
      data: {question_id},
    }).then((json) => {

    }, () => { // If failed
      questionModel.set('isLiked', isLiked);
      questionModel.set('like', origLike);
    });
  },

  toggleDelete: function(question_id) {
    const question = this._getQuestion(question_id);
    question.set('isDeleteShown', !question.get('isDeleteShown'));
  },

  refreshLiked: function(question_id, num) {
    const questionModel = questionDataModel.get(question_id);
    questionModel.set('liked', num);
    return;
  },
}

h5.core.expose(questionListLogic);