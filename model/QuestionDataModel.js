var manager = h5.core.data.createManager ( 'DataManager' , 'hipa.data' );
var questionDataModel = manager.createModel({
  name: 'QuestionDataModel',
  schema: {
    id : {
      id : true
    },
    question : {
      type: 'string'
    },
  },
});

h5.u.obj.expose('hipa.data', {
  QuestionDataModel: questionDataModel
});