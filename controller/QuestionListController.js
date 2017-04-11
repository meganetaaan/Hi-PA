var controller = {
    __name: 'hipa.controller.QuestionListController',

    __templates: 'view/questionList.ejs', 

    questionListLogic: hipa.logic.QuestionListLogic,
    questionDataModel: hipa.data.QuestionDataModel,
    __init: function(context) {
      const indicator = this.triggerIndicator();
      indicator.show();
      this.questionListLogic.getQuestionList().done(()=>{
        this._updateView();
        indicator.hide();
      });
    },

    _updateView: function() {
      this.view.update('#question_list', 'questionList', {questionList: this.questionDataModel.toArray()});
    },

    '#question_submit_btn click' : function(context, $el) {
      const $textarea = this.$find('#question_textarea');
      const question = $textarea.val();
      $textarea.prop('disabled', true);
      $el.prop('disabled', true);
      this.questionListLogic.addQuestion(question).done(()=>{
        this._updateView();
        $textarea.val('');
        $textarea.prop('disabled', false);
        $el.prop('disabled', false);
      });
    },
    '.question_delete_btn click': function(context, $el) {
      const id = $el.attr('question_id');
      $el.prop('disabled', true);
      this.questionListLogic.deleteQuestion(id).done(()=>{
        this._updateView();
      })
    },
  };
  h5.core.expose(controller);