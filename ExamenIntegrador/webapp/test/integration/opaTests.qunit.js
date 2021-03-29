/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"ExamenIntegrador/ExamenIntegrador/test/integration/AllJourneys"
	], function () {
		QUnit.start();
	});
});
