var dependencies = [
    "backbone",
    "marionette",
    "underscore"
];

define(dependencies, onResolveDependencies);

function onResolveDependencies(Backbone, Marionette, _) {
    var searchUtil = {
        doDatetimeConversion: function(datetimeNum) {

            var dateFormat = /(\d{4})(\d{2})(\d{2})(\d{2})?(\d{2})?(\d{2})?/,

                matches = datetimeNum.match(dateFormat),

                year = matches[1],
                monthNum = matches[2],
                day = matches[3],
                hr = '',
                min = '';

            if (matches[4] !== null && (typeof matches[4]) !== 'undefined') {
                hr = matches[4];
                if (matches[5] !== null && (typeof matches[5]) !== 'undefined')
                    min = ':' + matches[5];
                else
                    min = ':00';
            }



            var time = hr + min;
            return monthNum + '/' + day + '/' + year + (time.length > 0 ? ' - ' + time : '');
        }
    };
    return searchUtil;
}