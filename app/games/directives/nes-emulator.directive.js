app.directive('nesEmulator', ['$location','$rootScope',
	function($location,$rootScope) {

		var controller = function($scope,$element) {

			// init nes emulator
			$scope.initNesEmulator = function(item){
				$scope.item = item;
				// init jsnes
		        var nes = new JSNES({
		            'ui': $('#emulator').JSNESUI({
		                "Working": [ ]
		            })
		        });

		        $rootScope.nes = nes;
				// nes file
				var nesFile;
				if ($scope.mode === 'create'){
					nesFile = item.file;
				} else {
					nesFile = $scope.item.path;
				}

				// load nes
				nes.ui.romSelect.children().remove();           
				$('<option>'+nesFile+'</option>').attr("value", nesFile).appendTo(nes.ui.romSelect);                                						 
				nes.ui.romSelect.val(nesFile);						
				nes.ui.loadROM();
			};


		};

		var template = 	'<center >' +
						    '<div id="emulator"></div>' +
						    '<div id="emcontrols" style="display: none">' +
							    '<h2>Controls</h2>' +
							    '<table id="controls">' +
							        '<tr>' +
							            '<th>Button</th>' +
							            '<th>Player 1</th>' +
							            '<th>Player 2</th>' +
							        '</tr>' +
							        '<tr>' +
							            '<td>Left</td>' +
							            '<td>Left</td>' +
							            '<td>Num-4</td>' +
							        '</tr>' +
							        '<tr>' +
							            '<td>Right</td>' +
							            '<td>Right</td>' +
							            '<td>Num-6</td>' +
							        '</tr>' +
							        '<tr>' +
							            '<td>Up</td>' +
							            '<td>Up</td>' +
							            '<td>Num-8</td>' +
							        '</tr>' +
							        '<tr>' +
							            '<td>Down</td>' +
							            '<td>Down</td>' +
							            '<td>Num-2</td>' +
							        '</tr>' +
							        '<tr>' +
							            '<td>A</td>' +
							            '<td>X</td>' +
							            '<td>Num-7</td>' +
							        '</tr>' +
							        '<tr>' +
							            '<td>B</td>' +
							            '<td>Z/Y</td>' +
							            '<td>Num-9</td>' +
							        '</tr>' +
							        '<tr>' +
							            '<td>Start</td>' +
							            '<td>Enter</td>' +
							            '<td>Num-1</td>' +
							        '</tr>' +
							        '<tr>' +
							            '<td>Select</td>' +
							            '<td>Ctrl</td>' +
							            '<td>Num-3</td>' +
							        '</tr>' +
							    '</table>' +
						    '</div>' +
							'<script src="assets/lib/games/nes/lib/dynamicaudio-min.js" type="text/javascript" charset="utf-8"></script>' +
							'<script src="assets/lib/games/nes/nes.js" type="text/javascript" charset="utf-8"></script>' +
							'<script src="assets/lib/games/nes/utils.js" type="text/javascript" charset="utf-8"></script>' +
							'<script src="assets/lib/games/nes/cpu.js" type="text/javascript" charset="utf-8"></script>' +
							'<script src="assets/lib/games/nes/keyboard.js" type="text/javascript" charset="utf-8"></script>' +
							'<script src="assets/lib/games/nes/mappers.js" type="text/javascript" charset="utf-8"></script>' +
							'<script src="assets/lib/games/nes/papu.js" type="text/javascript" charset="utf-8"></script>' +
							'<script src="assets/lib/games/nes/ppu.js" type="text/javascript" charset="utf-8"></script>' +
							'<script src="assets/lib/games/nes/rom.js" type="text/javascript" charset="utf-8"></script>' +
							'<script src="assets/lib/games/nes/ui.js" type="text/javascript" charset="utf-8"></script>' +						    
						'</center>';

		return {
			restrict: 'AE',
			replace:true,
			controller: controller,
			template:template
		}

	}
]);