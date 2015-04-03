var dependencies = [
    "moment",
    "main/ADK",    
    "crossfilter",
    "app/applets/encounters/appConfig"
];

define(dependencies, onResolveDependencies);

function onResolveDependencies(Moment, ADK, Crossfilter, CONFIG) {
    'use strict';
    // Switch ON/OFF debug info    
    var DEBUG       = CONFIG.debug;
    // Top tile ordering & injection
    var EVENT_LIST = CONFIG.eventOrder;    
   // var EMPTY_MODEL = CONFIG.getEmpty;
    var appHelper = {
        parseDate: function(datetime,aggregation){
            var result = moment(datetime, 'YYYYMMDDHHmmssSSS').format('YYYYMMDD');
            if(typeof aggregation !== 'undefined' ){
                if(DEBUG) console.log("Chart data aggregation ---->>" + aggregation);
               switch (aggregation.toLowerCase()) {
                case "y":
                    result  = moment(datetime, 'YYYYMMDDHHmmssSSS').format('YYYY');
                    break;
                case "ym":
                    result  = moment(datetime, 'YYYYMMDDHHmmssSSS').format('YYYYMM');
                    break; 
                case "ymd":
                    result  = moment(datetime, 'YYYYMMDDHHmmssSSS').format('YYYYMMDD');
                    break;                       
               }
            }
            return result;
        },
        setAggregationScale: function(selector){
            var result = "ymd";
              /*  if(selector == "all-range-global") {
                    result = "y";
                } else if(selector == "1yr-range-global"){
                    result = "ymd";
                } else if (selector == "2yr-range-global"){
                    result = "ym";
                }else if (selector == "custom-range-apply-global"){
                    result = "ym";
                }*/
            return result;
        },
        displayDate: function(datetime){
         return moment(datetime, 'YYYYMMDD').format('YYYY-MM-DD');//'YYYY-MM-DD'
        },
        isAppointment: function(model) {
            if((model.uid.indexOf('appointment') !== -1)&&(this.isVisit(model))){
                if(moment(model.dateTime,'YYYYMMDDHHmm').isBefore(moment())){ 
                    return false;
                }else{
                    return true;
                }
            }else{
              if((model.uid.indexOf('visit') !== -1)&&(this.isVisit(model))){ // in the future
                if(moment(model.dateTime,'YYYYMMDDHHmm').isAfter(moment())){
                   return true;
                }
              }      
            }
         return false;
        },
        isProcedure: function(model) {
            if(model.kind.indexOf('Procedure') !== -1){
                return true;
            }else{
                return false;
            }
        },
        isAdmission: function(model) {
            if(model.kind.indexOf('Admission') !== -1){
                return true;
            }else{
                return false;
            }
        },        
        isDoDAppointment: function(model) {
            if(model.kind.indexOf('DoD Appointment') !== -1){
                return true;
            }else{
                return false;
            }
        },
        isDoDEncounter: function(model) {
            if(model.kind.indexOf('DoD Encounter') !== -1){
                return true;
            }else{
                return false;
            }
        }, 
        showDetailView: function(paramObj,channelName) {
                //console.log(paramObj);       
                var channelObject = paramObj;
                var model =  channelObject.model = new Backbone.Model( channelObject.model.get("recent_model")); 
                                ADK.showModal(ADK.Views.Loading.create(), {
                                    size: "large",
                                    title: "Loading..."
                                });
                                var channel = ADK.Messaging.getChannel(channelName),
                                    deferredResponse = channel.request('detailView', channelObject);

                                deferredResponse.done(function(response) {
                                    ADK.showModal(response.view, {
                                        size: "large",
                                        title: response.title
                                    });
                                    $('#mainModal').modal('show');
                                });
            },
        // Clean up kind/subkind(stopCodeName)
        clanUpItem: function(item){
            return item.replace(/[\s\\/()!?*&:;,.^%]/g, '');
        },
        // sets first event, depends on GDF and first event for patient 
        selectStartStopPoint: function(firstEvent){ //YYYYMMDD
            //console.log(firstEvent);
            var filterMode = ADK.SessionStorage.getModel_SessionStoragePreference('globalDate').get("selectedId");
            var fromDate = moment(ADK.SessionStorage.getModel_SessionStoragePreference('globalDate').get("fromDate"),"MM/DD/YYYY").format("YYYYMMDD"); //MM/DD/YYYY
            var toDate = moment(ADK.SessionStorage.getModel_SessionStoragePreference('globalDate').get("toDate"),"MM/DD/YYYY").format("YYYYMMDD");
            //var maxDate = +new Date + (6 * 24 * 3600 * 1000 * 30); // 6 monthes ahead
            var maxDate = moment().add(6, 'M'); // 6 monthes ahead
            var aDate = moment().add(1, 'd'); // 6 monthes ahead
            
          if (filterMode === "all-range-global"){
            return {start: firstEvent, stop: moment(maxDate).format("YYYYMMDD") };
          } else if(filterMode === "custom-range-apply-global" ) {
            //return {start: fromDate, stop: moment(toDate, 'MM/DD/YYYY')*(24 * 3600 * 1000 * 30)};
            return {start: fromDate, stop: toDate };
          }
            //return {start: fromDate, stop: moment(maxDate).format("YYYYMMDD") };
            return {start: fromDate, stop: moment(aDate).format("YYYYMMDD")  };
        },
        // empty model for top tile   
        getEmpty : function(start){ 
            return {kind:"",elKind:"",count:0,
                    firstEvent: this.selectStartStopPoint(start).start,
                    lastEvent:"",
                    timeSinceLast:"None",
                    chartData:[],
                    firstEventDisplay: "",
                    lastEventDisplay: "",
                    maxChart: this.selectStartStopPoint(start).stop,
                    processed: true,
                    empty:true,
                    order: 0 };
        },        
        // Adds empty data if top categories not exist
        addEmptyTiles: function(collection,start){
          var arrTiles = [];
          var arrKind = [];
          //var model = this.getEmpty();
            for (var tile in EVENT_LIST) {
                //console.log(EVENT_LIST[tile].title);
              arrTiles.push(EVENT_LIST[tile].title);
              arrKind.push(tile);    
            }
            for(var i=0;i<arrTiles.length;i++){
                if(collection.where({kind: arrTiles[i] }).length === 0){
                    var model = this.getEmpty(start);
                    // Prepare empty model
                    if(EVENT_LIST[arrKind[i]]){
                        model.kind  = arrTiles[i]; 
                        model.elKind = this.clanUpItem(model.kind);
                        model.order = EVENT_LIST[arrKind[i]].order;
                    }
                    // Add empty model
                    //console.log(arrTiles[i]);
                    collection.add(model);
                    
                }
            }
        
        },
        // Needs to check data source (probally filtering already done) added by VR 2015-02-02
        filterAppointments: function(collection){
            var i,k;
            var arrToRemove = [];
            var dataset = new Crossfilter(collection.toJSON());
            var dimByKind = dataset.dimension(this.crossfilterStuff.dimKind); //this.crossfilterStuff.dimKind
            var arrVisits = dimByKind.filterExact("Visit").top(Infinity);
            dimByKind.filterAll();
            var arrAppointment = dimByKind.filterExact("Appointment").top(Infinity);
            dimByKind.filterAll();
            //console.log(arrAppointment);
            //console.log(arrVisits);
            for(i=0;i<arrAppointment.length;i++){
                for(k=0;k<arrVisits.length;k++){
                  if((arrAppointment[i].dateTime.toLowerCase() == arrVisits[k].dateTime.toLowerCase())&&(arrAppointment[i].stopCodeName.toLowerCase() == arrVisits[k].stopCodeName.toLowerCase())&&(arrAppointment[i].facilityName.toLowerCase() == arrVisits[k].facilityName.toLowerCase())){
                  if(DEBUG) console.log("Appointment duplication ----->>>" + arrVisits[k].dateTime.toLowerCase() + " | "+arrAppointment[i].facilityName+" | "+ arrVisits[k].facilityName);
                      arrToRemove.push(collection.findWhere({uid: arrAppointment[i].uid}));
                  }
                }
            }
             dimByKind.dispose();
             dataset = null;
            // remove duplicated Appointments
            collection.remove(arrToRemove);
            return arrToRemove.length; // number of duplications
        },
        crossfilterStuff: { dimKind:  function(d) { return d.kind; }
        },
        isHospitalization: function(model) {
            return model.categoryCode === 'urn:va:encounter-category:AD';
        },
        //returns true if discharged, false if admitted
        isDischargedOrAdmitted: function(model) {
            if(model.stay === undefined)
                throw "stay is required for this method!";
            return model.stay.dischargeDateTime !== undefined;
        },
        isVisit: function(model) {
            return this.isKindTypeHelper(model, "visit");
        },
        /*isVisit: function(model) {
            return this.isKindTypeHelper(model, "visit") ||
                this.isKindTypeHelper(model, "admission");
        },*/            
        isKindTypeHelper: function(model, kindType) {
            if(model === undefined) return false;
            var kind = model.kind;
            if(model instanceof Backbone.Model)
                kind = model.get('kind');
            if(kind === undefined) return false;
            kind = kind.toLowerCase();
            return(kind === kindType);
        },        
        getActivityDateTime: function(model) {
            if(this.isVisit(model)) {
                if(this.isHospitalization(model) && this.isDischargedOrAdmitted(model))   {
                    return model.stay.dischargeDateTime;
                }
                return model.dateTime;
            }
            else  
                return model.dateTime;

        },
        convertChartDate: function(time){
            return moment.utc(time, "YYYYMMDD").valueOf();
        },
        nowChart: function(){
         var tm = moment().format("YYYYMMDDHHmmssSSS");
            //if(DEBUG) console.log(this.convertChartDate(tm));
            return this.convertChartDate(tm);
        }/*,
        setTimeSince: function(fromDate) { // depricated


            var startDate = moment(fromDate, 'YYYYMMDDHHmmssSSS');
            var endDate = moment();

            var duration = moment.duration(endDate.diff(startDate));

            var years = parseFloat(duration.asYears());
            var days = parseFloat(duration.asDays());
            var months = parseFloat(duration.asMonths());
            var hours = parseFloat(duration.asHours());
            var min = parseFloat(duration.asMinutes());

            if(min > 0 && min < 60){
                hours = 1;
            }
            //console.log(hours1);

            var lYear = "y";
            var lMonth = "m";
            var lDay = "d";
            var lHour = "h";
            var finalResult = "";
            if (months >= 24) {
                finalResult = Math.round(years) + lYear;
            } else if ((months < 24) && (days > 60)) {
                finalResult = Math.round(months) + lMonth;
            } else if ((days >= 2) && (days <= 60)) {
                finalResult = Math.round(days) + lMonth;
            } else if (days < 2) {
                finalResult = Math.round(hours) + lHour;
            }

            return finalResult;
        }*/
     
        // end of appHelpers
    };
    return appHelper;
}