Meteor.methods({
    updateVote: function(participantId, value) {
        check(participantId, String);
        check(value, Number);
        Participants.update({_id: participantId}, { $inc: {'votes': value}});
    }

})