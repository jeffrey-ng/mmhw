
Template.header.created = function () {
  Session.set('isActive', false);
  Session.set('showLogin', false);
};

Template['header'].helpers({
  showLogin: function () {
    return Session.get('showLogin');
  },
  isActive: function () {
    return Session.get('isActive') ? 'active' : '';
  },
  animateClass: function () {
    return Session.get('isActive') ? 'fadeIn' : 'fadeOut';
  },
  iconClass: function () {
    return Meteor.user() ? 'user' : 'sign in';
  }
});

Template['header'].events({
  'click .resize.button' : function () {
    var showLogin = Session.get('showLogin');

    Session.set('isActive', !Session.get('isActive'));

    setTimeout(function () {
      Session.set('showLogin', !Session.get('showLogin'));
    }, 600);
  },
  'click .log-out.button' : function () {
    Meteor.logout();
  },
  'click #fbLogin': function(e) {
    Meteor.loginWithFacebook({}, function(err) {
      if (err) {
        console.log(err);
      }
      var idd = Meteor.userId();
      var voterID = Session.get('voterID');
      var myVoterId = VotedFor.findOne({userId: idd});

      if (voterID==null || voterID == undefined || myVoterId == undefined) {
        console.log("creating voter session");
          var voterID = VotedFor.insert({userId: idd});
          Session.set('voterID', idd);
      }

    });
  },
  'click #fbLogout': function(e) {
    Meteor.logout(function(err) {
      if (err) {
        console.log(err);
      }
      delete Session.keys['voterID'];
    });
  }
});

