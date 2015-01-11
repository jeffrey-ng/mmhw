// Home Route
// Router.route('/', function () {
//   this.render('home');
//   SEO.set({ title: 'Home - ' + Meteor.App.NAME });
// });
Router.map(function() {

    this.route('home', {
        path: '/',
        waitOn: function() {
            return [this.subscribe('allParticipants'), this.subscribe('VotedFor')];
        }
    });

    this.route('judges', {
        path: '/judges',
        waitOn: function() {
            return [this.subscribe('allJudges'), this.subscribe('VotedFor')];
        }
    });

    this.route('contestants', {
        path: '/contestants',
        waitOn: function() {
            return [this.subscribe('allContestants'), this.subscribe('VotedFor')];
        }
    });
     this.route('createUser', {
        path: '/createUser'
    });
});