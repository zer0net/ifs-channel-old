app.directive('multipleFilesUpload', ['$location',
	function($location) {

		// image upload controller
		var controller = function($scope,$element) {

			$scope.init = function(chJson){
				$scope.chJson = chJson;				
				// items upload config

				$scope.itemsUploadConfig = {
				    'options': { // passed into the Dropzone constructor
				      'url': 'content.json',
				      'uploadMultiple':true
				    },
					'eventHandlers': {
						'sending': function (file, xhr, formData) {
							$scope.readFile(file,xhr,formData);
						}
					}
				};
			};

			// check if file existing
			$scope.ifFileExist = function(file){							
				var b = false;
				for (var i = 0, len = $scope.chJson.games.length; i < len; i++) {
				  if ($scope.chJson.games[i].file_name == file.name) {
				    b = true;
				    break;
				  }				 
				}
				return b;
			}

			// read files
			$scope.readFile = function(file,xhr,formData){
				
					file.state = 'pending';	
					// reader instance
					$scope.reader = new FileReader();
					// reader onload
					$scope.reader.onload = function(){
						// file data uri
						file.data = this.result;
						// files array
						if (!$scope.files) $scope.files = [];
						// push file to fiels array
						$scope.files.push(file);
						// apply to scope
						$scope.$apply();
					};
					// reader read file
					$scope.reader.readAsDataURL(file);
										
			};

			// upload files
			$scope.uploadFiles = function(){
				$scope.file_index = 0;
				$scope.uploadFile($scope.files[$scope.file_index]);
			};

			
			// upload single file
			$scope.uploadFile = function(file){
				console.log(file);
				if ($scope.ifFileExist(file)) {
					file.state = 'existing';
					$scope.uploadNextFile();
				} else {
					// file state
					file.state = 'uploading';
			    	// get items file type
					var splitByLastDot = function(text) {
					    var index = text.lastIndexOf('.');
					    return [text.slice(0, index), text.slice(index + 1)]
					}
					var file_type = splitByLastDot(file.name)[1];
					var file_name = file.name.split(' ').join('_').normalize('NFKD').replace(/[\u0300-\u036F]/g, '').replace(/ß/g,"ss").split('.' + file_type)[0].replace(/[^\w\s]/gi, '_') + '.' + file_type;

					// item obj
					var item = {
						"file_type":file_type,
						"channel": $location.$$absUrl.split('0/')[1].split('/')[0],
						"title": file.name.split('.'+file_type)[0],
						"date_added": +(new Date),
						"published":false
					};

					// render item
					var item_id_name;
					var item_file_name;
					if (file_type === 'zip') {
						item_id_name = 'game_id';
						item.zip_size = file.size;
						item_file_name = 'zip_name';														
						item.media_type = 'game';
						item.file_name=file_name;
						item.file_size=file.size;
						item.path = 'uploads/games/'+file_name;
					} else if (file_type === 'nes') {
						item_id_name = 'game_id';
						item_file_name = 'file_name';						
						item.file_size = file.size;
						item.media_type = 'game';
						item.path = 'uploads/games/'+file_name;
					} else {
						item_id_name = 'video_id';
						item_file_name = 'file_name';						
						item.media_type = 'video';
						item.file_size = file.size;
						item.path = 'uploads/videos/'+file_name;						
					}

					// item file name
					item[item_file_name] = file_name;
					// item id
					var next_item_id;
					if (!$scope.chJson){
						next_item_id = 1;
					} else {
						next_item_id = $scope.chJson.next_item_id;
					}
					item[item_id_name] = next_item_id;
					console.log(item);
					// write to file
					Page.cmd("fileWrite",[item.path, file.data.split('base64,')[1]], function(res) {
						$scope.$apply(function(){
							// file state
							file.state = 'done!';
							// item id update
							$scope.chJson.next_item_id += 1;
							// push item to channel json items
							var media_type = item.media_type + 's';
							if (!$scope.chJson[media_type]){$scope.chJson[media_type] = [];}
							$scope.chJson[media_type].push(item);
							// upload next file
							$scope.uploadNextFile();
						});
					});
				}
				
				

		    	
			};
			
			// upload next file
			$scope.uploadNextFile = function(){
				$scope.file_index += 1;
				if (($scope.file_index + 1) <= $scope.files.length){
					$scope.uploadFile($scope.files[$scope.file_index]);
				} else {
					$scope.updateChannelJson();
				}
			};
			
		};

		var template = '<md-content id="multiple-files-upload">' +
							'<button style="width:400px;height:100px;" dropzone="itemsUploadConfig" ng-hide="files" multiple>upload files</button>' +
							'<ul ng-show="files">'+
								'<li ng-repeat="file in files" layout="row">' +
									'<span flex="60" ng-bind="file.name"></span>' +
									'<span flex="20">{{file.size|filesize}}</span>' +
									'<span flex="20">{{file.state}}</span>' +
								'</li>' +
							'</ul>' +
	            			'<md-button flex="100" style="margin: 16px 0;" class="md-primary md-raised edgePadding pull-right" ng-click="uploadFiles()">' +
	            				'<label>Upload files</label>' +
	            			'</md-button>'
						'</md-content>';

		return {
			restrict: 'AE',
			replace:true,
			controller: controller,
			template:template
		}

	}
]);