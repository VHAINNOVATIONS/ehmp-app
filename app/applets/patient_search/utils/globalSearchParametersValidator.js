var dependencies = [
    "backbone",
    "marionette",
    "underscore"
];

define(dependencies, onResolveDependencies);

function onResolveDependencies(Backbone, Marionette, _) {
    var globalSearchParametersValidator = {

        validateGlobalSearchParameterConfiguration: function(data) {
            if (data.lname.trim() === "") {
                return "lastNameRequiredFailure";
            } else if ((data.fname.trim() === "") && (data.dob === "") && (data.ssn === "")) {
                return "twoFieldsRequiredFailure";
            } else {
                return "success";
            }
        },

        validateGlobalSearchParameterFormatting: function(data) {
            var namePattern = /^[- ,A-Z']+$/;
            var ssnPattern = /^(\d{3})-?(\d{2})-?(\d{4})$/;
            var dobPattern = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;

            if (((data.lname.trim() !== "") && (data.lname.match(namePattern) === null)) || ((data.fname.trim() !== "") && (data.fname.match(namePattern) === null))) {
                return "nameFormatFailure";
            } else if ((data.dob.trim() !== "") && (data.dob.match(dobPattern) === null)) {
                return "dobFormatFailure";
            } else if ((data.ssn.trim() !== "") && (data.ssn.match(ssnPattern) === null)) {
                return "ssnFormatFailure";
            } else {
                return "success";
            }
        }
    };
    return globalSearchParametersValidator;
}