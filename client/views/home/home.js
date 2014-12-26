Template.home.rendered = function() {

};

Template.home.helpers({
  participants: function() {
    return Participants.find();
  }
});
