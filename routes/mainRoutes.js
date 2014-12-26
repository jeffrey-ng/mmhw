// Home Route
// Router.route('/', function () {
//   this.render('home');
//   SEO.set({ title: 'Home - ' + Meteor.App.NAME });
// });
Router.map(function() {

    this.route('home', {
        path: '/',
        waitOn: function() {
            return this.subscribe('allParticipants');
        }
    });
});