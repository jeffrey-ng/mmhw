
Meteor.publish("allParticipants", function () {
    return Participants.find({});
});

Meteor.publish("allJudges", function () {
    return Participants.find({role: "judge"},{sort: {votes: -1}});
});

Meteor.publish("allContestants", function() {
    return Participants.find({role: "contestant"},{sort: {votes:-1}});
});

Meteor.publish("maleJudges", function () {
    return Participants.find({role: "judge", gender: "male"});
});

Meteor.publish("femaleJudges", function () {
    return Participants.find({role: "judge", gender: "female"});
});

Meteor.publish("maleContestant", function () {
    return Participants.find({role: "contestant", gender: "male"});
});

Meteor.publish("femaleContestant", function () {
    return Participants.find({role: "contestant", gender: "female"});
});