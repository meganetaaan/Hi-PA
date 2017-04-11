var questionListLogic = {
  __name: 'hipa.logic.QuestionListLogic',
  questionDataModel: hipa.data.QuestionDataModel,
  duration: 1000,
  sequence: h5.core.data.createSequence(3, 1, h5.core.data.SEQ_STRING),
  getQuestionList: function() {
    var dfd = this.deferred();
    setTimeout(()=> {
      const tmpList = [{id: '1', question: "no"}, {id: '2', question: "yes"}];
      questionDataModel.create(tmpList);
      dfd.resolve();
    }, this.duration);
    return dfd.promise();
  },
  addQuestion: function(question) {
    var dfd = this.deferred();
    setTimeout(()=> {
      const tmpQuestion = {question: question, id: this.sequence.next()}
      questionDataModel.create(tmpQuestion);
      dfd.resolve();
    }, this.duration);
    return dfd.promise();
  },
  deleteQuestion: function(question_id) {
    var dfd = this.deferred();
    setTimeout(()=>{
      questionDataModel.remove(question_id);
      dfd.resolve();
    }, this.duration);
    return dfd.promise();
  }
}

h5.core.expose(questionListLogic);