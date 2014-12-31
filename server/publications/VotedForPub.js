
Meteor.publish("VotedFor", function () {
    return VotedFor.find({});
});

