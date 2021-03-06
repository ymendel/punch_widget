// This file was generated by Dashcode from Apple Inc.
// You may edit this file to customize your Dashboard widget.

var punch_command;
var project;
var status;

//
// Function: load()
// Called by HTML body element's onload event when the widget is ready to start
//
function load()
{
    setupParts();
	getPunchCommand();
	getProjectValue();
	
	if (project) {
		updateProjectDisplay();
	} else {
		showBack();
	}
}

function getPunchCommand() {
	punch_command = widget.system('/usr/bin/which punch', null).outputString.replace(/\n$/, '')
}

//
// Function: remove()
// Called when the widget has been removed from the Dashboard
//
function remove()
{
    // Stop any timers to prevent CPU usage
    // Remove any preferences as needed
	setProjectValue(null);
}

//
// Function: hide()
// Called when the widget has been hidden
//
function hide()
{
    // Stop any timers to prevent CPU usage
}

//
// Function: show()
// Called when the widget has been shown
//
function show()
{
    // Restart any timers that were stopped on hide
	if (project) {
		updateProjectDisplay();
	}
}

//
// Function: sync()
// Called when the widget has been synchronized with .Mac
//
function sync()
{
    // Retrieve any preference values that you need to be synchronized here
    // Use this for an instance key's value:
    // instancePreferenceValue = widget.preferenceForKey(null, createInstancePreferenceKey("your-key"));
    //
    // Or this for global key's value:
    // globalPreferenceValue = widget.preferenceForKey(null, "your-key");
}

//
// Function: showBack(event)
// Called when the info button is clicked to show the back of the widget
//
// event: onClick event from the info button
//
function showBack(event)
{
    var front = document.getElementById("front");
    var back = document.getElementById("back");

    if (window.widget) {
        widget.prepareForTransition("ToBack");
    }

    front.style.display = "none";
    back.style.display = "block";

    if (window.widget) {
        setTimeout('widget.performTransition();', 0);
    }
}

//
// Function: showFront(event)
// Called when the done button is clicked from the back of the widget
//
// event: onClick event from the done button
//
function showFront(event)
{
	if (!setProject()) {
		return false;
	}
	updateProjectDisplay();
	
    var front = document.getElementById("front");
    var back = document.getElementById("back");

    if (window.widget) {
        widget.prepareForTransition("ToFront");
    }

    front.style.display="block";
    back.style.display="none";

    if (window.widget) {
        setTimeout('widget.performTransition();', 0);
    }
}

if (window.widget) {
    widget.onremove = remove;
    widget.onhide = hide;
    widget.onshow = show;
    widget.onsync = sync;
}

function projectNameSubmit(event) {
	var character = String.fromCharCode(event.which);
	if ((character == '\r') || (character == '\n')) {
		showFront(event);
	}
	return true;
}

function setProject() {
	var element = document.getElementById('project_name_input');
	val = element.value;
	
	val = val.replace(/^\s+/, '');
	val = val.replace(/\s+$/, '');
	
	if ((val == '') || (val.match(/\s/))) {
		projectNameError(element);
		return false;
	}
	else {
		clearProjectNameError(element);
		element.value = val;
		setProjectValue(element.value);
	}
	return true;
}

function setProjectValue(value) {
	project = value;
	widget.setPreferenceForKey(value, createInstancePreferenceKey('project'));
}

function getProjectValue() {
	project = widget.preferenceForKey(createInstancePreferenceKey('project'));
}

function projectNameError(element) {
	element.style.background = 'red';
	element.style.color      = 'white';
}

function clearProjectNameError(element) {
	element.style.background = 'white';
	element.style.color      = 'black';
}

function updateProjectNameDisplay() {
	var element = document.getElementById('project_name_display');
	element.innerText = project;
}

function updateProjectStatusDisplay() {
	updateProjectStatus();
	updateProjectStatusIndicatorDisplay();
	updatePunchButton();
}

function updateProjectStatusIndicatorDisplay() {
	var element = document.getElementById('project_status_indicator');
	element.object.setValue(indicatorValueFromStatus());
}

function updatePunchButton() {
	var element = document.getElementById('punch_button');
	element.object.textElement.innerText = buttonValueFromStatus();
}

function updateProjectStatus() {
	status = getProjectStatus();
}

function getProjectStatus() {
	var outputString = widget.system(punch_command + ' status ' + project, null).outputString;
	var lines = outputString.split(/\n/);
	var statusLine = lines[2] || '';
	var match = statusLine.match(/^\s+(\w+):/);
	
	if (match) {
		return match[1];
	} else {
		match = lines[0].match(/"(\w+)"/);
		if (match) {
			return match[1];
		} else {
			return 'error';
		}
	}
}

function indicatorValueFromStatus() {
	var value;
	
	switch (status) {
	case 'error':
		value = 0;
		break;
	case 'in':
		value = '1';
		break;
	case 'out':
		value = '3';
		break;
	default:
		value = 0;
	}
	
	return value;
}

function actionFromStatus() {
	var action;
	
	switch (status) {
	case 'error':
		action = 'in';
		break;
	case 'in':
		action = 'out';
		break;
	case 'out':
		action = 'in';
		break;
	default:
		action = 'in';
	}
	
	return action;
}

function buttonValueFromStatus() {
	return 'punch ' + actionFromStatus();
}

function buttonAction(event) {
	widget.system(punch_command + ' ' + actionFromStatus() + ' ' + project, null);
	updateProjectStatusDisplay();
}


function addWidget(event) {
    widget.system('open ~/Library/Widgets/Punch.wdgt', null);
}


function enterWidget(event) {
    var add_button = document.getElementById('add_button');
	add_button.style.visibility = 'visible';
}


function leaveWidget(event) {
    var add_button = document.getElementById('add_button');
	add_button.style.visibility = 'hidden';
}

function updateProjectDisplay() {
	updateProjectNameDisplay();
	updateProjectStatusDisplay();
}
