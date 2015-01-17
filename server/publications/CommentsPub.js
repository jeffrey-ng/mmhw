Meteor.publish('Comments', function () {
  return Comments.find();
});
