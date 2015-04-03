var dependencies = [
    'backbone',
    'marionette',
    'jquery',
    'main/Session'
];

define(dependencies, onResolveDependencies);

function onResolveDependencies(Backbone, Marionette, $, session) {
    'use strict';

    var APPLET_STORAGE_KEY = 'appletStorage';

    var Storage = {
        check: {
            supportsSessionStorage: function() {
                if (typeof(window.sessionStorage) === 'undefined') {
                    return false;
                }
                return true;
            },
            existsInSessionStorage: function(key) {
                if (window.sessionStorage.hasOwnProperty(key)) {
                    return true;
                }
                return false;
            },
            existsInMemory: function(key) {
                if ((typeof(session) === 'undefined') || typeof(session[key]) === 'undefined') {
                    return false;
                }
                return true;
            },
            appletHasSessionStorage: function(appletId, model) {
                if (!model) {
                    model = Storage.get.sessionModel(APPLET_STORAGE_KEY);
                }
                if (!(model.has(appletId))) {
                    return false;
                }
                return true;
            }
        },
        set: {
            sessionModel: function(key, value, preference) {
                if (Storage.check.supportsSessionStorage()) {
                    window.sessionStorage.setItem(key, JSON.stringify(value.toJSON()));
                }
                if ( (!preference || preference === 'session') && Storage.check.existsInMemory(key) ) {
                    session[key].set(value.toJSON());
                }
            },
            appletStorageModel: function(appletId, key, value) {
                var model = Storage.get.appletStorageModel(appletId, key);
                model.get(appletId)[key] = value;
                Storage.set.sessionModel(APPLET_STORAGE_KEY, model);
            }
        },
        get: {
            sessionModel: function(key, preference) {
                if ( (!preference || preference === 'session') && Storage.check.existsInMemory(key) ) {
                    return session[key];
                } else if (Storage.check.supportsSessionStorage()) {
                    return new Backbone.Model(JSON.parse(window.sessionStorage.getItem(key)));
                }
                return null;
            },
            appletStorageModel: function(appletId) {
                var model = Storage.get.sessionModel(APPLET_STORAGE_KEY);
                if (!Storage.check.appletHasSessionStorage(appletId, model)) {
                    model.set(appletId, {});
                }
                return model;
            }
        },
        delete: {
            sessionModel: function(key) {
                if ( Storage.check.existsInMemory(key) ) {
                    session.clearSessionModel(key);
                } else if (Storage.check.supportsSessionStorage()) {
                    window.sessionStorage.removeItem(key);
                }
            },
            appletStorageModel: function(appletId) {
                var model = Storage.get.sessionModel(APPLET_STORAGE_KEY);

                if (!Storage.check.appletHasSessionStorage(appletId, model)) {
                    model.unset(appletId);
                    Storage.set.sessionModel(APPLET_STORAGE_KEY, model);
                }
            },
            all: function(){
                session.clearAllSessionModels();
                window.sessionStorage.clear();
            }
        },

        //---------OLD METHODS------------------//
        addModel: function(key, value) {
            this.set.sessionModel(key, value);
        },
        getModel: function(key) {
            return this.get.sessionModel(key);
        },
        clear: function(key) {
            this.delete.sessionModel(key);
        },
        getModel_SessionStoragePreference: function(key) {
            return this.get.sessionModel(key);
        },
        setAppletStorageModel: function(appletId, key, value) {
            this.set.appletStorageModel(appletId, key, value);
        },
        getAppletStorageModel: function(appletId, key) {
            return this.get.appletStorageModel(appletId).get(appletId)[key];
        },
        clearAppletStorageModel: function(appletId) {
            this.delete.appletStorageModel(appletId);
        }
    };

    session.user.on('change', Storage.set.sessionModel('user', session.user,'sessionStorage'));
    session.patient.on('change', Storage.set.sessionModel('patient', session.patient,'sessionStorage'));
    session.globalDate.on('change', Storage.set.sessionModel('globalDate', session.globalDate,'sessionStorage'));

    return Storage;
}