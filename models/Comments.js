Comments = new Mongo.Collection('Comments');

Schemas = {};

Schemas.Comment = new SimpleSchema( {
  createdBy: {
    type: String,
    optional: false
  },

  value: {
    type: String,
    optional: false
  },

  participantId: {
    type: String
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

Comments.attachSchema(Schemas.Comment);

// Collection2 already does schema checking
// Add custom permission rules if needed
if (Meteor.isServer) {
  Comments.allow({
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
