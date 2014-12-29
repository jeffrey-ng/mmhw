// Define App Constants

if (Meteor.App) {
  throw new Meteor.Error('Meteor.App already defined? see client/lib/constants.js');
}

Meteor.App = {
  NAME: 'MCSS MMHW 2015',
  DESCRIPTION: 'MCSS Meet Me Halfway 2015'
};
