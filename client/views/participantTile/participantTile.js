Template['participantTile'].helpers({
});

Template.participantTile.helpers({
  isVotedFor: function() {
    var voterId = Meteor.userId();
 var pId = this._id;
    if (VotedFor.findOne({userId: voterId, participants: pId})) {
      console.log("true");
      return true;
    } else {
      console.log("false");
    return false;
    }

  }
})

Template.participantTile.events({
  'click #myModal': function (e) {
    e.preventDefault();
    console.log("hi");
    $('#modalView')
      .modal({
        onApprove : function() {
          console.log('pressed ok');
        }
      })
      .modal('show')
    ;
  },
  'click #myModalPic': function (e) {
    e.preventDefault();
     $('#modalView')
      .modal({
        onApprove : function() {
          console.log('pressed ok');
        }
      })
      .modal('show')
    ;
  },

  'click #myVote': function (e) {
    console.log("hi");
    $('#myVote').rating()
  },

  'click #myRating': function (e) {
    e.preventDefault();
  },
  'click #removeVote': function(e) {
    e.preventDefault();
    var voterId = Meteor.userId();
    var pId = this._id;

    console.log(this._id);
      Meteor.call('decVote', pId,voterId, function (error, result) {
                if (error) console.log(error);
    });
  },
   'click #addVote': function(e) {
    e.preventDefault();
    var voterId = Meteor.userId();
    var pId = this._id;
    console.log(this._id);
   Meteor.call('incVote', pId,voterId, function (error, result) {
                if (error) console.log(error);
            });
  }

});
