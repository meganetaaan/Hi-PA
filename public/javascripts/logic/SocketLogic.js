var socketLogic = {
  __name: 'hipa.logic.SocketLogic',
  socket: io(),
  __construct: function() {
      socket.on('ADD_QUESTION', this.addQuestion);
      socket.on('DELETE_QUESTION', this.deleteQuestion);
      socket.on('UPDATE_QUESTION', this.updateQuestion);
  },
  addQuestion: function(data) {
    hipa.logic.QuestionLogic.addToLocal(data);
  },
  deleteQuestion: function(question_id) {
    hipa.logic.QuestionLogic.deleteFromLocal(question_id);
  },
  updateQuestion: function(data) {
    const question_id = data.id;
    const like_cnt = data.like_cnt;
    hipa.logic.QuestionLogic.updateLikesFromLocal(question_id, like_cnt);
  }
}

h5.core.expose(socketLogic);