define(["backbone","marionette"],function(e,a){"use strict";function n(e){var a=ADK.Messaging.getChannel("addALabOrderRequestChannel"),n=a.request("addLabOrderModal");n.done(function(e){var a=e.view;a.showModal(),$("#mainModal").modal("show")})}var t={id:"narrative-lab-results-grid-full",contentRegionLayout:"gridOne",appletHeader:"navigation",appLeft:"patientInfo",applets:[{id:"narrative_lab_results_grid",title:"Narrative Lab Results",region:"center",fullScreen:!0,viewType:"expanded"}],locked:{filters:!1},onStart:function(){this.setUpEvents()},setUpEvents:function(){var e=ADK.Messaging.getChannel("addLabOrder");e.on("addLabOrder:clicked",n)},patientRequired:!0,globalDatepicker:!1};return t});