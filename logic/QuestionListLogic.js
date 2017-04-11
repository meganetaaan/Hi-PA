var questionListLogic = {
  __name: 'hipa.logic.QuestionListLogic',
  questionDataModel: hipa.data.QuestionDataModel,
  getQuestionList: function() {
    return h5.ajax({
      type: 'GET',
      dataType: 'JSON',
      url: config.url + '/questions',
    }).then((json) => {
      questionDataModel.create(json);
    });
  },
  addQuestion: function(question) {
    return h5.ajax({
      type: 'POST',
      dataType: 'JSON',
      url: config.url + '/questions',
      data: {question: question},
    }).then((json) => {
      questionDataModel.create(json);
    });
  }
}

h5.core.expose(questionListLogic);