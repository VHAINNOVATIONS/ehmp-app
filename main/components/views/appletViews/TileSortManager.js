define([
    "api/ResourceService",
    "api/Messaging",
    'api/UserDefinedScreens'
], function(ResourceService, Messaging, UserDefinedScreens) {
    'use strict';

    var TileSortManager = {};

    var sortCollection = function(originalCollection, sortAttribute, tileSortOrder) {
        var wasSorted = false;

        if(_.isUndefined(sortAttribute)){
            sortAttribute = 'uid';
        }

        for (var i = 0; i < tileSortOrder.length; i++) {

            wasSorted = true;

            var currentModel = _.find(originalCollection.models, customSort);
            originalCollection.remove(currentModel);
            originalCollection.add(currentModel, {
                at: i
            });
        }

        function customSort(currentItem) {
            return currentItem.attributes[sortAttribute] == tileSortOrder[i];
        }

        return wasSorted;
    };

    TileSortManager.getSortOptions = function(originalCollection, appletId, sortAttribute, cb) {
        var wasSorted = false;
        var currentScreen = Messaging.request('get:current:screen');

        if (currentScreen.config.predefined && typeof cb === 'function'){
            cb(wasSorted, originalCollection);
            return;
        }
        var workspaceId = currentScreen.id;
        var userConfig = UserDefinedScreens.getUserConfigFromSession();

        if(userConfig && userConfig.userDefinedSorts){
            var tileSortConfig = _.findWhere(userConfig.userDefinedSorts, { id: workspaceId});

            if(tileSortConfig){
                var obj = _.find(tileSortConfig.applets, function(obj) {
                    return obj.instanceId == appletId;
                });

                if (obj === undefined) {
                    if (typeof cb === "function") {
                        cb(wasSorted, originalCollection);
                    }
                    return;
                }

                var tileSortOrder = obj.orderSequence[0].split(",");

                wasSorted = sortCollection(originalCollection, sortAttribute, tileSortOrder);

                if (typeof cb === "function") {
                    cb(wasSorted, originalCollection);
                    return;
                }                
            }
        }

        if (typeof cb === "function") {
           cb(wasSorted, originalCollection);
        }
        return;
    };

    TileSortManager.reorderRows = function(reorderObj, collection, sortId, sortKey, unsortedModels, successCallback) {
        if(_.isUndefined(sortKey)){
            sortKey = 'uid';
        }

        //Use jquery to move the list item instead of backbone so we don't have to re-render the item
        var temp = collection.at(reorderObj.oldIndex);
        var listElement = reorderObj.listElement;
        var removedElement = $(listElement).find('div.gistItem:eq(' + reorderObj.oldIndex + ')').detach();
        collection.remove(temp, {silent: true});

        if(reorderObj.newIndex === collection.models.length){
            $(listElement).append(removedElement);
        }else {
            $(listElement).find('div.gistItem:eq(' + reorderObj.newIndex + ')').before(removedElement);
        }
        collection.add(temp, {
            at: reorderObj.newIndex,
            silent: true
        });
        var newSorted = [];

        collection.models.forEach(function(item) {
            if (_.isUndefined(item.attributes) || _.isUndefined(item.attributes[sortKey])){
                return;
            }else {
                newSorted.push(item.attributes[sortKey]);
            }
        });

        var workspaceId = Messaging.request('get:current:screen').id;
        var SaveSortModel = Backbone.Model.extend({
            sync: function(method, model, options) {

                var params = {
                    type: 'POST',
                    url: model.url(),
                    contentType: "application/json",
                    data: JSON.stringify(model.toJSON()),
                    dataType: "json"
                };

                $.ajax(_.extend(params, options));

            },
            url: function() {
                var id = workspaceId;
                return ResourceService.buildUrl('user-defined-sort', {
                    'id': id,
                    'instanceId': sortId
                });
            }
        });

        var obj = {};
        obj.instanceId = sortId;
        obj.keyField = sortKey;
        obj.orderAfter = "";
        obj.fieldValue = newSorted.join(",");

        var saveInstance = new SaveSortModel(obj);
        saveInstance.save(null, {
            success: function(model, response) {
                var currentConfig = UserDefinedScreens.getUserConfigFromSession();
                currentConfig.userDefinedSorts = response.data.userDefinedSorts;
                UserDefinedScreens.saveUserConfigToSession(currentConfig);

                if(successCallback){
                    successCallback();
                }
            },
            error: function(model) {}
        });
    };

    var findIndex = function(array, callback, thisArg) {
        var index = -1,
            length = array ? array.length : 0;

        while (++index < length) {
            if (callback(array[index], index, array)) {
                return index;
            }
        }
        return -1;
    };


    var findScreenIndex = function(json, workspaceId) {
        var screenIndex = findIndex(json.userDefinedSorts, function(screen) {
            return screen.id === workspaceId;
        });
        return screenIndex;
    };

    var findAppletIndex = function(screenConfig, instanceId) {
        var appletIndex = findIndex(screenConfig.applets, function(applet) {
            return applet.instanceId === instanceId;
        });
        return appletIndex;
    };


    //check if there's any sorts in applet
    TileSortManager.hasSort = function(workspaceId, appletId) {
        var json = ADK.UserDefinedScreens.getUserConfigFromSession();
        var screenIndex = findScreenIndex(json, workspaceId);
        if (screenIndex === -1) return false;
        var screenConfig = json.userDefinedSorts[screenIndex];
        var appletIndex = findAppletIndex(screenConfig, appletId);
        if (appletIndex === -1) return false;
        return true;
    };

    TileSortManager.removeSort = function(instanceId, onSuccessCallback) {

        var workspaceId = Messaging.request('get:current:screen').id;
        if(!TileSortManager.hasSort(workspaceId, instanceId)) {
            //if there's no sort exists, just call the callback and return
            if(onSuccessCallback) onSuccessCallback();
            return;
        }
        var fetchOptions = {
            resourceTitle: 'user-defined-sort',
            fetchType: 'DELETE',
            criteria: {
                id: workspaceId,
                instanceId: instanceId
            },
            onSuccess: function(model, response){
                var currentConfig = UserDefinedScreens.getUserConfigFromSession();
                currentConfig.userDefinedSorts = response.data.userDefinedSorts;
                UserDefinedScreens.saveUserConfigToSession(currentConfig);

                if(onSuccessCallback){
                    onSuccessCallback();
                }
            }
        };

        ResourceService.patientRecordService.fetchCollection(fetchOptions);

    };

    return TileSortManager;
});