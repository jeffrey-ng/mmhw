Meteor.startup(function() {
 if(Meteor.isClient){
      return SEO.config({
        title: 'MMHW',
        meta: {
          'description': 'MCSS Meet Me Halfway 2015'
        }
      });
    }
});