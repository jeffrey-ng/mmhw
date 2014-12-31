VotedFor = new Mongo.Collection('VotedFor');

Schemas = {};

Schemas.Vote = new SimpleSchema({

  userId: {
    type: String
  },

  participants: {
    type: [String],
    defaultValue: [],
    optional: true
  }

});

VotedFor.attachSchema(Schemas.Vote);

// Collection2 already does schema checking
// Add custom permission rules if needed
if (Meteor.isServer) {
  VotedFor.allow({
    insert : function () {
      return true;
    },
    update : function () {
      return true;
    },
    remove : function () {
      return true;
    }
  });
}
