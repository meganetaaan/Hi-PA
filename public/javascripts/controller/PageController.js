var controller = {
  __name: 'hipa.controller.PageController',
  questionListController: hipa.controller.QuestionListController,
  scriptController: hipa.controller.ScriptController,
  tooltipController: hipa.controller.TooltipController,
  timeController: hipa.controller.TimeController,
  alertController: hipa.controller.AlertController,
  //presentationController: hipa.controller.PresentationController,
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
      timeController: {
          rootElement: '#script-container',
      },
      alertController: {
          rootElement: '#script-container',
      },
      /*
      presentationController: {
          rootElement: '.reveal',
      },
      */
  },
};
h5.core.expose(controller);
