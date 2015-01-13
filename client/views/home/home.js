Template.home.rendered = function() {

    $('.menu .item').tab();
    var voterId = Meteor.userId();
    console.log(voterId);

};

Template.home.helpers({
  maleParticipants: function() {
    return Participants.find({gender: "male"},{sort: {votes: -1}});
  },
  femaleParticipants: function() {
    return Participants.find({gender: "female"},{sort: {votes: -1}});
  }
});
