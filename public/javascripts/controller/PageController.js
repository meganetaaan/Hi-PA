var controller = {
  __name: 'hipa.controller.PageController',
  questionListController: hipa.controller.QuestionListController,
  presentationController: hipa.controller.PresentationController,
  __meta: {
      questionListController: {
          rootElement: '#question_list_container',
      },
      presentationController: {
          rootElement: '.reveal',
      },
  },
};
h5.core.expose(controller);