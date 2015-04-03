var dependencies = [
  "backbone",
  "marionette",
  "hbs!app/applets/problem_details/show/appRowTemplate",  
  "hbs!app/applets/problem_details/show/problemDetailTemplate"
];

define(dependencies, onResolveDependencies);

function onResolveDependencies(Backbone, Marionette, rowTemplate, detailTemplate) {
  var EventHandlers = {
    showProblemDetails: function(event, element, model, view) {
//      event.preventDefault();
      event.stopPropagation();
      element.toggleClass("warning");
      if (element.hasClass("problem-details-on")) {
        view.getTemplate = function() {
          return rowTemplate;
        };
      } else {
        view.getTemplate = function() {
          return detailTemplate;
        };
      }
      element.toggleClass("problem-details-on");
      view.render();
    }
  };
  
  return EventHandlers;
}