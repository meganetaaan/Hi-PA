var manager = h5.core.data.createManager ( 'DataManager' , 'hipa.data' );
var questionDataModel = manager.createModel({
  name: 'QuestionDataModel',
  schema: {
    id : {
      id : true
    },
    question : { type: 'string' },
    slideNumber: { type: 'number' },
    nickname: { type: 'string' },
    like: { type: 'integer', defaultValue: 0},
    time: { type: 'integer' },
    timeString : {
      depend: {
        on: 'time',
        calc: function() {
          const date = new Date(this.get('time'));
          return date.toString();
        }
      }
    },
    isLiked: { type: 'boolean', defaultValue: false },
    likeBtnValue: {
      depend: {
        on: 'isLiked',
        calc: function() {
          return this.get('isLiked') ? 'unlike' : 'like';
        }
      }
    },
    isDeleteShown: {type: 'boolean', defaultValue: false },
    deleteDivDisplay: {
      depend: {
        on: 'isDeleteShown',
        calc: function() {
          return this.get('isDeleteShown') ? '' : 'none';
        }
      }
    },
    deleteButtonText : {
      depend: {
        on: 'isDeleteShown',
        calc: function() {
          return this.get('isDeleteShown') ? 'Hide delete' : 'Show delete';
        },
      },
    },
  },
});

h5.u.obj.expose('hipa.data', {
  QuestionDataModel: questionDataModel
});