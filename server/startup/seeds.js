Meteor.startup(function() {

  Factory.define('participant', Participants, {
    name: function() { return Fake.sentence(5); },
    description: function(){return Fake.sentence(20);},
    role: function(){return Fake.fromArray(['judge','contestant']);},
    pic: function(){return "/images/background/background1.jpg";},
    votes: function() {return _.random(1,20);},
    school: function() { return Fake.fromArray(['U3 Science', 'U2 Arts']);}
  });

  if (Participants.find({}).count() === 0) {
    _(10).times(function(n) {
        Factory.create('participant');
      });
  }


});
