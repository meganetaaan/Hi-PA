
var manager = h5.core.data.createManager ( 'DataManager' , 'hipa.data' );
var questionDataModel = manager.createModel({
  name: 'ScriptModel',
  schema: {
    id: {
      id: true
    },
    slide_number: {
      type: 'int'
    },
    script: {
      type: 'string'
    }
  },
});

h5.u.obj.expose('hipa.data', {
  ScriptModel: ScriptModel
});


