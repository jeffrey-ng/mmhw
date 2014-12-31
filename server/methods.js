Meteor.methods({
    incVote: function(participantId, voterId) {
        check(participantId, String);
        check(voterId, String);

        Participants.update({_id: participantId}, { $inc: {'votes': 1}});
        Participants.update({_id: participantId}, { $push: { votedBy : voterId}});
        VotedFor.update({userId: voterId}, {$push: {participants: participantId}});
    },
    decVote: function(participantId, voterId) {
        check(participantId, String);
        check(voterId, String);

        Participants.update({_id: participantId}, { $inc: {'votes': -1}});
        Participants.update({_id: participantId}, { $pull: { votedBy: voterId}});
        VotedFor.update({userId: voterId}, {$pull: {participants: participantId}});

    }

})