var controller = {
    __name: 'hipa.controller.FeedbackController',

    __templates: ['public/views/feedback.ejs'],

    socket: io('/socket/feedback'),

    __init: function(context) {
      this.view.update('{rootElement}','feedback');
    },

    _speedFeedback(sign) {
      this.socket.emit('SpeedFeedback', {sign: sign});
    },

    _volumeFeedback(sign) {
      this.socket.emit('VolumeFeedback', {sign: sign});
    },

    '.feedback-volume click': function(context, $el) {
      let sign = Number.parseInt($el.attr('sign'));
      this._volumeFeedback(sign);
    },

    '.feedback-speed click': function(context, $el) {
      let sign = Number.parseInt($el.attr('sign'));
      this._speedFeedback(sign);
    }
  };
  h5.core.expose(controller);
