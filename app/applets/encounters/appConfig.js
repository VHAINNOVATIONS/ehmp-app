var dependencies = [
    "main/ADK", 
];

define(dependencies, onResolveDependencies);

function onResolveDependencies(ADK) { 
    'use strict';
var Config = {
    // Switch ON/OFF debug info
        debug: false,

    // order for top level of tiles
        eventOrder: {
                    visit:       { title: "Visits",     order:  0, sort_direction: "past"}, //oreder - 0 ->up/ 3-> down
                    admission:   { title: "Admissions", order:  1, sort_direction: "past"},
                    procedure:   { title: "Procedures", order:  2, sort_direction: "past"},
                    appointment: { title: "Appointments",order: 3, sort_direction: "future"}
        },
    // group by
        groupBy: { visit :       {grouping:[{title: "Type", field: "stopCodeName"}],
                                  sort_direction: "past", 
                                  parser: function(obj){
                                                          obj.applet_id = "enc_detail_v_a";  // chanel name for visit detail view
                                                          obj.allGroupedEncounters = [];
                                                          for(var z=0;z<obj.recent.length; z++){
                                                                     obj.allGroupedEncounters.push({
                                                                            dateTime:     obj.recent[z].showDate,
                                                                            problemText:  obj.recent[z].stopCodeName,
                                                                            stopCodeName: obj.recent[z].facilityName
                                                                     });
                                                            }
                                                        if(obj.recent.length>0){ 
                                                            obj.uid = obj.recent[0].uid;
                                                            obj.recent_model = obj.recent[0]; 
                                                        }
                                 }  },
                   appointment : {grouping:[{title: "Type", field: "stopCodeName"}],
                                  sort_direction: "future",
                                  parser: function(obj){
                                                          obj.applet_id = "enc_detail_v_a";  // chanel name for admission detail view
                                                          obj.allGroupedEncounters = [];
                                                          for(var z=0;z<obj.recent.length; z++){
                                                                     obj.allGroupedEncounters.push({
                                                                            dateTime:     obj.recent[z].showDate,
                                                                            problemText:  obj.recent[z].stopCodeName,
                                                                            stopCodeName: obj.recent[z].facilityName
                                                                     });
                                                            }
                                                        if(obj.recent.length>0){ 
                                                            obj.uid = obj.recent[0].uid;
                                                            obj.recent_model = obj.recent[0]; 
                                                        }
                                 } },
                   procedure :   {grouping:[{title: "Facility", field: "facilityName"}],
                                  sort_direction: "past",
                                  parser: function(obj){
                                                        obj.applet_id = "enc_detail_p";  // chanel name for procedure detail view
                                                        obj.allGroupedEncounters = [];
                                                        for(var z=0;z<obj.recent.length; z++){
                                                                     obj.allGroupedEncounters.push({
                                                                            dateTime:     obj.recent[z].showDate,
                                                                            problemText:  obj.recent[z].service,
                                                                            stopCodeName: obj.recent[z].facilityName
                                                                     });
                                                          }
                                                        if(obj.recent.length>0){ 
                                                            obj.uid = obj.recent[0].uid;
                                                            obj.recent_model = obj.recent[0]; 
                                                        }
                                 }                                 
                                 }
            },
    // show without grouping
        showBy:  { admission:   {showing: [
                                        {title: "Date", field: "showDate"},  // field is parsing result
                                        {title: "Location", field: "locationDisplayName"},
                                        {title: "CLN/WARD", field: "facilityName"},
                                        {title: "DateTime", field: "dateTime"}, // for datetime sorting
                                        {title: "uid", field: "uid"}, // for id
                                        {title: "Service", field: "service"} 
                                    ],
                                 parser: function(obj){
                                        obj.subKind = obj.locationDisplayName+" - "+obj.facilityName;
                                        obj.time = ADK.utils.getTimeSince(obj.dateTime).timeSince;//obj.showDate;
                                        obj.sort_time = obj.dateTime;
                                        obj.count = 1; 
                                        obj.applet_id = "enc_detail_v_a";  // chanel name for admission detail view
                                        obj.allGroupedEncounters = [];
                                        obj.allGroupedEncounters.push({
                                                                      dateTime:     obj.showDate,
                                                                      problemText:  obj.service,
                                                                      stopCodeName: obj.facilityName
                                                                    });
                                }}
           }
    };
  return Config;
}