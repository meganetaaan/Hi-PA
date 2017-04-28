var controller = {
  __name: 'hipa.controller.PageController',
  questionListController: hipa.controller.QuestionListController,
  __meta: {
      questionListController: {
          rootElement: '#question_list_container',
      },
  },
};
h5.core.expose(controller);