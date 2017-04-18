var controller = {
    __name: 'hipa.controller.QuestionListController',

    __templates: ['view/questionList.ejs', 'view/questionForm.ejs'],

    questionListLogic: hipa.logic.QuestionListLogic,
    questionDataModel: hipa.data.QuestionDataModel,
    __init: function(context) {
      //const indicator = this.triggerIndicator();
      //indicator.show();
      this.view.update('#question_list', 'questionList', null);

      this.questionListLogic.getQuestionList().done((questionList)=>{
        this.view.bind( 'h5view#questionList', {
          questionList,
        });
      });

      this.view.update('#question_form_container', 'questionForm', null);
      this.$find('#question_form').submit(() => {
        return this._submitForm();
      });
    },

    _submitForm: function() {
      const $nickname = this.$find('#question_form input[name=nickname]');
      const $slidenumber = this.$find('#question_form input[name=slide_number]');
      const $question = this.$find('#question_form input[name=question]');
      const $password = this.$find('#question_form input[name=password]');
      const slidenumberValue = $slidenumber.val();
      const slidenumber = slidenumberValue === '' ? null : parseInt(slidenumberValue);
      this.questionListLogic.add($question.val(), $nickname.val(), slidenumber, $password.val()).done(() => {
        $nickname.val(null);
        $slidenumber.val(null);
        $question.val(null);
        $password.val(null);
      });

      return false;
    },

    _getQuestionId: function($el) {
      return $el.closest('.question_div').attr('question-id');
    },

    _getQuestionDiv: function($el) {
      return $el.closest('.question_div');
    },

    '#question_list input[name=show_delete] click': function(context, $el) {
      const questionId = this._getQuestionId($el);
      this.questionListLogic.toggleDelete(questionId);
    },

    '#question_list input[name=delete_question] click': function(context, $el) {
      const $questionDiv = this._getQuestionDiv($el);
      const questionId = this._getQuestionId($el);
      const password = $questionDiv.find('input[name=password]').val();
      this.questionListLogic.delete(questionId, password).done(() => {
        // Nothing
      }).fail( (errMsg) => {
        alert('Failed to delete question : ' + errMsg);
      });
    },

    '#question_list input[name=toggle_like] click' : function(context, $el) {
      const questionId = this._getQuestionId($el);
      this.questionListLogic.toggleLike(questionId).done(()=> {
      })
    }
  };
  h5.core.expose(controller);