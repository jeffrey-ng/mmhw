Template['participantTile'].helpers({
});

Template.participantTile.rendered = function() {
  $('.ui.rating').rating({onRate: function(){
    console.log($(this).rating('get rating'));
    console.log(this.id);
    var updateVal = $(this).rating('get rating');
    var pId = this.id;
    if (updateVal == 0) {
      console.log("Subtract");
       check(pId, String);
       Meteor.call('updateVote', pId, -1, function (error, result) {
                if (error) console.log(error);
            });
    } else {
      console.log("Add");
          check(pId, String);

       Meteor.call('updateVote', pId, 1, function (error, result) {
                if (error) console.log(error);
            });

    }

  }
  });

};

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
  }
});
