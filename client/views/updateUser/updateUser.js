
Template.updateUser.events({
    "submit .update-User": function(e) {
        e.preventDefault();
        var pId = this._id;

        var vidID = getFieldValue('vidLink',pId);
        var pw = getFieldValue('pw',pId);
        console.log(pId);
        console.log(vidID);

        if (vidID && pId) {
            Meteor.call('updateParticipantVideo',pId,vidID,pw, function(error,result) {
                if(error) console.log(error);
            });
        }
        return false;
    }

});

Template.updateUser.rendered = function () {
    $('.ui.radio.checkbox').checkbox();
    console.log('checkbox');
};


   function getFieldValue(fieldId, id) {
      // 'get field' is part of Semantics form behavior API
      var fid = '.update-User.ui.form.' + id;
      return $(fid).form('get field', fieldId).val();
   }