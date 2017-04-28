QUnit.test( "ok test", function( assert ) {
  assert.ok( true, "true succeeds" );
  assert.ok( "non-empty", "non-empty string succeeds" );

  assert.ok( false, "false fails" );
  assert.ok( 0, "0 fails" );
  assert.ok( NaN, "NaN fails" );
  assert.ok( "", "empty string fails" );
  assert.ok( null, "null fails" );
  assert.ok( undefined, "undefined fails" );
});

Qunit.test("listController", function(assert) {
    var fixture = $('#qunit-fixture');
    h5.core.controller('#container', hipa.controller.QuestionListController);
    // TODO: QUnit test
});