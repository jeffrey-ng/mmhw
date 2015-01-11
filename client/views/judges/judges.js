
Template['judges'].events({
});

Template.judges.rendered = function(){

    $('.menu .item').tab();
}
Template.judges.helpers({
  participants: function() {
    return Participants.find();
  },
   maleJudges: function() {
        return Participants.find({role: "judge", gender: "male"});
  },
  femaleJudges: function() {
        return Participants.find({role: "judge", gender: "female"});
  }
});
