var controller = {
  __name: 'hipa.controller.PageController',
  questionListController: hipa.controller.QuestionListController,
  //presentationController: hipa.controller.PresentationController,
  __meta: {
      questionListController: {
          rootElement: '#question-container',
      },
      /*
      presentationController: {
          rootElement: '.reveal',
      },
      */
  },
};
h5.core.expose(controller);