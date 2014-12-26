Participants = new Mongo.Collection('Participants');

Schemas = {};

Schemas.Participant = new SimpleSchema({

name: {
      type: String
    },

    description: {
      type: String,
    },
    role: {
      type: String,
    },
    pic: {
      type: String,
    },

    votes: {
      type: Number,
      min: 0,
    },

    school: {
      type: String,
    },
    createdAt: {
      type: Date,
        autoValue: function() {
          if (this.isInsert) {
            return new Date;
          } else if (this.isUpsert) {
            return {$setOnInsert: new Date};
          } else {
            this.unset();
          }
        }
    }
});

Participants.attachSchema(Schemas.Participant);

// Collection2 already does schema checking
// Add custom permission rules if needed
if (Meteor.isServer) {
  Participants.allow({
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