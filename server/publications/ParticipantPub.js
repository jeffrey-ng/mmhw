
Meteor.publish("allParticipants", function () {
    return Participants.find({});
});

Meteor.publish("allJudges", function () {
    return Participants.find({role: "judge"});
});

Meteor.publish("allContestants", function() {
    return Participants.find({role: "contestant"});
});
