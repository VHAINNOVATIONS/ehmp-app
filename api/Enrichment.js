define([], function() {
    'use strict';
    var Enrichment = {
        getFacility: _.memoize(function(facilityCode, facilityName) {
            var facilityMonikers = ADK.Messaging.request('facilityMonikers');
            var facility = facilityMonikers.findWhere({
                facilityCode: facilityCode
            });
            return facility;
        }, function(facilityCode, facilityName) {
            return ((facilityCode || '') + (facilityName || ''));
        }),
        addFacilityMoniker: function(response) {
            var self = this;
            if (response.facilityCode) {
                self.setFacilityMoniker(response);
            } else if (JSON.stringify(response).indexOf('"facilityCode":') >= 0) {
                _.each(response, function(value, key) {
                    if (_.isObject(value)) {
                        return self.addFacilityMoniker(value);
                    }
                });
            }
        },
        setFacilityMoniker: function(response) {
            var facility = this.getFacility(response.facilityCode, response.facilityName);
            if (facility) {
                response.facilityMoniker = facility.get('facilityMoniker');
                response.facilityDisplay = facility.get('facilityName');
            } else {
                response.facilityMoniker = response.facilityCode;
                response.facilityDisplay = response.facilityName;
            }
        }
    };

    return Enrichment;
});