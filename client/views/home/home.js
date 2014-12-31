Template.home.rendered = function() {

    var voterId = Meteor.userId();
    console.log(voterId);

};

Template.home.helpers({
  participants: function() {
    return Participants.find();
  }
});
