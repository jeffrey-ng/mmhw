
// Template.participantTile.helpers({
//   isVotedFor: function() {
//     var voterId = Meteor.userId();
//     var pId = this._id;
//     if (VotedFor.findOne({
//         userId: voterId,
//         participants: pId
//       })) {
//       console.log("true");
//       return true;
//     } else {
//       console.log("false");
//       return false;
//     }

//   }
// })

// Template.myModalView.events({
//   'click #myModal': function(e) {
//     e.preventDefault();
//     console.log("hi modal");
//     $('#modalView')
//       .modal({
//         onApprove: function() {
//           console.log('pressed ok');
//         }
//       })
//       .modal('show');
//        $('.ui.video').video();
//   },
//   'click #myModalPic': function(e) {
//     e.preventDefault();
//     console.log("hi mymodalPic");
//     $('#modalView')
//       .modal({
//         onApprove: function() {
//           console.log('pressed ok');
//         }
//       })
//       .modal('show');
//       $('.ui.video').video();
//   }


// });

Template.myModalView.rendered = function() {
  //  $('#modalView')
  //     .modal({
  //       onApprove: function() {
  //         console.log('pressed ok');
  //       }
  //     })
  //     .modal('show');
  // $('.ui.video').video();
}