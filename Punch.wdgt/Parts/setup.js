// This file was generated by Dashcode from Apple Inc.
// DO NOT EDIT - This file is maintained automatically by Dashcode.
function setupParts() {
    if (setupParts.called) return;
    setupParts.called = true;
    CreateInfoButton('info', { frontID: 'front', foregroundStyle: 'white', backgroundStyle: 'black', onclick: 'showBack' });
    CreateGlassButton('done', { text: 'Done', onclick: 'showFront' });
    CreateText('project_name_display', { text: 'project name' });
    CreateText('project_name_input_label', { text: 'Project Name:' });
    CreateIndicator('project_status_indicator', { onValue: 1, criticalValue: 3, warningValue: 2 });
    CreateButton('punch_button', { onclick: 'buttonAction', rightImageWidth: 10, leftImageWidth: 10 });
}
window.addEventListener('load', setupParts, false);
