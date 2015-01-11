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

    },
    createParticipant: function(name, gender, desc,horoscope,quote, role, picID, school, pw) {
        console.log('inserting');
        if (pw == 'gomcssgo') {
            return Participants.insert({
            name: name,
            gender: gender,
            description: desc,
            horoscope: horoscope,
            quote: quote,
            role: role,
            pic: picID,
            votes: 0,
            school: school
        });
        }
    }

})