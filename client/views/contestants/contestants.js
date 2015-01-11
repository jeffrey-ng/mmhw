Template.contestants.helpers({
  participants: function() {
    return Participants.find();
  },
  maleContestants: function() {
        return Participants.find({role: "contestant", gender: "male"});
  },
  femaleContestants: function() {
        return Participants.find({role: "contestant", gender: "female"});
  }

});

Template.contestants.rendered = function(){

    $('.menu .item').tab();
}

Template['contestants'].events({
});
