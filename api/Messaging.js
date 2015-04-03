'use strict';
var dependencies = [
    'backbone.radio'
];

define(dependencies, onResolveDependencies);

function onResolveDependencies() {

    var Messaging = Backbone.Radio.channel('global');

    Messaging.getChannel = function(channelName) {
        return Backbone.Radio.channel(channelName);
    };

    return Messaging;
}