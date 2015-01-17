Meteor.methods({
    incVote: function(participantId, voterId) {
        check(participantId, String);
        check(voterId, String);
        console.log('upvoating');
        console.log(voterId);
        if (Participants.find({_id: participantId, 'votedBy': {"$in" : [voterId]}}).count() > 0) {
            console.log("found");
        } else {
            Participants.update({_id: participantId}, { $inc: {'votes': 1}});
            Participants.update({_id: participantId}, { $push: { votedBy : voterId}});
            VotedFor.update({userId: voterId}, {$push: {participants: participantId}}, {upsert: true});
        }



    },
    decVote: function(participantId, voterId) {
        check(participantId, String);
        check(voterId, String);
        // console.log(voterId);
        if (Participants.find({_id: participantId, 'votedBy': {"$in" : [voterId]}}).count() > 0) {
            // console.log("found");
             Participants.update({_id: participantId}, { $inc: {'votes': -1}});
             Participants.update({_id: participantId}, { $pull: { votedBy: voterId}});
            VotedFor.update({userId: voterId}, {$pull: {participants: participantId}});
        } else {
            // console.log('not found');
        }


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
    },

    updateParticipantVideo: function(participantId, vidId, pw) {
        check (participantId, String);
        check (vidId, String);
        check (pw, String);

        if (pw == 'gomcssgo') {
            Participants.update({_id: participantId}, {$set: { videoID: vidId}});
        }

    }

})