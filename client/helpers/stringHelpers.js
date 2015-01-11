Template.registerHelper('summarize', function(string) {
  var cleanString = _(string).stripTags();
  return _(cleanString).truncate(80);
});