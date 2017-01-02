app.directive('fileBrowser', ['$mdMedia','$mdDialog',
	function($mdMedia,$mdDialog) {

		// site header controller
		var controller = function($scope,$element) {
			
			// generate site directory tree
			$scope.generateSiteTree = function() {
				
				var directories = {};
				$scope.directories = [];

				$.each($scope.contentJson,function(key,val){
					// optional files
					if(key=='files_optional') {
						$.each( val, function( key2, val2 ) {
							// every file in uploads
						    if (key2.match('^uploads/')) {
						    	var directory = key2.split('/')[1];
						    	var file = key2.split('/')[2];
						    	if (!directories[directory]){
									directories[directory] = {
										name:directory,
										files:[]
									}
						    	}
						    	if (directory !== 'posters'){
						    		if($scope.chJson[directory])
						    		{
								    	$scope.chJson[directory].forEach(function(item,index){
								    		if (key2 === item.path){
										    	directories[directory].files.push(item);
								    		}
								    	});
							    	}
						    	} else {
									directories[directory].files.push(file);						    		
						    	}
						    }
						});
					}
				});
				
				$.each(directories,function(key,val){
					$scope.directories.push(val);
				});

			};

			// create new directory
			$scope.newDirectory = function(){
				
			};
			
			// show directory content
			$scope.showDirectoryContent = function(directory){
				
				$scope.directory = directory;
				
			};

			// go back
			$scope.goBack = function(){
				delete $scope.directory;
			};

			// render list item
			$scope.renderListItem = function(item){

				if (typeof item === 'object'){

					// is item
					item.is_item = true;

					// list item icon by media type
					if (item.media_type === 'game'){
						item.file_icon = 'file';
					} else if (item.media_type === 'video'){
						item.file_icon = 'film'
					}
	
					// item file attributes by file type
					if (item.file_type === 'zip'){
						item.size = item.zip_size;
						item.name = item.zip_name;
					} else {
						item.size = item.file_size;
						item.name = item.file_name;
					}

					// item edit url
					var item_id_field = item.media_type + '_id';
					item.editUrl = '/'+$scope.site_address+'/edit.html?item='+item[item_id_field]+'type='+item.media_type;

				}

			};

			// publish item
			$scope.togglePublish = function(item){
				if (item.published === false || !item.published){
					item.published = true;
				} else {
					item.published = false;
				}
				$scope.updateChannelJson();
			};

			// multiple upload dialog
			$scope.multipleUploadDialog = function(ev){
				$scope.status = '';
				$scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
			    var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
			    var dialogTemplate = '<md-dialog aria-label="Multiple File Upload">' +
									    '<md-toolbar>' +
									    	'<div class="md-toolbar-tools">' +
										        '<h2>Upload Files</h2>' +
									    	'</div>' +
									    '</md-toolbar>' +
									    '<md-dialog-content layout-padding>' +
											'<multiple-files-upload ng-init="init(items.chJson)"></multiple-files-upload>'
									    '</md-dialog-content>' +
									'</md-dialog>';

			    $mdDialog.show({
					controller: DialogController,
					template: dialogTemplate,
					parent: angular.element(document.body),
					targetEvent: ev,
					clickOutsideToClose:true,
					fullscreen: useFullScreen,
					locals: {
						items: {
							chJson:$scope.chJson
						}
					}
			    });

			};
		};

		// dialog controller
		var DialogController = function($scope, $mdDialog,$rootScope,items) {

			// items
			$scope.items = items;

			$scope.hide = function() {
				$mdDialog.hide();
			};
			
			$scope.cancel = function() {
				$mdDialog.cancel();
			};
			
			$scope.answer = function(answer) {
				$mdDialog.hide(answer);
			};
			
			$scope.updateChannelJson = function(){
				$scope.hide();
				$rootScope.$broadcast('onUpdateChannel');
			};

		};		

		return {

			restrict: 'AE',
			replace:false,
			controller: controller
		}

	}
]);