
Template['updateUserList'].events({
});

Template.updateUserList.helpers({
    participants: function() {
        return Participants.find();
    }
});