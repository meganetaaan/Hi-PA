var controller = {
  __name: 'hipa.controller.PageController',
  questionListController: hipa.controller.QuestionListController,
  scriptController: hipa.controller.ScriptController,
  tooltipController: hipa.controller.TooptipController,
  slideController: hipa.controller.SlideController,
  __meta: {
      questionListController: {
          rootElement: '#question-container',
      },
      scriptController: {
          rootElement: '#script-container',
      },
      tooltipController: {
          rootElement: '#script-container',
      },
      slideController: {
          rootElement: '#slide-container',
      },
  },
};
h5.core.expose(controller);
