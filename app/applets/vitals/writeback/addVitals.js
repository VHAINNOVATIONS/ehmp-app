define(["backbone","marionette","jquery","handlebars","app/applets/vitals/writeback/validationUtils","app/applets/vitals/writeback/writebackUtils"],function(e,t,a,o,i,l){var n,s,r={control:"container",extraClasses:["row"],items:[{control:"container",extraClasses:["col-xs-12"],items:[{control:"container",extraClasses:["col-xs-4"],items:[{control:"datepicker",name:"dateTakenInput",title:"Please enter in a date in the following format, MM/DD/YYYY",label:"Date Taken",required:!0,options:{endDate:"0d"}}]},{control:"container",extraClasses:["col-xs-3"],items:[{control:"timepicker",name:"time-taken",title:"Please enter in a time in the following format, HH:MM",label:"Time Taken",options:{defaultTime:!1}}]},{control:"container",extraClasses:["col-xs-3"],items:[{control:"button",title:"Press enter to pass",name:"facility-name-pass-po",label:"Pass",extraClasses:["btn-default","btn-sm","top-margin-lg"]}]},{control:"container",extraClasses:["col-xs-2"],items:[{control:"button",type:"button",label:"Expand All",name:"expandCollapseAll",extraClasses:["btn-default","btn-sm","pull-right","top-margin-lg"],title:"Press enter to expand all vitals"}]},{control:"spacer"}]}]},p={control:"container",items:[{control:"select",name:"bp-location-po",label:"Location",title:"To select an option, use the up and down arrow keys then press enter to select",extraClasses:["col-xs-3"],pickList:[]},{control:"select",name:"bp-method-po",label:"Method",title:"To select an option, use the up and down arrow keys then press enter to select",extraClasses:["col-xs-3"],pickList:[]},{control:"select",label:"Cuff Size",title:"To select an option, use the up and down arrow keys then press enter to select",name:"bp-cuff-size-po",extraClasses:["col-xs-3"],pickList:[]},{control:"select",label:"Position",title:"To select an option, use the up and down arrow keys then press enter to select",name:"bp-position-po",extraClasses:["col-xs-3"],pickList:[]}]},c={control:"collapsibleContainer",name:"bpSection",headerItems:[{control:"container",extraClasses:["col-xs-6","bpInput"],items:[{control:"input",name:"bpInputValue",label:"Blood Pressure",title:"Please enter in a numeric value",extraClasses:["vitalInput"],units:"mm[HG]"}]},{control:"container",extraClasses:["col-xs-6"],items:[{control:"radio",name:"bp-radio-po",label:"Blood Pressure Vital Unavailable or Refused Radio",srOnlyLabel:!0,extraClasses:["top-margin-md"],options:[{value:"Unavailable",label:"Unavailable"},{value:"Refused",label:"Refused"}]}]}],collapseItems:[p]},u={control:"container",items:[{control:"container",extraClasses:["col-xs-6"],items:[{control:"input",label:"Pulse",name:"pulseInputValue",units:"/min",extraClasses:["vitalInput"],title:"Please enter in a numeric value"}]},{control:"container",extraClasses:["col-xs-6"],items:[{control:"radio",name:"pulse-radio-po",label:"Pulse Vital Unavailable or Refused Radio",srOnlyLabel:!0,extraClasses:["top-margin-md"],options:[{value:"Unavailable",label:"Unavailable"},{value:"Refused",label:"Refused"}]}]}]},d={control:"container",items:[{control:"select",name:"pulse-method-po",label:"Method",title:"To select an option, use the up and down arrow keys then press enter to select",extraClasses:["col-xs-3"],pickList:[]},{control:"select",name:"pulse-position-po",label:"Position",title:"To select an option, use the up and down arrow keys then press enter to select",extraClasses:["col-xs-3"],pickList:[]},{control:"select",name:"pulse-site-po",label:"Site",title:"To select an option, use the up and down arrow keys then press enter to select",extraClasses:["col-xs-3"],pickList:[]},{control:"select",name:"pulse-location-po",label:"Location",title:"To select an option, use the up and down arrow keys then press enter to select",extraClasses:["col-xs-3"],pickList:[]}]},m={control:"collapsibleContainer",name:"pulseSection",headerItems:[u],collapseItems:[d]},h={control:"container",items:[{control:"container",extraClasses:["col-xs-6"],items:[{control:"input",label:"Respiration",units:"/min",extraClasses:["vitalInput"],title:"Please enter in a numeric value",name:"respirationInputValue"}]},{control:"container",extraClasses:["col-xs-6"],items:[{control:"radio",name:"respiration-radio-po",label:"Respiration Vital Unavailable or Refused Radio",srOnlyLabel:!0,extraClasses:["top-margin-md"],options:[{value:"Unavailable",label:"Unavailable"},{value:"Refused",label:"Refused"}]}]}]},b={control:"container",items:[{control:"select",name:"respiration-method-po",label:"Method",title:"To select an option, use the up and down arrow keys then press enter to select",extraClasses:["col-xs-6"],pickList:[]},{control:"select",name:"respiration-position-po",label:"Position",title:"To select an option, use the up and down arrow keys then press enter to select",extraClasses:["col-xs-6"],pickList:[]}]},g={control:"collapsibleContainer",name:"respirationSection",headerItems:[h],collapseItems:[b]},f={control:"container",items:[{control:"container",extraClasses:["col-xs-6"],items:[{control:"input",name:"temperatureInputValue",label:"Temperature",title:"Please enter in a numeric value",extraClasses:["vitalInput"],units:[{label:"F",value:"F",title:"fahrenheit"},{label:"C",value:"C",title:"celsius"}]}]},{control:"container",extraClasses:["col-xs-6"],items:[{control:"radio",name:"temperature-radio-po",label:"Temperature Vital Unavailable or Refused Radio",srOnlyLabel:!0,extraClasses:["top-margin-md"],options:[{value:"Unavailable",label:"Unavailable"},{value:"Refused",label:"Refused"}]}]}]},x={control:"container",extraClasses:["col-xs-6"],items:[{control:"select",label:"Location",title:"To select an option, use the up and down arrow keys then press enter to select",name:"temperature-location-po",pickList:[]}]},v={control:"collapsibleContainer",name:"temperatureSection",headerItems:[f],collapseItems:[x]},C={control:"container",items:[{control:"container",extraClasses:["col-xs-6"],items:[{control:"input",name:"O2InputValue",label:"Pulse Oximetry",title:"Please enter in a numeric value",units:"%",extraClasses:["vitalInput"]}]},{control:"container",extraClasses:["col-xs-6"],items:[{control:"radio",name:"po-radio-po",label:"Pulse Oximetry Vital Unavailable or Refused Radio",srOnlyLabel:!0,extraClasses:["top-margin-md"],options:[{value:"Unavailable",label:"Unavailable"},{value:"Refused",label:"Refused"}]}]}]},w={control:"container",items:[{control:"input",label:"Supplemental Oxygen Flow Rate",name:"suppO2InputValue",units:"(liters/minute)",title:"Please enter in a numeric value",extraClasses:["col-xs-6"]},{control:"select",label:"Method",name:"po-method-po",title:"To select an option, use the up and down arrow keys then press enter to select",extraClasses:["col-xs-6"],pickList:[]}]},I={control:"collapsibleContainer",name:"poSection",headerItems:[C],collapseItems:[w]},k={control:"container",items:[{control:"container",extraClasses:["col-xs-6"],items:[{control:"input",name:"heightInputValue",label:"Height",title:"Please enter in a numeric value",extraClasses:["vitalInput"],units:[{label:"in",value:"in",title:"inches"},{label:"cm",value:"cm",title:"centimeters"}]}]},{control:"container",extraClasses:["col-xs-6"],items:[{control:"radio",name:"height-radio-po",label:"Height Vital Unavailable or Refused Radio",srOnlyLabel:!0,extraClasses:["top-margin-md"],options:[{value:"Unavailable",label:"Unavailable"},{value:"Refused",label:"Refused"}]}]}]},y={control:"container",extraClasses:["col-xs-6"],items:[{control:"select",label:"Quality",name:"height-quality-po",title:"To select an option, use the up and down arrow keys then press enter to select",pickList:[]}]},V={control:"collapsibleContainer",name:"heightSection",headerItems:[k],collapseItems:[y]},A={control:"container",items:[{control:"container",extraClasses:["col-xs-6"],items:[{control:"input",name:"weightInputValue",label:"Weight",title:"Please enter in a numeric value",extraClasses:["vitalInput"],units:[{label:"lb",value:"lb",title:"lb Units"},{label:"kg",value:"kg",title:"kg Units"}]}]},{control:"container",extraClasses:["col-xs-6"],items:[{control:"radio",name:"weight-radio-po",label:"Weight Vital Unavailable or Refused Radio",srOnlyLabel:!0,extraClasses:["top-margin-md"],options:[{value:"Unavailable",label:"Unavailable"},{value:"Refused",label:"Refused"}]}]}]},D={control:"container",items:[{control:"select",name:"weight-method-po",label:"Method",title:"To select an option, use the up and down arrow keys then press enter to select",extraClasses:["col-xs-6"],pickList:[]},{control:"select",name:"weight-quality-po",label:"Quality",title:"To select an option, use the up and down arrow keys then press enter to select",extraClasses:["col-xs-6"],pickList:[]}]},U={control:"collapsibleContainer",name:"weightSection",headerItems:[A],collapseItems:[D]},R={control:"container",extraClasses:["row"],items:[{control:"container",extraClasses:["col-xs-12"],items:[{control:"container",extraClasses:["col-xs-2","left-padding"],items:[{control:"input",name:"pain-value-po",label:"Pain",extraClasses:["vitalInput"],placeholder:"0-10",title:"Please enter in a numeric value for pain from 0 to 10, 0 being no pain and 10 being the greatest amount of pain"}]},{control:"container",extraClasses:["col-xs-5","all-padding-no"],items:[{control:"checkbox",label:"Unable to Respond",name:"pain-checkbox-po",extraClasses:["top-margin-lg"],title:"To select this checkbox, press the spacebar"}]},{control:"container",extraClasses:["col-xs-4"],items:[{control:"radio",name:"pain-radio-po",label:"Pain Vital Unavailable or Refused Radio",srOnlyLabel:!0,extraClasses:["top-margin-md"],options:[{value:"Unavailable",label:"Unavailable"},{value:"Refused",label:"Refused"}]}]}]}]},M={control:"container",items:[{control:"container",extraClasses:["col-xs-6"],items:[{control:"input",label:"Circumference/Girth",name:"circumValue",title:"Please enter in a numeric value",extraClasses:["vitalInput"],units:[{label:"in",value:"in",title:"in Units"},{label:"cm",value:"cm",title:"cm Units"}]}]},{control:"container",extraClasses:["col-xs-6"],items:[{control:"radio",name:"cg-radio-po",label:"Circumference / Girth Vital Unavailable or Refused Radio",srOnlyLabel:!0,extraClasses:["top-margin-md"],options:[{value:"Unavailable",label:"Unavailable"},{value:"Refused",label:"Refused"}]}]}]},P={control:"container",items:[{control:"select",name:"cg-site-po",label:"Site",title:"To select an option, use the up and down arrow keys then press enter to select",extraClasses:["col-xs-6"],pickList:[]},{control:"select",label:"Location",name:"cg-location-po",title:"To select an option, use the up and down arrow keys then press enter to select",extraClasses:["col-xs-6"],pickList:[]}]},T={control:"collapsibleContainer",name:"cgSection",headerItems:[M],collapseItems:[P]},L=[{control:"container",extraClasses:["modal-body"],items:[{control:"container",extraClasses:["scroll-enter-form"],items:[r,c,m,g,v,I,V,U,R,T]}]},{control:"container",extraClasses:["modal-footer"],items:[{control:"container",extraClasses:["row"],items:[{control:"container",extraClasses:["col-xs-6"],template:o.compile('<p aria-hidden="true">(* indicates a required field.)</p>{{#if savedTime}}<p><span id="vitals-saved-at">Saved at: {{savedTime}}</span></p>{{/if}}'),modelListeners:["savedTime"]},{control:"container",extraClasses:["col-xs-6"],items:[{control:"button",id:"form-cancel-btn",extraClasses:["btn-primary","btn-sm","left-margin-xs"],type:"button",label:"Cancel",title:"Press enter to cancel"},{control:"button",extraClasses:["btn-primary","btn-sm","left-margin-xs"],label:"Add",type:"button",id:"form-add-btn",title:"Press enter to add"}]}]}]}],S=e.Model.extend({defaults:{facilityName:"D.C. VA Hospital",dateTakenInput:moment().format("MM/DD/YYYY"),"time-taken":"",errorModel:new e.Model},validate:function(e,t){return i.validateModel(this)}}),F=new ADK.UI.Notification({title:"Vitals Submitted",icon:"fa-check",message:"Vitals successfully submitted with no errors."}),H=e.Marionette.ItemView.extend({template:o.compile("You will lose your progress if you cancel..  Would you like to proceed with ending this observation?"),tagName:"p"}),K=e.Marionette.ItemView.extend({template:o.compile('{{ui-button "Cancel" classes="btn-default" title="Click button to cancel your action!"}}{{ui-button "Continue" classes="btn-primary" title="Click button to continue your action!"}}'),events:{"click .btn-primary":function(){ADK.UI.Alert.hide(),ADK.UI.Workflow.hide()},"click .btn-default":function(){ADK.UI.Alert.hide()}},tagName:"span"}),O=e.Marionette.ItemView.extend({template:o.compile("We're sorry. "+this.msg),msg:"There was an error submitting your form.",tagName:"p"}),q=e.Marionette.ItemView.extend({template:o.compile('{{ui-button "Ok" classes="btn-primary" title="Click button to close modal"}}'),events:{"click .btn-primary":function(){ADK.UI.Alert.hide(),this.form&&this.form.$(this.form.ui.submitButton.selector).trigger("control:disabled",!1)}},tagName:"span"}),N=e.Marionette.ItemView.extend({template:o.compile('{{ui-button "Cancel" classes="btn-default" title="Click button to cancel your action!"}}{{ui-button "Submit" classes="btn-primary" title="Click button to save vitals!"}}'),events:{"click .btn-primary":function(){var e=this;ADK.UI.Alert.hide(),l.addVitals(this.form.model,this.form.isPassSelected(),this.form.model.get("vitalsIENMap"),function(){F.show(),ADK.UI.Workflow.hide(),setTimeout(function(){ADK.ResourceService.clearAllCache("vital");var e=ADK.Messaging.getChannel("vitals");e.request("refreshGridView")},2e3)},function(){var t=new ADK.UI.Alert({title:"System 500 Error",icon:"fa-exclamation-triangle",messageView:O,footerView:q.extend({form:e.form})});t.show()})},"click .btn-default":function(){this.form.$(this.form.ui.submitButton.selector).trigger("control:disabled",!1),ADK.UI.Alert.hide()}},tagName:"span"}),E=e.Marionette.ItemView.extend({template:o.compile("No data entered for patient "+ADK.PatientRecordService.getCurrentPatient().get("displayName")+". Close the window?"),tagName:"p"}),B=e.Marionette.ItemView.extend({template:o.compile('{{ui-button "No" classes="btn-default" title="Click button to cancel your action"}}{{ui-button "Yes" classes="btn-primary" title="Click button to save vitals"}}'),events:{"click .btn-primary":function(){ADK.UI.Alert.hide(),ADK.UI.Workflow.hide()},"click .btn-default":function(){ADK.UI.Alert.hide()}},tagName:"span"}),W=ADK.UI.Form.extend({initialize:function(){this._super=ADK.UI.Form.prototype,this.model=new S,this._super.initialize.apply(this,arguments),n=!1,s=!0},ui:{submitButton:"#form-add-btn",bpInput:".bpInput",tempLocation:".temperature-location-po",heightQuality:".height-quality-po",bpFields:".bp-location-po, .bp-method-po, .bp-cuff-size-po, .bp-position-po",pulseFields:".pulse-location-po, .pulse-method-po, .pulse-position-po, .pulse-site-po",respirationFields:".respiration-method-po, .respiration-position-po",poFields:".suppO2InputValue, .po-method-po",weightFields:".weight-quality-po, .weight-method-po",cgFields:".cg-site-po, .cg-location-po",ExpandCollapseAllButton:".expandCollapseAll button",ExpandCollapseAllControl:".expandCollapseAll",PassButton:".facility-name-pass-po button",AllCollapsibleContainers:".bpSection, .temperatureSection, .pulseSection, .respirationSection, .poSection, .heightSection, .weightSection, .cgSection"},fields:L,getNextVitalInput:function(e){var t=this.$(".vitalInput input:not(:radio)"),a=_.lastIndexOf(t,e);return t[a+1]},isPassSelected:function(){return this.$(this.ui.PassButton.selector).hasClass("active")},allFields:["bpInputValue","bp-radio-po","bp-location-po","bp-method-po","bp-cuff-size-po","bp-position-po","pulse-method-po","pulse-position-po","pulse-site-po","pulse-location-po","pulseInputValue","pulse-radio-po","respirationInputValue","respiration-radio-po","respiration-method-po","respiration-position-po","temperatureInputValue","temperature-radio-po","temperature-location-po","O2InputValue","po-radio-po","suppO2InputValue","po-method-po","heightInputValue","height-radio-po","height-quality-po","weightInputValue","weight-radio-po","weight-method-po","weight-quality-po","pain-value-po","pain-checkbox-po","pain-radio-po","circumValue","cg-radio-po","cg-site-po","cg-location-po"],onRender:function(){l.retrievePickLists(this,function(){var e=new ADK.UI.Alert({title:"Failed to load picklist data.",icon:"fa-exclamation-triangle",messageView:O.extend({msg:"There was an error loading the form."}),footerView:q});e.show()}),this._super.onRender.apply(this,arguments)},events:{"input #bpInputValue":function(e){this.inputDisableHandler(e.target.value,"bloodPressure")},"input #temperatureInputValue":function(e){this.inputDisableHandler(e.target.value,"temperature")},"input #pulseInputValue":function(e){this.inputDisableHandler(e.target.value,"pulse")},"input #respirationInputValue":function(e){this.inputDisableHandler(e.target.value,"respiration")},"input #O2InputValue":function(e){this.inputDisableHandler(e.target.value,"pulseOximetry")},"input #heightInputValue":function(e){this.inputDisableHandler(e.target.value,"height")},"input #weightInputValue":function(e){this.inputDisableHandler(e.target.value,"weight")},"input #pain-value-po":function(e){var t=e.target.value;t?(this.model.unset("pain-radio-po"),a(".pain-radio-po").trigger("control:disabled",!0),this.model.unset("pain-checkbox-po")):this.model.get("pain-checkbox-po")||a(".pain-radio-po").trigger("control:disabled",!1)},"input #circumValue":function(e){this.inputDisableHandler(e.target.value,"circumferenceGirth")},"click @ui.PassButton":function(e){e.preventDefault(),this.ui.PassButton.toggleClass("active"),this.allFields.forEach(function(e){this.model.get(e)&&this.model.unset(e),a("."+e+":disabled").length<1&&a("."+e).trigger("control:disabled",s)},this),s=!s},"keyup .vitalInput:not(:last) input:not(:radio):focus":function(e){13==e.which&&this.getNextVitalInput(e.currentTarget)&&this.getNextVitalInput(e.currentTarget).focus()},"click @ui.ExpandCollapseAllButton":function(e){e.preventDefault(),this.ui.AllCollapsibleContainers.trigger("control:collapsed",n),n?this.ui.ExpandCollapseAllControl.trigger("control:label","Expand All").trigger("control:title","Press enter to expand all vitals"):this.ui.ExpandCollapseAllControl.trigger("control:label","Collapse All").trigger("control:title","Press enter to collapse all vitals"),this.ui.ExpandCollapseAllControl.find("button").focus(),n=!n},"click #form-cancel-btn":function(e){e.preventDefault();var t=new ADK.UI.Alert({title:"Are you sure you want to cancel?",icon:"fa-exclamation-triangle",messageView:H,footerView:K});t.show()},"click #form-add-btn":function(t){var a=this;if(t.preventDefault(),i.areAllDataFieldsEmpty(a.model,a.isPassSelected())){var n=new ADK.UI.Alert({title:"No Data Entered",icon:"fa-exclamation-triangle",messageView:E,footerView:B});return void n.show()}return this.model.isValid()?(this.model.unset("formStatus"),this.$(this.ui.submitButton.selector).trigger("control:disabled",!0),i.validateHistorical(this.model,function(t,i){if(t){var n=e.Marionette.ItemView.extend({template:o.compile(i),tagName:"p"}),s=new ADK.UI.Alert({title:"Height/Weight Warnings Exist",icon:"fa-exclamation-triangle",messageView:n,footerView:N.extend({form:a})});s.show()}else l.addVitals(a.model,a.isPassSelected(),a.model.get("vitalsIENMap"),function(){F.show(),ADK.UI.Workflow.hide(),setTimeout(function(){ADK.ResourceService.clearAllCache("vital");var e=ADK.Messaging.getChannel("vitals");e.request("refreshGridView")},2e3)},function(){var e=new ADK.UI.Alert({title:"System 500 Error",icon:"fa-exclamation-triangle",messageView:O,footerView:q.extend({form:a})});e.show()})})):this.model.set("formStatus",{status:"error",message:a.model.validationError}),!1}},vitalsMapping:{bloodPressure:{radio:"bp-radio-po",fields:"bpFields",qualifierModelFields:["bp-location-po","bp-method-po","bp-cuff-size-po","bp-position-po"]},temperature:{radio:"temperature-radio-po",fields:"tempLocation",qualifierModelFields:["temperature-location-po"]},pulse:{radio:"pulse-radio-po",fields:"pulseFields",qualifierModelFields:["pulse-location-po","pulse-method-po","pulse-position-po","pulse-site-po"]},respiration:{radio:"respiration-radio-po",fields:"respirationFields",qualifierModelFields:["respiration-method-po","respiration-position-po"]},pulseOximetry:{radio:"po-radio-po",fields:"poFields",qualifierModelFields:["suppO2InputValue","po-method-po"]},height:{radio:"height-radio-po",fields:"heightQuality",qualifierModelFields:["height-quality-po"]},weight:{radio:"weight-radio-po",fields:"weightFields",qualifierModelFields:["weight-quality-po","weight-method-po"]},circumferenceGirth:{input:"cg-value-po",radio:"cg-radio-po",fields:"cgFields",qualifierModelFields:["cg-site-po","cg-location-po"]}},inputDisableHandler:function(e,t){e?(this.ui[this.vitalsMapping[t].fields].trigger("control:disabled",!1),this.model.unset(this.vitalsMapping[t].radio),a("."+this.vitalsMapping[t].radio).trigger("control:disabled",!0)):a("."+this.vitalsMapping[t].radio).trigger("control:disabled",!1)},radioDisableHandler:function(e){var t=this,a=this.model.get(this.vitalsMapping[e].radio);a&&(this.ui[this.vitalsMapping[e].fields].trigger("control:disabled",!0),_.each(this.vitalsMapping[e].qualifierModelFields,function(e){t.model.unset(e)}))},modelEvents:{"change:bp-radio-po":function(){this.radioDisableHandler("bloodPressure")},"change:temperature-radio-po":function(){this.radioDisableHandler("temperature")},"change:pulse-radio-po":function(){this.radioDisableHandler("pulse")},"change:respiration-radio-po":function(){this.radioDisableHandler("respiration")},"change:po-radio-po":function(){this.radioDisableHandler("pulseOximetry")},"change:height-radio-po":function(){this.radioDisableHandler("height")},"change:weight-radio-po":function(){this.radioDisableHandler("weight")},"change:pain-checkbox-po":function(){var e=this.model.get("pain-checkbox-po");e?(this.model.unset("pain-radio-po"),a(".pain-radio-po").trigger("control:disabled",!0),this.model.unset("pain-value-po")):this.model.get("pain-value-po")||a(".pain-radio-po").trigger("control:disabled",!1)},"change:pain-radio-po":function(){var e=this.model.get("pain-radio-po");e&&(a(".pain-radio-po").trigger("control:disabled",!1),this.model.unset("pain-value-po"),this.model.unset("pain-checkbox-po"))},"change:cg-radio-po":function(){this.radioDisableHandler("circumferenceGirth")}}});return W});