::: page-description
# What's new in the ADK? #
The following changelog has been provided to better communicate changes made to the ADK
:::

::: definition
Changes that will be reflected in this changelog:
- Any new additions or changes to ADK.UI components, API functionality, or code conventions
- Any other changes to the ADK that affect consumption/implementation for applet developers

Changes that will **NOT** be reflected:
- Any behind-the-scenes optimizations
- Non-relevant changes to the application
- Any other changes to the ADK that do not affect applet developers
:::

<!-- Update categories: Additions, Changes, Removals, and Fixes -->

## 2015-09-16 (September 16th, 2015) ##
### Additions ###
- The [Workflow component](ui-library.md#Workflow-Step-Object) and [Modal component](ui-library.md#Modal--window-) now support the size: "**small**".
	- Example Usage:
		``` JavaScript
		var modalOptions = {
	        'size': "small"
	        //...other options
	    }
	    var modalView = new ADK.UI.Modal({view: view, options: modalOptions});
	    modalView.show();
		```
		``` JavaScript
		var workflowOptions = {
	        'size': "small"
	        //...other options
	    }
	    var workflowView = new ADK.UI.Workflow({view: view, options: workflowOptions});
	    workflowView.show();
		```
- The [Checklist Form Control](form-controls.md#Checklist) now supports following trigger events: `control:item:disabled` `control:item:value`.
	- Example Usage:
		``` JavaScript
		$().trigger('control:item:disabled', {itemName:'uniqueName',booleanValue:true})
		```
		``` JavaScript
		$().trigger('control:item:value', {itemName:'uniqueName',booleanValue:true})
		```

## 2015-09-09 (September 9th, 2015) ##
### Additions ###
- The [Workflow component](ui-library.md#Workflow-Step-Object) now allows you to change the workflow modal header dynamically. The following [methods](ui-library.md#Extra-Workflow-Methods-to-take-advantage-of-) are now available: **changeHeaderTitle**, **changeHeaderActionItems**, **changeHeaderCloseButtonOptions**.
	- Example Usage:
		``` JavaScript
		var workflowController = new ADK.UI.Workflow(workflowOptions);

		workflowController.changeHeaderTitle('New Header Title');

		workflowController.changeHeaderActionItems([{
		    label: 'Close',
		    onClick: function(){
		        ADK.UI.Workflow.hide();
		    }
		}]);

		workflowController.changeHeaderCloseButtonOptions({
		    title: 'Press enter to save and close',
		    onClick: function(){
		        //custom code to go here
		    }
		});
		```
		Another example that shows methods being used in conjunction with the onBeforeShow of a workflow step:
		``` JavaScript
		... // additional workflow options
		steps: [{
            ... // additional step options (view, viewModel, stepTitle)
            onBeforeShow: function() {
                this.changeHeaderTitle('Header Title - Step 1');
            }
        }, {
            ... // additional step options (view, viewModel, stepTitle)
            onBeforeShow: function() {
                this.changeHeaderTitle('Header Title - Step 2');
            }
        }]
		```
- The [Workflow component](ui-library.md#Workflow-Step-Object) now allows an **onBeforeShow** callback function to be passed in as an option to each step.
	- Example:
		``` JavaScript
		... // additional workflow options
		steps: [{
            ... // additional step options (view, viewModel, stepTitle)
            onBeforeShow: function() {
                console.log("ON BEFORE SHOW OF STEP 1");
            }
        }
        ... // additional step objects
        ]
		```

## 2015-09-08 (September 8th, 2015) ##
### Additions ###
- The [Checklist Form Control](form-controls.md#Checklist) now supports the following options:
	- hideCheckboxForSingleItem
	- itemTemplate
	- selectedCountName
	- srOnlyLabel

## 2015-08-28 (August 28th, 2015) ##
### Changes ###
- The [Select](form-controls.md#Select) sorts the resulting suggestion list when filtering is enabled by either showFilter or fetchFunction option. In case of groupEnabled, it sorts only items within each group, but not the groups.
### Fixes ###
- The [Checklist Form Control](form-controls.md#Checklist) now creates each checkbox's input id from the checklist control's name string concatenated with the collection items's name.  This change was made to prevent against duplicated ids.

## 2015-08-26 (August 26th, 2015) ##
### Changes ###
- Examples of using Marionette's **ui** hash have been updated for both the [ADK UI Library](ui-library.md) and [Form Controls](form-controls.md) pages.
	- Was: `this.$(this.ui.selector1)`
	- Now: `this.ui.selector1`
	- **Note:** Specifically the changes can be seen in the form control's "Example of dynamically changing the controls config attributes" section and under the [ADK.UI.Form](ui-library.md#Form) UI component documentation

## 2015-08-19 (August 19th, 2015) ##
### Additions ###
- The [Typeahead](form-controls.md#Typeahead) control provides a way to show/hide a loading spinner.
- The [Typeahead](form-controls.md#Typeahead) control provides a way to update the control upon successful _asynchronous_ fetching.

## 2015-08-12 (August 12th, 2015) ##
### Additions ###
- The [Drilldown Checklist](form-controls.md#Drilldown-Checklist) control can be used for when you have a grouping of options.
- The [Select](form-controls.md#Select) control provides a way to update the control upon successful _asynchronous_ fetching.

## 2015-07-28 (July 28th, 2015) ##
### Additions ###
- Images for each [ADK.UI.Form controls][FormControls]. These were added to make it more clear what each control is.
### Changes ###
- [Nested Comment Box](form-controls.md#Nested-Comment-Box) column `title` option now is `columnTitle`. This change was made in order to avoid conflicts with each _additionalColumns_ object, which allows for all options of controls. In other words, the change to `columnTitle` will allows there to be a specific `title` option passed in for the desired control.
	- **Note**: this change takes effect in the `itemColumn`, `commentColumn`, and `additionalColumns` options object. Please review the [Nested Comment Box documentation](form-controls.md#Nested-Comment-Box) for a full list of options.
	- Was:
		``` JavaScript
		...
		additionalColumns: [{
			// this also set the title for the control specified
			title: "Header title"
			...
		}]
		```
	- Now:
		``` JavaScript
		...
		additionalColumns: [{
			// now allows for separate control-specific title option
			columnTitle: "Header Title",
			title: "Control-specific title"
			...
		}]
		```

## 2015-07-22 (July 22nd, 2015) ##
### Additions ###
- **headerOptions** option added to [Workflow](ui-library.md#Workflow--window-). This enables the use of the dropdown menu through specifying an **actionItems** array.
### Fixes ###
- HTML updated for [Nested Comment Box](form-controls.md#Nested-Comment-Box) and [Comment Box](form-controls.md#Comment-Box). These now match the prescribed 508 compliant HTML.
	- **Note**: you can use the columnClasses option in the [Nested Comment Box](form-controls.md#Nested-Comment-Box) to pass in style classes to each column, for example `columnClasses: ["percent-width-50"]`

## 2015-07-17 (July 17th, 2015) ##
_Initial Entry (recent changes)_

### Additions ###
- Growl Notifications added as [ADK.UI.Notification](ui-library.md#Notification)
- New ADK.UI.Form controls: [Collapsible Container](form-controls.md#Collapsible-Container), [Comment Box](form-controls.md#Comment-Box), [Dropdown](form-controls.md#Dropdown), [Nested Comment Box](form-controls.md#Nested-Comment-Box), [Popover](form-controls.md#Popover)
### Changes ###
- Update to the way ADK.UI components are instantiated (please see [ADK.UI Library documentation][UILibrary], in the code examples)
	- For example, instantiating [ADK.UI.Alert](ui-library.md#Alert) used to look like:
		```JavaScript
		var alertView = ADK.UI.Alert.create(options);
		ADK.UI.Alert.show(alertView);
		```
	- Now instantiating [ADK.UI.Alert](ui-library.md#Alert) looks like:
		```JavaScript
		var alertView = new ADK.UI.Alert(options);
		alertView.show();
		```
- ADK.UI.Form controls now support jquery trigger eventing. This can be used for dynamically changing ADK.UI.Form controls dynamically (after initial load)
	- The syntax would look similar to: "$('[_selector for control or group of controls_]').trigger('control:[_specific event_]', [_parameters_])"
		- Example (will hide all [**input**](form-controls.md#Input) controls):
			```JavaScript
			// only an example selector, better to use form view's $el
			$('.control.input-control').trigger('control:hidden', true)
			```
	- **Note**: These events will only work when the top level control is selected
	- Each control has "control:hidden" built in. Review the [ADK.UI.Form controls documentation][FormControls] for an extensive list of options for each control

[UILibrary]: ui-library.md
[FormControls]: form-controls.md