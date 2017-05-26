var controller = {
    __name: 'hipa.controller.FeedbackController',

    __templates: ['public/views/feedback.ejs'],

    socket: null,

    __init: function(context) {
      this.view.update('{rootElement}','feedback');
      this._setSocket();
    },

    _setSocket: function() {
      if (config.isPresenter) {
        this.socket = io('/socket/feedback/presenter');
        // TODO: Feedback ui for presenter
      } else {
        this.socket = io('/socket/feedback/audience');
      }
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
