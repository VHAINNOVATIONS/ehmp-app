var dependencies = [
    "backbone",
    "marionette",
    "underscore",
    "hbs!main/components/footer/views/syncModalTemplate",
    "main/ADK",
];

define(dependencies, onResolveDependencies);

function onResolveDependencies(Backbone, Marionette, _, modalTemplate, ADK) {
    'use strict';
    var jdsDomainToUiDomain = function (domain) {
        if (_.isUndefined(domain)) return "";
        var JdsUiDomainMapping = {
            med: "Active Medications",
            problem: "Active Problems",
            vital: "Vitals",
            visit: "Encounters",
            pov: "Encounters",
            appointment: "Encounters",
            consult:"Encounters",
            procedure: "Encounters",
            cpt: "Encounters",
            order: "Orders",
            surgery: "Encounters",
            immunization: "Immunizations",
            lab: "Lab Results",
            document: "Document",
            vlerdocument: "Document",
            image: "Image",
            allergy: "Allergies"
        };
        return JdsUiDomainMapping[domain];
    };

    var setTimeSince = function(fromDate) {
        if (_.isUndefined(fromDate)) return "";
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
        var lMonth = "M";
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
        return finalResult + " ago";
    };

    var setSyncStatus = function (syncStats) {
        if (syncStats.syncComplete) {
            return "Up to Date";
        }
    };

    var ModelView = Backbone.Marionette.ItemView.extend({
        template: modalTemplate,
        initialize: function(option) {
        	this.fetchOptions = {};
            this.fetchOptions.resourceTitle = 'synchronization-status';
            //this.fetchOptions.viewModel = viewParseModel;
            this.fetchOptions.cache = false;
            var self = this;
        	this.collection = ADK.PatientRecordService.fetchCollection(this.fetchOptions);
			this.collection.on('sync', this.onSync, this);
        },
        onSync: function(collection) {
        	// Transfer the model we get from the collection
        	var shallowCollection = collection.clone();
        	var currentSiteCode = ADK.SessionStorage.get.sessionModel('user').get('site');
        	var domainMapping = {
        		"DOD":"dod",
        		"CDS":"communities",
        		"VLER":"communities",
        		"DAS":"communities"
        	};
            domainMapping[currentSiteCode] = "mySite";
        	var allDomains = [];
        	var allSites = {};
            var allDomainModel = {};
        	//console.log(shallowCollection);
        	/* find all domains */
        	shallowCollection.each(function(model) {
        		var sysId = model.get('syncStatusByVistaSystemId');
        		_.each(_.keys(sysId), function(element){
        			var curSite;
        			if (_.isUndefined(domainMapping[element])) {
        				curSite = "allVa";
        			}
        			else{
        				curSite = domainMapping[element];
        			}
        			var domainTotal = sysId[element].domainExpectedTotals;
        			allDomains = _.union(allDomains,_.keys(domainTotal));
        			allSites[curSite] = {
                        "lastSyncTime": setTimeSince(sysId[element].lastSyncTime),
                        "syncComplete": sysId[element].syncComplete,
                        "expired": sysId[element].expired,
                        "syncReceivedAllChunks": sysId[element].syncReceivedAllChunks
                    };
        			// domains //
        			_.each(_.keys(domainTotal), function(domain){
                        var uiDomain = jdsDomainToUiDomain(domain);
                        if (uiDomain) {
                            allDomainModel[uiDomain] = allDomainModel[uiDomain] || { title: uiDomain};
                            allDomainModel[uiDomain][curSite] = allDomainModel[uiDomain][curSite] || {};
                            var domSite = allDomainModel[uiDomain][curSite];
                            if ( _.isUndefined(domSite.current) ||
                                (domSite.current === allSites[curSite].expired && domSite.current === true) ){
                                domSite.current = !allSites[curSite].expired;
                            }
                            if (_.isUndefined(domSite.status)) {
                                domSite.status = setSyncStatus(allSites[curSite]);
                            }
                            if (_.isUndefined(domSite.lastSynced) || domSite.lastSynced > allSites[curSite].lastSyncTime) {
                                domSite.lastSynced = allSites[curSite].lastSyncTime;
                            }
                        }
        			});
        		});
        	});
        	/* for each domains */
            var syncStatusModel = new Backbone.Model();
            syncStatusModel.set("syncStatus", [{domains: allDomainModel}]);
            shallowCollection.reset();
            shallowCollection.add([syncStatusModel]);
        	this.collection.reset(shallowCollection.models);
            this.model = this.collection.models[0];
            this.render();
        }
    });
    return ModelView;
}