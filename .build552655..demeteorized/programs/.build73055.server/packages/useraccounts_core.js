(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var Accounts = Package['accounts-base'].Accounts;
var check = Package.check.check;
var Match = Package.check.Match;
var _ = Package.underscore._;
var Router = Package['iron:router'].Router;
var RouteController = Package['iron:router'].RouteController;
var ReactiveVar = Package['reactive-var'].ReactiveVar;
var Iron = Package['iron:core'].Iron;

/* Package-scope variables */
var AccountsTemplates, Field, STATE_PAT, ERRORS_PAT, INFO_PAT, INPUT_ICONS_PAT, ObjWithStringValues, TEXTS_PAT, CONFIG_PAT, FIELD_SUB_PAT, FIELD_PAT, AT;

(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/useraccounts:core/lib/field.js                                                                          //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
// ---------------------------------------------------------------------------------                                // 1
                                                                                                                    // 2
// Field object                                                                                                     // 3
                                                                                                                    // 4
// ---------------------------------------------------------------------------------                                // 5
                                                                                                                    // 6
                                                                                                                    // 7
Field = function(field){                                                                                            // 8
    check(field, FIELD_PAT);                                                                                        // 9
    _.defaults(this, field);                                                                                        // 10
                                                                                                                    // 11
    this.validating = new ReactiveVar(false);                                                                       // 12
    this.status = new ReactiveVar(null);                                                                            // 13
};                                                                                                                  // 14
                                                                                                                    // 15
if (Meteor.isClient)                                                                                                // 16
    Field.prototype.clearStatus = function(){                                                                       // 17
        return this.status.set(null);                                                                               // 18
    };                                                                                                              // 19
if (Meteor.isServer)                                                                                                // 20
    Field.prototype.clearStatus = function(){                                                                       // 21
        // Nothing to do server-side                                                                                // 22
        return                                                                                                      // 23
    };                                                                                                              // 24
                                                                                                                    // 25
Field.prototype.fixValue = function(value){                                                                         // 26
    if (this.type === "checkbox")                                                                                   // 27
        return !!value;                                                                                             // 28
    if (this.type === "select")                                                                                     // 29
        // TODO: something working...                                                                               // 30
        return value;                                                                                               // 31
    if (this.type === "radio")                                                                                      // 32
        // TODO: something working...                                                                               // 33
        return value;                                                                                               // 34
    // Possibly applies required transformations to the input value                                                 // 35
    if (this.trim)                                                                                                  // 36
        value = value.trim();                                                                                       // 37
    if (this.lowercase)                                                                                             // 38
        value = value.toLowerCase();                                                                                // 39
    if (this.uppercase)                                                                                             // 40
        value = value.toUpperCase();                                                                                // 41
    return value;                                                                                                   // 42
};                                                                                                                  // 43
                                                                                                                    // 44
if (Meteor.isClient)                                                                                                // 45
    Field.prototype.getDisplayName = function(state){                                                               // 46
        var dN = this.displayName;                                                                                  // 47
        if (_.isObject(dN))                                                                                         // 48
            dN = dN[state] || dN["default"];                                                                        // 49
        if (!dN)                                                                                                    // 50
            dN = this._id;                                                                                          // 51
        return dN;                                                                                                  // 52
    };                                                                                                              // 53
                                                                                                                    // 54
if (Meteor.isClient)                                                                                                // 55
    Field.prototype.getPlaceholder = function(state){                                                               // 56
        var placeholder = this.placeholder;                                                                         // 57
        if (_.isObject(placeholder))                                                                                // 58
            placeholder = placeholder[state] || placeholder["default"];                                             // 59
        if (!placeholder)                                                                                           // 60
            placeholder = this._id;                                                                                 // 61
        return placeholder;                                                                                         // 62
    };                                                                                                              // 63
                                                                                                                    // 64
Field.prototype.getStatus = function(){                                                                             // 65
    return this.status.get();                                                                                       // 66
};                                                                                                                  // 67
                                                                                                                    // 68
if (Meteor.isClient)                                                                                                // 69
    Field.prototype.getValue = function(tempalteInstance){                                                          // 70
        if (this.type === "checkbox")                                                                               // 71
            return !!(tempalteInstance.$("#at-field-" + this._id + ":checked").val());                              // 72
        if (this.type === "radio")                                                                                  // 73
            return tempalteInstance.$("[name=at-field-"+ this._id + "]:checked").val();                             // 74
        return tempalteInstance.$("#at-field-" + this._id).val();                                                   // 75
    };                                                                                                              // 76
                                                                                                                    // 77
if (Meteor.isClient)                                                                                                // 78
    Field.prototype.hasError = function() {                                                                         // 79
        return this.negativeValidation && this.status.get();                                                        // 80
    };                                                                                                              // 81
                                                                                                                    // 82
if (Meteor.isClient)                                                                                                // 83
    Field.prototype.hasIcon = function(){                                                                           // 84
        if (this.showValidating && this.isValidating())                                                             // 85
            return true;                                                                                            // 86
        if (this.negativeFeedback && this.hasError())                                                               // 87
            return true;                                                                                            // 88
        if (this.positiveFeedback && this.hasSuccess())                                                             // 89
            return true;                                                                                            // 90
    };                                                                                                              // 91
                                                                                                                    // 92
if (Meteor.isClient)                                                                                                // 93
    Field.prototype.hasSuccess = function() {                                                                       // 94
        return this.positiveValidation && this.status.get() === false;                                              // 95
    };                                                                                                              // 96
                                                                                                                    // 97
if (Meteor.isClient)                                                                                                // 98
    Field.prototype.iconClass = function(){                                                                         // 99
        if (this.isValidating())                                                                                    // 100
            return AccountsTemplates.texts.inputIcons["isValidating"];                                              // 101
        if (this.hasError())                                                                                        // 102
            return AccountsTemplates.texts.inputIcons["hasError"];                                                  // 103
        if (this.hasSuccess())                                                                                      // 104
            return AccountsTemplates.texts.inputIcons["hasSuccess"];                                                // 105
    };                                                                                                              // 106
                                                                                                                    // 107
if (Meteor.isClient)                                                                                                // 108
    Field.prototype.isValidating = function(){                                                                      // 109
        return this.validating.get();                                                                               // 110
    };                                                                                                              // 111
                                                                                                                    // 112
if (Meteor.isClient)                                                                                                // 113
    Field.prototype.setError = function(err){                                                                       // 114
        check(err, Match.OneOf(String, undefined));                                                                 // 115
        return this.status.set(err || true);                                                                        // 116
    };                                                                                                              // 117
if (Meteor.isServer)                                                                                                // 118
    Field.prototype.setError = function(err){                                                                       // 119
        // Nothing to do server-side                                                                                // 120
        return;                                                                                                     // 121
    };                                                                                                              // 122
                                                                                                                    // 123
if (Meteor.isClient)                                                                                                // 124
    Field.prototype.setSuccess = function(){                                                                        // 125
        return this.status.set(false);                                                                              // 126
    };                                                                                                              // 127
if (Meteor.isServer)                                                                                                // 128
    Field.prototype.setSuccess = function(){                                                                        // 129
        // Nothing to do server-side                                                                                // 130
        return;                                                                                                     // 131
    };                                                                                                              // 132
                                                                                                                    // 133
                                                                                                                    // 134
if (Meteor.isClient)                                                                                                // 135
    Field.prototype.setValidating = function(state){                                                                // 136
        check(state, Boolean);                                                                                      // 137
        return this.validating.set(state);                                                                          // 138
    };                                                                                                              // 139
if (Meteor.isServer)                                                                                                // 140
    Field.prototype.setValidating = function(state){                                                                // 141
        // Nothing to do server-side                                                                                // 142
        return;                                                                                                     // 143
    };                                                                                                              // 144
                                                                                                                    // 145
if (Meteor.isClient)                                                                                                // 146
    Field.prototype.setValue = function(tempalteInstance, value){                                                   // 147
        if (this.type === "checkbox") {                                                                             // 148
            tempalteInstance.$("#at-field-" + this._id).prop('checked', true);                                      // 149
            return;                                                                                                 // 150
        }                                                                                                           // 151
        if (this.type === "radio") {                                                                                // 152
            tempalteInstance.$("[name=at-field-"+ this._id + "]").prop('checked', true);                            // 153
            return;                                                                                                 // 154
        }                                                                                                           // 155
        tempalteInstance.$("#at-field-" + this._id).val(value);                                                     // 156
    };                                                                                                              // 157
                                                                                                                    // 158
Field.prototype.validate = function(value, strict) {                                                                // 159
    check(value, Match.OneOf(undefined, String, Boolean));                                                          // 160
    this.setValidating(true);                                                                                       // 161
    this.clearStatus();                                                                                             // 162
    if (!value){                                                                                                    // 163
        if (!!strict){                                                                                              // 164
            if (this.required) {                                                                                    // 165
                this.setError("Required Field");                                                                    // 166
                this.setValidating(false);                                                                          // 167
                return "Required Field";                                                                            // 168
            }                                                                                                       // 169
            else {                                                                                                  // 170
                this.setSuccess();                                                                                  // 171
                this.setValidating(false);                                                                          // 172
                return false;                                                                                       // 173
            }                                                                                                       // 174
        }                                                                                                           // 175
        else {                                                                                                      // 176
            this.clearStatus();                                                                                     // 177
            this.setValidating(false);                                                                              // 178
            return null;                                                                                            // 179
        }                                                                                                           // 180
    }                                                                                                               // 181
    var valueLength = value.length;                                                                                 // 182
    var minLength = this.minLength;                                                                                 // 183
    if (minLength && valueLength < minLength) {                                                                     // 184
        this.setError("Minimum required length: " + minLength);                                                     // 185
        this.setValidating(false);                                                                                  // 186
        return "Minimum required length: " + minLength;                                                             // 187
    }                                                                                                               // 188
    var maxLength = this.maxLength;                                                                                 // 189
    if (maxLength && valueLength > maxLength) {                                                                     // 190
        this.setError("Maximum allowed length: " + maxLength);                                                      // 191
        this.setValidating(false);                                                                                  // 192
        return "Maximum allowed length: " + maxLength;                                                              // 193
    }                                                                                                               // 194
    if (this.re && valueLength && !value.match(this.re)) {                                                          // 195
        this.setError(this.errStr);                                                                                 // 196
        this.setValidating(false);                                                                                  // 197
        return this.errStr;                                                                                         // 198
    }                                                                                                               // 199
    if (this.func && valueLength){                                                                                  // 200
        var result = this.func(value);                                                                              // 201
        var err = result === true ? this.errStr || true : result;                                                   // 202
        if (result === undefined)                                                                                   // 203
            return err;                                                                                             // 204
        this.status.set(err);                                                                                       // 205
        this.setValidating(false);                                                                                  // 206
        return err;                                                                                                 // 207
    }                                                                                                               // 208
    this.setSuccess();                                                                                              // 209
    this.setValidating(false);                                                                                      // 210
    return false;                                                                                                   // 211
};                                                                                                                  // 212
                                                                                                                    // 213
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/useraccounts:core/lib/core.js                                                                           //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
// ---------------------------------------------------------------------------------                                // 1
                                                                                                                    // 2
// Patterns for methods" parameters                                                                                 // 3
                                                                                                                    // 4
// ---------------------------------------------------------------------------------                                // 5
                                                                                                                    // 6
STATE_PAT = {                                                                                                       // 7
    changePwd: Match.Optional(String),                                                                              // 8
    enrollAccount: Match.Optional(String),                                                                          // 9
    forgotPwd: Match.Optional(String),                                                                              // 10
    resetPwd: Match.Optional(String),                                                                               // 11
    signIn: Match.Optional(String),                                                                                 // 12
    signUp: Match.Optional(String),                                                                                 // 13
};                                                                                                                  // 14
                                                                                                                    // 15
ERRORS_PAT = {                                                                                                      // 16
    mustBeLoggedIn: Match.Optional(String),                                                                         // 17
    pwdMismatch: Match.Optional(String),                                                                            // 18
};                                                                                                                  // 19
                                                                                                                    // 20
INFO_PAT = {                                                                                                        // 21
    emailSent: Match.Optional(String),                                                                              // 22
    emailVerified: Match.Optional(String),                                                                          // 23
    pwdReset: Match.Optional(String),                                                                               // 24
    pwdChanged: Match.Optional(String),                                                                             // 25
    singUpVerifyEmail: Match.Optional(String),                                                                      // 26
};                                                                                                                  // 27
                                                                                                                    // 28
INPUT_ICONS_PAT = {                                                                                                 // 29
    isValidating: Match.Optional(String),                                                                           // 30
    hasError: Match.Optional(String),                                                                               // 31
    hasSuccess: Match.Optional(String),                                                                             // 32
};                                                                                                                  // 33
                                                                                                                    // 34
ObjWithStringValues = Match.Where(function (x) {                                                                    // 35
    check(x, Object);                                                                                               // 36
    _.each(_.values(x), function(value){                                                                            // 37
        check(value, String);                                                                                       // 38
    });                                                                                                             // 39
    return true;                                                                                                    // 40
});                                                                                                                 // 41
                                                                                                                    // 42
TEXTS_PAT = {                                                                                                       // 43
    button: Match.Optional(STATE_PAT),                                                                              // 44
    errors: Match.Optional(ERRORS_PAT),                                                                             // 45
    navSignIn: Match.Optional(String),                                                                              // 46
    navSignOut: Match.Optional(String),                                                                             // 47
    info: Match.Optional(INFO_PAT),                                                                                 // 48
    inputIcons: Match.Optional(INPUT_ICONS_PAT),                                                                    // 49
    optionalField: Match.Optional(String),                                                                          // 50
    pwdLink_pre: Match.Optional(String),                                                                            // 51
    pwdLink_link: Match.Optional(String),                                                                           // 52
    pwdLink_suff: Match.Optional(String),                                                                           // 53
    sep: Match.Optional(String),                                                                                    // 54
    signInLink_pre: Match.Optional(String),                                                                         // 55
    signInLink_link: Match.Optional(String),                                                                        // 56
    signInLink_suff: Match.Optional(String),                                                                        // 57
    signUpLink_pre: Match.Optional(String),                                                                         // 58
    signUpLink_link: Match.Optional(String),                                                                        // 59
    signUpLink_suff: Match.Optional(String),                                                                        // 60
    socialAdd: Match.Optional(String),                                                                              // 61
    socialConfigure: Match.Optional(String),                                                                        // 62
    socialIcons: Match.Optional(ObjWithStringValues),                                                               // 63
    socialRemove: Match.Optional(String),                                                                           // 64
    socialSignIn: Match.Optional(String),                                                                           // 65
    socialSignUp: Match.Optional(String),                                                                           // 66
    socialWith: Match.Optional(String),                                                                             // 67
    termsPreamble: Match.Optional(String),                                                                          // 68
    termsPrivacy: Match.Optional(String),                                                                           // 69
    termsAnd: Match.Optional(String),                                                                               // 70
    termsTerms: Match.Optional(String),                                                                             // 71
    title: Match.Optional(STATE_PAT),                                                                               // 72
};                                                                                                                  // 73
                                                                                                                    // 74
// Configuration pattern to be checked with check                                                                   // 75
CONFIG_PAT = {                                                                                                      // 76
    // Behaviour                                                                                                    // 77
    confirmPassword: Match.Optional(Boolean),                                                                       // 78
    defaultState: Match.Optional(String),                                                                           // 79
    enablePasswordChange: Match.Optional(Boolean),                                                                  // 80
    enforceEmailVerification: Match.Optional(Boolean),                                                              // 81
    forbidClientAccountCreation: Match.Optional(Boolean),                                                           // 82
    overrideLoginErrors: Match.Optional(Boolean),                                                                   // 83
    sendVerificationEmail: Match.Optional(Boolean),                                                                 // 84
    socialLoginStyle: Match.Optional(Match.OneOf("popup", "redirect")),                                             // 85
                                                                                                                    // 86
    // Appearance                                                                                                   // 87
    defaultLayout: Match.Optional(String),                                                                          // 88
    showAddRemoveServices: Match.Optional(Boolean),                                                                 // 89
    showForgotPasswordLink: Match.Optional(Boolean),                                                                // 90
    showLabels: Match.Optional(Boolean),                                                                            // 91
    showPlaceholders: Match.Optional(Boolean),                                                                      // 92
    hideSignInLink: Match.Optional(Boolean),                                                                        // 93
    hideSignUpLink: Match.Optional(Boolean),                                                                        // 94
                                                                                                                    // 95
    // Client-side Validation                                                                                       // 96
    continuousValidation: Match.Optional(Boolean),                                                                  // 97
    negativeFeedback: Match.Optional(Boolean),                                                                      // 98
    negativeValidation: Match.Optional(Boolean),                                                                    // 99
    positiveValidation: Match.Optional(Boolean),                                                                    // 100
    positiveFeedback: Match.Optional(Boolean),                                                                      // 101
    showValidating: Match.Optional(Boolean),                                                                        // 102
                                                                                                                    // 103
    // Privacy Policy and Terms of Use                                                                              // 104
    privacyUrl: Match.Optional(String),                                                                             // 105
    termsUrl: Match.Optional(String),                                                                               // 106
                                                                                                                    // 107
    // Redirects                                                                                                    // 108
    homeRoutePath: Match.Optional(String),                                                                          // 109
    redirectTimeout: Match.Optional(Number),                                                                        // 110
                                                                                                                    // 111
    // Hooks                                                                                                        // 112
    onSubmitHook: Match.Optional(Function),                                                                         // 113
    onLogoutHook: Match.Optional(Function),                                                                         // 114
                                                                                                                    // 115
    texts: Match.Optional(TEXTS_PAT),                                                                               // 116
};                                                                                                                  // 117
                                                                                                                    // 118
                                                                                                                    // 119
FIELD_SUB_PAT = {                                                                                                   // 120
    "default": Match.Optional(String),                                                                              // 121
    changePwd: Match.Optional(String),                                                                              // 122
    enrollAccount: Match.Optional(String),                                                                          // 123
    forgotPwd: Match.Optional(String),                                                                              // 124
    resetPwd: Match.Optional(String),                                                                               // 125
    signIn: Match.Optional(String),                                                                                 // 126
    signUp: Match.Optional(String),                                                                                 // 127
};                                                                                                                  // 128
                                                                                                                    // 129
                                                                                                                    // 130
// Field pattern                                                                                                    // 131
FIELD_PAT = {                                                                                                       // 132
    _id: String,                                                                                                    // 133
    type: String,                                                                                                   // 134
    required: Match.Optional(Boolean),                                                                              // 135
    displayName: Match.Optional(Match.OneOf(String, FIELD_SUB_PAT)),                                                // 136
    placeholder: Match.Optional(Match.OneOf(String, FIELD_SUB_PAT)),                                                // 137
    select: Match.Optional([{text: String, value: Match.Any}]),                                                     // 138
    minLength: Match.Optional(Match.Integer),                                                                       // 139
    maxLength: Match.Optional(Match.Integer),                                                                       // 140
    re: Match.Optional(RegExp),                                                                                     // 141
    func: Match.Optional(Match.Where(_.isFunction)),                                                                // 142
    errStr: Match.Optional(String),                                                                                 // 143
                                                                                                                    // 144
    // Client-side Validation                                                                                       // 145
    continuousValidation: Match.Optional(Boolean),                                                                  // 146
    negativeFeedback: Match.Optional(Boolean),                                                                      // 147
    negativeValidation: Match.Optional(Boolean),                                                                    // 148
    positiveValidation: Match.Optional(Boolean),                                                                    // 149
    positiveFeedback: Match.Optional(Boolean),                                                                      // 150
                                                                                                                    // 151
    // Transforms                                                                                                   // 152
    trim: Match.Optional(Boolean),                                                                                  // 153
    lowercase: Match.Optional(Boolean),                                                                             // 154
    uppercase: Match.Optional(Boolean),                                                                             // 155
};                                                                                                                  // 156
                                                                                                                    // 157
// Route configuration pattern to be checked with check                                                             // 158
var ROUTE_PAT = {                                                                                                   // 159
    name: Match.Optional(String),                                                                                   // 160
    path: Match.Optional(String),                                                                                   // 161
    template: Match.Optional(String),                                                                               // 162
    layoutTemplate: Match.Optional(String),                                                                         // 163
    redirect: Match.Optional(Match.OneOf(String, Match.Where(_.isFunction))),                                       // 164
};                                                                                                                  // 165
                                                                                                                    // 166
                                                                                                                    // 167
// -----------------------------------------------------------------------------                                    // 168
                                                                                                                    // 169
// AccountsTemplates object                                                                                         // 170
                                                                                                                    // 171
// -----------------------------------------------------------------------------                                    // 172
                                                                                                                    // 173
                                                                                                                    // 174
                                                                                                                    // 175
// -------------------                                                                                              // 176
// Client/Server stuff                                                                                              // 177
// -------------------                                                                                              // 178
                                                                                                                    // 179
// Constructor                                                                                                      // 180
AT = function() {                                                                                                   // 181
                                                                                                                    // 182
};                                                                                                                  // 183
                                                                                                                    // 184
                                                                                                                    // 185
                                                                                                                    // 186
                                                                                                                    // 187
/*                                                                                                                  // 188
    Each field object is represented by the following properties:                                                   // 189
        _id:         String   (required)  // A unique field"s id / name                                             // 190
        type:        String   (required)  // Displayed input type                                                   // 191
        required:    Boolean  (optional)  // Specifies Whether to fail or not when field is left empty              // 192
        displayName: String   (optional)  // The field"s name to be displayed as a label above the input element    // 193
        placeholder: String   (optional)  // The placeholder text to be displayed inside the input element          // 194
        minLength:   Integer  (optional)  // Possibly specifies the minimum allowed length                          // 195
        maxLength:   Integer  (optional)  // Possibly specifies the maximum allowed length                          // 196
        re:          RegExp   (optional)  // Regular expression for validation                                      // 197
        func:        Function (optional)  // Custom function for validation                                         // 198
        errStr:      String   (optional)  // Error message to be displayed in case re validation fails              // 199
*/                                                                                                                  // 200
                                                                                                                    // 201
                                                                                                                    // 202
                                                                                                                    // 203
/*                                                                                                                  // 204
    Routes configuration can be done by calling AccountsTemplates.configureRoute with the route name and the        // 205
    following options in a separate object. E.g. AccountsTemplates.configureRoute("gingIn", option);                // 206
        name:           String (optional). A unique route"s name to be passed to iron-router                        // 207
        path:           String (optional). A unique route"s path to be passed to iron-router                        // 208
        template:       String (optional). The name of the template to be rendered                                  // 209
        layoutTemplate: String (optional). The name of the layout to be used                                        // 210
        redirect:       String (optional). The name of the route (or its path) where to redirect after form submit  // 211
*/                                                                                                                  // 212
                                                                                                                    // 213
                                                                                                                    // 214
// Allowed routes along with theirs default configuration values                                                    // 215
AT.prototype.ROUTE_DEFAULT = {                                                                                      // 216
    changePwd:      { name: "atChangePwd",      path: "/change-password"},                                          // 217
    enrollAccount:  { name: "atEnrollAccount",  path: "/enroll-account"},                                           // 218
    ensureSignedIn: { name: "atEnsureSignedIn", path: null},                                                        // 219
    forgotPwd:      { name: "atForgotPwd",      path: "/forgot-password"},                                          // 220
    resetPwd:       { name: "atResetPwd",       path: "/reset-password"},                                           // 221
    signIn:         { name: "atSignIn",         path: "/sign-in"},                                                  // 222
    signUp:         { name: "atSignUp",         path: "/sign-up"},                                                  // 223
    verifyEmail:    { name: "atVerifyEmail",    path: "/verify-email"},                                             // 224
};                                                                                                                  // 225
                                                                                                                    // 226
                                                                                                                    // 227
                                                                                                                    // 228
// Allowed input types                                                                                              // 229
AT.prototype.INPUT_TYPES = [                                                                                        // 230
    "checkbox",                                                                                                     // 231
    "email",                                                                                                        // 232
    "hidden",                                                                                                       // 233
    "password",                                                                                                     // 234
    "radio",                                                                                                        // 235
    "select",                                                                                                       // 236
    "tel",                                                                                                          // 237
    "text",                                                                                                         // 238
    "url",                                                                                                          // 239
];                                                                                                                  // 240
                                                                                                                    // 241
// Current configuration values                                                                                     // 242
AT.prototype.options = {                                                                                            // 243
    // Appearance                                                                                                   // 244
    //defaultLayout: undefined,                                                                                     // 245
    showAddRemoveServices: false,                                                                                   // 246
    showForgotPasswordLink: false,                                                                                  // 247
    showLabels: true,                                                                                               // 248
    showPlaceholders: true,                                                                                         // 249
                                                                                                                    // 250
    // Behaviour                                                                                                    // 251
    confirmPassword: true,                                                                                          // 252
    defaultState: "signIn",                                                                                         // 253
    enablePasswordChange: false,                                                                                    // 254
    forbidClientAccountCreation: false,                                                                             // 255
    overrideLoginErrors: true,                                                                                      // 256
    sendVerificationEmail: false,                                                                                   // 257
    socialLoginStyle: "popup",                                                                                      // 258
                                                                                                                    // 259
    // Client-side Validation                                                                                       // 260
    //continuousValidation: false,                                                                                  // 261
    //negativeFeedback: false,                                                                                      // 262
    //negativeValidation: false,                                                                                    // 263
    //positiveValidation: false,                                                                                    // 264
    //positiveFeedback: false,                                                                                      // 265
    //showValidating: false,                                                                                        // 266
                                                                                                                    // 267
    // Privacy Policy and Terms of Use                                                                              // 268
    privacyUrl: undefined,                                                                                          // 269
    termsUrl: undefined,                                                                                            // 270
                                                                                                                    // 271
    // Redirects                                                                                                    // 272
    homeRoutePath: "/",                                                                                             // 273
    redirectTimeout: 2000, // 2 seconds                                                                             // 274
                                                                                                                    // 275
    // Hooks                                                                                                        // 276
    onSubmitHook: undefined,                                                                                        // 277
};                                                                                                                  // 278
                                                                                                                    // 279
AT.prototype.SPECIAL_FIELDS = [                                                                                     // 280
    "password_again",                                                                                               // 281
    "username_and_email",                                                                                           // 282
];                                                                                                                  // 283
                                                                                                                    // 284
// SignIn / SignUp fields                                                                                           // 285
AT.prototype._fields = [                                                                                            // 286
    new Field({                                                                                                     // 287
        _id: "email",                                                                                               // 288
        type: "email",                                                                                              // 289
        required: true,                                                                                             // 290
        lowercase: true,                                                                                            // 291
        trim: true,                                                                                                 // 292
        func: function(email){                                                                                      // 293
            return !_.contains(email, '@');                                                                         // 294
        },                                                                                                          // 295
        errStr: 'Invalid email',                                                                                    // 296
    }),                                                                                                             // 297
    new Field({                                                                                                     // 298
        _id: "password",                                                                                            // 299
        type: "password",                                                                                           // 300
        required: true,                                                                                             // 301
        minLength: 6,                                                                                               // 302
        displayName: {                                                                                              // 303
            "default": "password",                                                                                  // 304
            changePwd: "newPassword",                                                                               // 305
            resetPwd: "newPassword",                                                                                // 306
        },                                                                                                          // 307
        placeholder: {                                                                                              // 308
            "default": "password",                                                                                  // 309
            changePwd: "newPassword",                                                                               // 310
            resetPwd: "newPassword",                                                                                // 311
        },                                                                                                          // 312
    }),                                                                                                             // 313
];                                                                                                                  // 314
                                                                                                                    // 315
// Configured routes                                                                                                // 316
AT.prototype.routes = {};                                                                                           // 317
                                                                                                                    // 318
AT.prototype._initialized = false;                                                                                  // 319
                                                                                                                    // 320
// Input type validation                                                                                            // 321
AT.prototype._isValidInputType = function(value) {                                                                  // 322
    return _.indexOf(this.INPUT_TYPES, value) !== -1;                                                               // 323
};                                                                                                                  // 324
                                                                                                                    // 325
AT.prototype.addField = function(field) {                                                                           // 326
    // Fields can be added only before initialization                                                               // 327
    if (this._initialized)                                                                                          // 328
        throw new Error("AccountsTemplates.addField should strictly be called before AccountsTemplates.init!");     // 329
    field = _.pick(field, _.keys(FIELD_PAT));                                                                       // 330
    check(field, FIELD_PAT);                                                                                        // 331
    // Checks there"s currently no field called field._id                                                           // 332
    if (_.indexOf(_.pluck(this._fields, "_id"), field._id) !== -1)                                                  // 333
        throw new Error("A field called " + field._id + " already exists!");                                        // 334
    // Validates field.type                                                                                         // 335
    if (!this._isValidInputType(field.type))                                                                        // 336
        throw new Error("field.type is not valid!");                                                                // 337
    // Checks field.minLength is strictly positive                                                                  // 338
    if (typeof field.minLength !== "undefined" && field.minLength <= 0)                                             // 339
        throw new Error("field.minLength should be greater than zero!");                                            // 340
    // Checks field.maxLength is strictly positive                                                                  // 341
    if (typeof field.maxLength !== "undefined" && field.maxLength <= 0)                                             // 342
        throw new Error("field.maxLength should be greater than zero!");                                            // 343
    // Checks field.maxLength is greater than field.minLength                                                       // 344
    if (typeof field.minLength !== "undefined" && typeof field.minLength !== "undefined" && field.maxLength < field.minLength)
        throw new Error("field.maxLength should be greater than field.maxLength!");                                 // 346
                                                                                                                    // 347
    if (!(Meteor.isServer && _.contains(this.SPECIAL_FIELDS, field._id)))                                           // 348
        this._fields.push(new Field(field));                                                                        // 349
    return this._fields;                                                                                            // 350
};                                                                                                                  // 351
                                                                                                                    // 352
AT.prototype.addFields = function(fields) {                                                                         // 353
    var ok;                                                                                                         // 354
    try { // don"t bother with `typeof` - just access `length` and `catch`                                          // 355
        ok = fields.length > 0 && "0" in Object(fields);                                                            // 356
    } catch (e) {                                                                                                   // 357
        throw new Error("field argument should be an array of valid field objects!");                               // 358
    }                                                                                                               // 359
    if (ok) {                                                                                                       // 360
        _.map(fields, function(field){                                                                              // 361
            this.addField(field);                                                                                   // 362
        }, this);                                                                                                   // 363
    } else                                                                                                          // 364
        throw new Error("field argument should be an array of valid field objects!");                               // 365
    return this._fields;                                                                                            // 366
};                                                                                                                  // 367
                                                                                                                    // 368
AT.prototype.configure = function(config) {                                                                         // 369
    // Configuration options can be set only before initialization                                                  // 370
    if (this._initialized)                                                                                          // 371
        throw new Error("Configuration options must be set before AccountsTemplates.init!");                        // 372
                                                                                                                    // 373
    // Updates the current configuration                                                                            // 374
    check(config, CONFIG_PAT);                                                                                      // 375
    var options = _.omit(config, "texts");                                                                          // 376
    this.options = _.defaults(options, this.options);                                                               // 377
                                                                                                                    // 378
    if (Meteor.isClient){                                                                                           // 379
        // Possibly sets up client texts...                                                                         // 380
        if (config.texts){                                                                                          // 381
            var texts = config.texts;                                                                               // 382
            var simpleTexts = _.omit(texts, "button", "errors", "info", "inputIcons", "socialIcons", "title");      // 383
            this.texts = _.defaults(simpleTexts, this.texts);                                                       // 384
                                                                                                                    // 385
            if (texts.button) {                                                                                     // 386
                // Updates the current button object                                                                // 387
                this.texts.button = _.defaults(texts.button, this.texts.button);                                    // 388
            }                                                                                                       // 389
            if (texts.errors) {                                                                                     // 390
                // Updates the current errors object                                                                // 391
                this.texts.errors = _.defaults(texts.errors, this.texts.errors);                                    // 392
            }                                                                                                       // 393
            if (texts.info) {                                                                                       // 394
                // Updates the current info object                                                                  // 395
                this.texts.info = _.defaults(texts.info, this.texts.info);                                          // 396
            }                                                                                                       // 397
            if (texts.inputIcons) {                                                                                 // 398
                // Updates the current inputIcons object                                                            // 399
                this.texts.inputIcons = _.defaults(texts.inputIcons, this.texts.inputIcons);                        // 400
            }                                                                                                       // 401
            if (texts.socialIcons) {                                                                                // 402
                // Updates the current socialIcons object                                                           // 403
                this.texts.socialIcons = _.defaults(texts.socialIcons, this.texts.socialIcons);                     // 404
            }                                                                                                       // 405
            if (texts.title) {                                                                                      // 406
                // Updates the current title object                                                                 // 407
                this.texts.title = _.defaults(texts.title, this.texts.title);                                       // 408
            }                                                                                                       // 409
        }                                                                                                           // 410
    }                                                                                                               // 411
};                                                                                                                  // 412
                                                                                                                    // 413
AT.prototype.configureRoute = function(route, options) {                                                            // 414
    check(route, String);                                                                                           // 415
    check(options, Match.OneOf(undefined, ROUTE_PAT));                                                              // 416
    options = _.clone(options);                                                                                     // 417
    // Route Configuration can be done only before initialization                                                   // 418
    if (this._initialized)                                                                                          // 419
        throw new Error("Route Configuration can be done only before AccountsTemplates.init!");                     // 420
    // Only allowed routes can be configured                                                                        // 421
    if (!(route in this.ROUTE_DEFAULT))                                                                             // 422
        throw new Error("Unknown Route!");                                                                          // 423
                                                                                                                    // 424
    // Possibly adds a initial / to the provided path                                                               // 425
    if (options && options.path && options.path[0] !== "/")                                                         // 426
        options.path = "/" + options.path;                                                                          // 427
    // Updates the current configuration                                                                            // 428
    options = _.defaults(options || {}, this.ROUTE_DEFAULT[route]);                                                 // 429
    this.routes[route] = options;                                                                                   // 430
};                                                                                                                  // 431
                                                                                                                    // 432
AT.prototype.hasField = function(fieldId) {                                                                         // 433
    return !!this.getField(fieldId);                                                                                // 434
};                                                                                                                  // 435
                                                                                                                    // 436
AT.prototype.getField = function(fieldId) {                                                                         // 437
    var field = _.filter(this._fields, function(field){                                                             // 438
        return field._id == fieldId;                                                                                // 439
    });                                                                                                             // 440
    return (field.length === 1) ? field[0] : undefined;                                                             // 441
};                                                                                                                  // 442
                                                                                                                    // 443
AT.prototype.getFields = function() {                                                                               // 444
    return this._fields;                                                                                            // 445
};                                                                                                                  // 446
                                                                                                                    // 447
AT.prototype.getFieldIds = function() {                                                                             // 448
    return _.pluck(this._fields, "_id");                                                                            // 449
};                                                                                                                  // 450
                                                                                                                    // 451
AT.prototype.getRouteName = function(route) {                                                                       // 452
    if (route in this.routes)                                                                                       // 453
        return this.routes[route].name;                                                                             // 454
    return null;                                                                                                    // 455
};                                                                                                                  // 456
                                                                                                                    // 457
AT.prototype.getRoutePath = function(route) {                                                                       // 458
    if (route in this.routes)                                                                                       // 459
        return this.routes[route].path;                                                                             // 460
    return "#";                                                                                                     // 461
};                                                                                                                  // 462
                                                                                                                    // 463
AT.prototype.oauthServices = function(){                                                                            // 464
    // Extracts names of available services                                                                         // 465
    var names;                                                                                                      // 466
    if (Meteor.isServer)                                                                                            // 467
        names = (Accounts.oauth && Accounts.oauth.serviceNames()) || [];                                            // 468
    else                                                                                                            // 469
        names = (Accounts.oauth && Accounts.loginServicesConfigured() && Accounts.oauth.serviceNames()) || [];      // 470
    // Extracts names of configured services                                                                        // 471
    var configuredServices = [];                                                                                    // 472
    if (Accounts.loginServiceConfiguration)                                                                         // 473
        configuredServices = _.pluck(Accounts.loginServiceConfiguration.find().fetch(), "service");                 // 474
                                                                                                                    // 475
    // Builds a list of objects containing service name as _id and its configuration status                         // 476
    var services = _.map(names, function(name){                                                                     // 477
        return {                                                                                                    // 478
            _id : name,                                                                                             // 479
            configured: _.contains(configuredServices, name),                                                       // 480
        };                                                                                                          // 481
    });                                                                                                             // 482
                                                                                                                    // 483
    // Checks whether there is a UI to configure services...                                                        // 484
    // XXX: this only works with the accounts-ui package                                                            // 485
    var showUnconfigured = typeof Accounts._loginButtonsSession !== "undefined";                                    // 486
                                                                                                                    // 487
    // Filters out unconfigured services in case they"re not to be displayed                                        // 488
    if (!showUnconfigured){                                                                                         // 489
        services = _.filter(services, function(service){                                                            // 490
            return service.configured;                                                                              // 491
        });                                                                                                         // 492
    }                                                                                                               // 493
                                                                                                                    // 494
    // Sorts services by name                                                                                       // 495
    services = _.sortBy(services, function(service){                                                                // 496
        return service._id;                                                                                         // 497
    });                                                                                                             // 498
                                                                                                                    // 499
    return services;                                                                                                // 500
};                                                                                                                  // 501
                                                                                                                    // 502
AT.prototype.removeField = function(fieldId) {                                                                      // 503
    // Fields can be removed only before initialization                                                             // 504
    if (this._initialized)                                                                                          // 505
        throw new Error("AccountsTemplates.removeField should strictly be called before AccountsTemplates.init!");  // 506
    // Tries to look up the field with given _id                                                                    // 507
    var index = _.indexOf(_.pluck(this._fields, "_id"), fieldId);                                                   // 508
    if (index !== -1)                                                                                               // 509
        return this._fields.splice(index, 1)[0];                                                                    // 510
    else                                                                                                            // 511
        if (!(Meteor.isServer && _.contains(this.SPECIAL_FIELDS, fieldId)))                                         // 512
            throw new Error("A field called " + fieldId + " does not exist!");                                      // 513
};                                                                                                                  // 514
                                                                                                                    // 515
AT.prototype.setupRoutes = function() {                                                                             // 516
    if (Meteor.isServer){                                                                                           // 517
        // Possibly prints a warning in case showForgotPasswordLink is set to true but the route is not configured  // 518
        if (AccountsTemplates.options.showForgotPasswordLink && !("forgotPwd" in  AccountsTemplates.routes))        // 519
            console.warn("[AccountsTemplates] WARNING: showForgotPasswordLink set to true, but forgotPwd route is not configured!");
        // Configures "reset password" email link                                                                   // 521
        if ("resetPwd" in AccountsTemplates.routes){                                                                // 522
            var resetPwdPath = AccountsTemplates.routes["resetPwd"].path.substr(1);                                 // 523
            Accounts.urls.resetPassword = function(token){                                                          // 524
                return Meteor.absoluteUrl(resetPwdPath + "/" + token);                                              // 525
            };                                                                                                      // 526
        }                                                                                                           // 527
        // Configures "enroll account" email link                                                                   // 528
        if ("enrollAccount" in AccountsTemplates.routes){                                                           // 529
            var enrollAccountPath = AccountsTemplates.routes["enrollAccount"].path.substr(1);                       // 530
            Accounts.urls.enrollAccount = function(token){                                                          // 531
                return Meteor.absoluteUrl(enrollAccountPath + "/" + token);                                         // 532
            };                                                                                                      // 533
        }                                                                                                           // 534
        // Configures "verify email" email link                                                                     // 535
        if ("verifyEmail" in AccountsTemplates.routes){                                                             // 536
            var verifyEmailPath = AccountsTemplates.routes["verifyEmail"].path.substr(1);                           // 537
            Accounts.urls.verifyEmail = function(token){                                                            // 538
                return Meteor.absoluteUrl(verifyEmailPath + "/" + token);                                           // 539
            };                                                                                                      // 540
        }                                                                                                           // 541
    }                                                                                                               // 542
                                                                                                                    // 543
    // Determines the default layout to be used in case no specific one is specified for single routes              // 544
    var defaultLayout = AccountsTemplates.options.defaultLayout || Router.options.layoutTemplate;                   // 545
                                                                                                                    // 546
    _.each(AccountsTemplates.routes, function(options, route){                                                      // 547
        if (route === "ensureSignedIn")                                                                             // 548
            return;                                                                                                 // 549
        if (route === "changePwd" && !AccountsTemplates.options.enablePasswordChange)                               // 550
            throw new Error("changePwd route configured but enablePasswordChange set to false!");                   // 551
        if (route === "forgotPwd" && !AccountsTemplates.options.showForgotPasswordLink)                             // 552
            throw new Error("forgotPwd route configured but showForgotPasswordLink set to false!");                 // 553
        if (route === "signUp" && AccountsTemplates.options.forbidClientAccountCreation)                            // 554
            throw new Error("signUp route configured but forbidClientAccountCreation set to true!");                // 555
        // Possibly prints a warning in case the MAIL_URL environment variable was not set                          // 556
        if (Meteor.isServer && route === "forgotPwd" && (!process.env.MAIL_URL || ! Package["email"])){             // 557
            console.warn("[AccountsTemplates] WARNING: showForgotPasswordLink set to true, but MAIL_URL is not configured!");
        }                                                                                                           // 559
                                                                                                                    // 560
        var name = options.name; // Default provided...                                                             // 561
        var path = options.path; // Default provided...                                                             // 562
        var template = options.template || "fullPageAtForm";                                                        // 563
        var layoutTemplate = options.layoutTemplate || defaultLayout;                                               // 564
                                                                                                                    // 565
        // Possibly adds token parameter                                                                            // 566
        if (_.contains(["enrollAccount", "resetPwd", "verifyEmail"], route)){                                       // 567
            path += "/:paramToken";                                                                                 // 568
            if (route === "verifyEmail")                                                                            // 569
                Router.route(path, {                                                                                // 570
                    name: name,                                                                                     // 571
                    template: template,                                                                             // 572
                    layoutTemplate: layoutTemplate,                                                                 // 573
                    onBeforeAction: function() {                                                                    // 574
                        AccountsTemplates.setState(route);                                                          // 575
                        this.next();                                                                                // 576
                    },                                                                                              // 577
                    onAfterAction: function() {                                                                     // 578
                        AccountsTemplates.setDisabled(true);                                                        // 579
                        var token = this.params.paramToken;                                                         // 580
                        Accounts.verifyEmail(token, function(error){                                                // 581
                            AccountsTemplates.setDisabled(false);                                                   // 582
                            AccountsTemplates.submitCallback(error, route, function(){                              // 583
                                AccountsTemplates.state.form.set("result", AccountsTemplates.texts.info.emailVerified);
                            });                                                                                     // 585
                        });                                                                                         // 586
                    },                                                                                              // 587
                    onStop: function() {                                                                            // 588
                        AccountsTemplates.clearState();                                                             // 589
                    },                                                                                              // 590
                });                                                                                                 // 591
            else                                                                                                    // 592
                Router.route(path, {                                                                                // 593
                    name: name,                                                                                     // 594
                    template: template,                                                                             // 595
                    layoutTemplate: layoutTemplate,                                                                 // 596
                    onRun: function() {                                                                             // 597
                        AccountsTemplates.paramToken = this.params.paramToken;                                      // 598
                        this.next();                                                                                // 599
                    },                                                                                              // 600
                    onBeforeAction: function() {                                                                    // 601
                        AccountsTemplates.setState(route);                                                          // 602
                        this.next();                                                                                // 603
                    },                                                                                              // 604
                    onStop: function() {                                                                            // 605
                        AccountsTemplates.clearState();                                                             // 606
                        AccountsTemplates.paramToken = null;                                                        // 607
                    }                                                                                               // 608
                });                                                                                                 // 609
        }                                                                                                           // 610
        else                                                                                                        // 611
            Router.route(path, {                                                                                    // 612
                name: name,                                                                                         // 613
                template: template,                                                                                 // 614
                layoutTemplate: layoutTemplate,                                                                     // 615
                onBeforeAction: function() {                                                                        // 616
                    if(Meteor.user() && route != 'changePwd')                                                       // 617
                        AccountsTemplates.postSubmitRedirect(route);                                                // 618
                    else                                                                                            // 619
                        AccountsTemplates.setState(route);                                                          // 620
                    this.next();                                                                                    // 621
                },                                                                                                  // 622
                onStop: function() {                                                                                // 623
                    AccountsTemplates.clearState();                                                                 // 624
                }                                                                                                   // 625
            });                                                                                                     // 626
    });                                                                                                             // 627
};                                                                                                                  // 628
                                                                                                                    // 629
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/useraccounts:core/lib/server.js                                                                         //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
// Initialization                                                                                                   // 1
                                                                                                                    // 2
AT.prototype.init = function() {                                                                                    // 3
    console.warn("[AccountsTemplates] There is no more need to call AccountsTemplates.init()! Simply remove the call ;-)");
};                                                                                                                  // 5
                                                                                                                    // 6
AT.prototype._init = function() {                                                                                   // 7
    if (this._initialized)                                                                                          // 8
        return;                                                                                                     // 9
                                                                                                                    // 10
    // Checks there is at least one account service installed                                                       // 11
    if (!Package["accounts-password"] && (!Accounts.oauth || Accounts.oauth.serviceNames().length === 0))           // 12
        throw Error("AccountsTemplates: You must add at least one account service!");                               // 13
                                                                                                                    // 14
    // A password field is strictly required                                                                        // 15
    var password = this.getField("password");                                                                       // 16
    if (!password)                                                                                                  // 17
        throw Error("A password field is strictly required!");                                                      // 18
    if (password.type !== "password")                                                                               // 19
        throw Error("The type of password field should be password!");                                              // 20
                                                                                                                    // 21
    // Then we can have "username" or "email" or even both of them                                                  // 22
    // but at least one of the two is strictly required                                                             // 23
    var username = this.getField("username");                                                                       // 24
    var email = this.getField("email");                                                                             // 25
    if (!username && !email)                                                                                        // 26
        throw Error("At least one field out of username and email is strictly required!");                          // 27
    if (username && !username.required)                                                                             // 28
        throw Error("The username field should be required!");                                                      // 29
    if (email){                                                                                                     // 30
        if (email.type !== "email")                                                                                 // 31
            throw Error("The type of email field should be email!");                                                // 32
        if (username){                                                                                              // 33
            // username and email                                                                                   // 34
            if (username.type !== "text")                                                                           // 35
                throw Error("The type of username field should be text when email field is present!");              // 36
        }else{                                                                                                      // 37
            // email only                                                                                           // 38
            if (!email.required)                                                                                    // 39
                throw Error("The email field should be required when username is not present!");                    // 40
        }                                                                                                           // 41
    }                                                                                                               // 42
    else{                                                                                                           // 43
        // username only                                                                                            // 44
        if (username.type !== "text" && username.type !== "tel")                                                    // 45
            throw Error("The type of username field should be text or tel!");                                       // 46
    }                                                                                                               // 47
                                                                                                                    // 48
    // Possibly publish more user data in order to be able to show add/remove                                       // 49
    // buttons for 3rd-party services                                                                               // 50
    if (this.options.showAddRemoveServices){                                                                        // 51
        // Publish additional current user info to get the list of registered services                              // 52
        // XXX TODO:                                                                                                // 53
        // ...adds only user.services.*.id                                                                          // 54
        Meteor.publish("userRegisteredServices", function() {                                                       // 55
            var userId = this.userId;                                                                               // 56
            return Meteor.users.find(userId, {fields: {services: 1}});                                              // 57
            /*                                                                                                      // 58
            if (userId){                                                                                            // 59
                var user = Meteor.users.findOne(userId);                                                            // 60
                var services_id = _.chain(user.services)                                                            // 61
                    .keys()                                                                                         // 62
                    .reject(function(service){return service === "resume";})                                        // 63
                    .map(function(service){return "services." + service + ".id";})                                  // 64
                    .value();                                                                                       // 65
                var projection = {};                                                                                // 66
                _.each(services_id, function(key){projection[key] = 1;});                                           // 67
                return Meteor.users.find(userId, {fields: projection});                                             // 68
            }                                                                                                       // 69
            */                                                                                                      // 70
        });                                                                                                         // 71
    }                                                                                                               // 72
                                                                                                                    // 73
    // Security stuff                                                                                               // 74
    if (this.options.overrideLoginErrors){                                                                          // 75
        Accounts.validateLoginAttempt(function(attempt){                                                            // 76
            if (attempt.error){                                                                                     // 77
                var reason = attempt.error.reason;                                                                  // 78
                if (reason === "User not found" || reason === "Incorrect password")                                 // 79
                    throw new Meteor.Error(403, "Login forbidden");                                                 // 80
            }                                                                                                       // 81
            return attempt.allowed;                                                                                 // 82
        });                                                                                                         // 83
    }                                                                                                               // 84
                                                                                                                    // 85
    if (this.options.sendVerificationEmail && this.options.enforceEmailVerification){                               // 86
        Accounts.validateLoginAttempt(function(info){                                                               // 87
            if (info.type !== "password" || info.methodName !== "login")                                            // 88
                return true;                                                                                        // 89
            var user = info.user;                                                                                   // 90
            if (!user)                                                                                              // 91
                return true;                                                                                        // 92
            var ok = true;                                                                                          // 93
            var loginEmail = info.methodArguments[0].user.email;                                                    // 94
            if (loginEmail){                                                                                        // 95
              var email = _.filter(user.emails, function(obj){                                                      // 96
                  return obj.address === loginEmail;                                                                // 97
              });                                                                                                   // 98
              if (!email.length || !email[0].verified)                                                              // 99
                  ok = false;                                                                                       // 100
            }                                                                                                       // 101
            else {                                                                                                  // 102
              // we got the username, lets check there's at lease one verified email                                // 103
              var emailVerified = _.chain(user.emails)                                                              // 104
                .pluck('verified')                                                                                  // 105
                .any()                                                                                              // 106
                .value();                                                                                           // 107
              if (!emailVerified)                                                                                   // 108
                ok = false;                                                                                         // 109
            }                                                                                                       // 110
            if (!ok)                                                                                                // 111
              throw new Meteor.Error(401, "Please verify your email first. Check the email and follow the link!" ); // 112
            return true;                                                                                            // 113
        });                                                                                                         // 114
    }                                                                                                               // 115
                                                                                                                    // 116
    // ------------                                                                                                 // 117
    // Server-Side Routes Definition                                                                                // 118
    //                                                                                                              // 119
    //   this allows for server-side iron-router usage, like, e.g.                                                  // 120
    //   Router.map(function(){                                                                                     // 121
    //       this.route("fullPageSigninForm", {                                                                     // 122
    //           path: "*",                                                                                         // 123
    //           where: "server"                                                                                    // 124
    //           action: function() {                                                                               // 125
    //               this.response.statusCode = 404;                                                                // 126
    //               return this.response.end(Handlebars.templates["404"]());                                       // 127
    //           }                                                                                                  // 128
    //       });                                                                                                    // 129
    //   })                                                                                                         // 130
    // ------------                                                                                                 // 131
    AccountsTemplates.setupRoutes();                                                                                // 132
                                                                                                                    // 133
    // Marks AccountsTemplates as initialized                                                                       // 134
    this._initialized = true;                                                                                       // 135
};                                                                                                                  // 136
                                                                                                                    // 137
AccountsTemplates = new AT();                                                                                       // 138
                                                                                                                    // 139
                                                                                                                    // 140
// Client side account creation is disabled by default:                                                             // 141
// the methos ATCreateUserServer is used instead!                                                                   // 142
// to actually disable client side account creation use:                                                            // 143
//                                                                                                                  // 144
//    AccountsTemplates.config({                                                                                    // 145
//        forbidClientAccountCreation: true                                                                         // 146
//    });                                                                                                           // 147
Accounts.config({                                                                                                   // 148
    forbidClientAccountCreation: true                                                                               // 149
});                                                                                                                 // 150
                                                                                                                    // 151
                                                                                                                    // 152
// Initialization                                                                                                   // 153
Meteor.startup(function(){                                                                                          // 154
    AccountsTemplates._init();                                                                                      // 155
});                                                                                                                 // 156
                                                                                                                    // 157
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/useraccounts:core/lib/methods.js                                                                        //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
                                                                                                                    // 1
Meteor.methods({                                                                                                    // 2
    ATRemoveService: function(service_name){                                                                        // 3
        var userId = this.userId;                                                                                   // 4
        if (userId){                                                                                                // 5
            var user = Meteor.users.findOne(userId);                                                                // 6
            var numServices = _.keys(user.services).length; // including "resume"                                   // 7
            if (numServices === 2)                                                                                  // 8
                throw new Meteor.Error(403, "Cannot remove the only active service!", {});                          // 9
            var unset = {};                                                                                         // 10
            unset["services." + service_name] = "";                                                                 // 11
            Meteor.users.update(userId, {$unset: unset});                                                           // 12
        }                                                                                                           // 13
    },                                                                                                              // 14
});                                                                                                                 // 15
                                                                                                                    // 16
                                                                                                                    // 17
if (Meteor.isServer) {                                                                                              // 18
    Meteor.methods({                                                                                                // 19
        ATCreateUserServer: function(options){                                                                      // 20
            if (AccountsTemplates.options.forbidClientAccountCreation)                                              // 21
                throw new Meteor.Error(403, "Client side accounts creation is disabled!!!");                        // 22
            // createUser() does more checking.                                                                     // 23
            check(options, Object);                                                                                 // 24
            var allFieldIds = AccountsTemplates.getFieldIds();                                                      // 25
            // Picks-up whitelisted fields for profile                                                              // 26
            var profile = options.profile;                                                                          // 27
            profile = _.pick(profile, allFieldIds);                                                                 // 28
            profile = _.omit(profile, "username", "email", "password");                                             // 29
            // Validates fields" value                                                                              // 30
            var signupInfo = _.clone(profile);                                                                      // 31
            if (options.username)                                                                                   // 32
                signupInfo.username = options.username;                                                             // 33
            if (options.email)                                                                                      // 34
                signupInfo.email = options.email;                                                                   // 35
            if (options.password)                                                                                   // 36
                signupInfo.password = options.password;                                                             // 37
            var validationErrors = {};                                                                              // 38
            var someError = false;                                                                                  // 39
                                                                                                                    // 40
            // Validates fields values                                                                              // 41
            _.each(AccountsTemplates.getFields(), function(field){                                                  // 42
                var fieldId = field._id;                                                                            // 43
                var value = signupInfo[fieldId];                                                                    // 44
                if (fieldId === "password"){                                                                        // 45
                    // Can"t Pick-up password here                                                                  // 46
                    // NOTE: at this stage the password is already encripted,                                       // 47
                    //       so there is no way to validate it!!!                                                   // 48
                    check(value, Object);                                                                           // 49
                    return;                                                                                         // 50
                }                                                                                                   // 51
                var validationErr = field.validate(value, "strict");                                                // 52
                if (validationErr) {                                                                                // 53
                    validationErrors[fieldId] = validationErr;                                                      // 54
                    someError = true;                                                                               // 55
                }                                                                                                   // 56
            });                                                                                                     // 57
            if (someError)                                                                                          // 58
                throw new Meteor.Error(403, "Validation Errors", validationErrors);                                 // 59
                                                                                                                    // 60
            // Possibly removes the profile field                                                                   // 61
            if (_.isEmpty(options.profile))                                                                         // 62
                delete options.profile;                                                                             // 63
                                                                                                                    // 64
            // Create user. result contains id and token.                                                           // 65
            var userId = Accounts.createUser(options);                                                              // 66
            // safety belt. createUser is supposed to throw on error. send 500 error                                // 67
            // instead of sending a verification email with empty userid.                                           // 68
            if (! userId)                                                                                           // 69
                throw new Error("createUser failed to insert new user");                                            // 70
                                                                                                                    // 71
            // Send a email address verification email in case the context permits it                               // 72
            // and the specific configuration flag was set to true                                                  // 73
            if (options.email && AccountsTemplates.options.sendVerificationEmail)                                   // 74
                Accounts.sendVerificationEmail(userId, options.email);                                              // 75
        },                                                                                                          // 76
    });                                                                                                             // 77
}                                                                                                                   // 78
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['useraccounts:core'] = {
  AccountsTemplates: AccountsTemplates
};

})();

//# sourceMappingURL=useraccounts_core.js.map
