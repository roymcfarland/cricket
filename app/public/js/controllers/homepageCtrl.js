var homepageCtrl = angular.module("homepageCtrl", []);

homepageCtrl.controller("homepageController", function() {

	// Variables
	var vm = this;
    // jQuery countdown
    $(function () {
		var gameDay = new Date(2015, 4 - 1, 16);
		$('#defaultCountdown').countdown({
			until: gameDay,
			padZeroes: true, 
			format: 'yDHMS', 
			layout: '<ul>{y<}<li>{yn} {yl}</li>{y>}' + 
				'{d<}<li>{dnn} {dl}</li>{d>}{h<}<li>{hnn} {hl}</li>{h>}' + 
				'{m<}<li>{mnn} {ml}</li>{m>}{s<}<li>{snn} {sl}</li>{s>}</ul>'
		});
	});

});