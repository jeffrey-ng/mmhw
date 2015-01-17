Template['createUser'].helpers({});

Template.createUser.events({
    "submit .new-User": function(e) {
        // This function is called when the new task form is submitted
        e.preventDefault();
        console.log("submitted");
        var name = getFieldValue('userName');

        var desc = getFieldValue('desc');
        var gender = getFieldValue('gender');
        var male = $('#male').prop('checked');
        if (male) {
            gender = 'male';
        } else {
            gender = 'female';
        }

        var role;
        var contest = $('#contest').prop('checked');

        if (contest) {
            role = 'contestant';
        } else {
            role = 'judge';
        }

        var picID = getFieldValue('photoLink');
        var school = getFieldValue('school');
        var pw = getFieldValue('pw');
        var quote = getFieldValue('quote');
        var horoscope = getFieldValue('horoscope');

        if (name && gender && role && picID && school && desc) {
            Meteor.call('createParticipant', name, gender, desc, horoscope, quote, role, picID, school, pw, function(error, result) {
                if (error) console.log(error);
            });
        }
        // Prevent default form submit
        return false;

    }
});

Template.createUser.rendered = function() {
    $('.ui.radio.checkbox')
        .checkbox();

}

function getFieldValue(fieldId) {
    // 'get field' is part of Semantics form behavior API
    return $('.ui.form').form('get field', fieldId).val();
}