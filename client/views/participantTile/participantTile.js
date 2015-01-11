Template['participantTile'].helpers({});

Template.participantTile.helpers({
  isVotedFor: function() {
    var voterId = Meteor.userId();
    var pId = this._id;
    if (VotedFor.findOne({
        userId: voterId,
        participants: pId
      })) {
      console.log("true");
      return true;
    } else {
      console.log("false");
      return false;
    }

  }
})

Template.participantTile.events({
  'click .openModalPic': function(e,t) {
    e.preventDefault();
    // e.preventDefault();
    // var self = this;
    // console.log("hi modal");
    // t.$('.modal')
    //   .modal({
    //     onApprove: function() {
    //       console.log('pressed ok');
    //       return false;
    //     },
    //     onDeny: function() {
    //       console.log('closed');
    //       return false;
    //     }
    //   })
    //   .modal('toggle');
    //    $('.ui.video').video();
    SemanticModal.generalModal('generalModal', {name: this.name, pic: this.pic, school: this.school, horoscope: this.horoscope, quote: this.quote});
    $('.ui.video').video();

  },
  'click .openModalLink': function(e,t) {
    e.preventDefault();
    // var self=this;
    // console.log("hi mymodalPic");
    // t.$('.modal')
    //   .modal({
    //     onApprove: function() {
    //       console.log('pressed ok');
    //       return false;
    //     },
    //     onDeny: function() {
    //       console.log('closed');
    //       return false;
    //     }
    //   })
    //   .modal('show');
    //   $('.ui.video').video();
     SemanticModal.generalModal('generalModal', {name: this.name, pic: this.pic, school: this.school, horoscope: this.horoscope, quote: this.quote});
    $('.ui.video').video();

  },

  'click #myVote': function(e) {
    console.log("hi");
    $('#myVote').rating()
  },

  'click #myRating': function(e) {
    e.preventDefault();
  },
  'click #removeVote': function(e) {
    e.preventDefault();
    var voterId = Meteor.userId();
    var pId = this._id;

    console.log(this._id);
    Meteor.call('decVote', pId, voterId, function(error, result) {
      if (error) console.log(error);
    });
  },
  'click #addVote': function(e) {
    e.preventDefault();
    var voterId = Meteor.userId();
    var pId = this._id;
    console.log(this._id);
    Meteor.call('incVote', pId, voterId, function(error, result) {
      if (error) console.log(error);
    });
  }

});