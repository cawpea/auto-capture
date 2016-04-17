var AUTO_CAPTUER = {};
var fs = require('fs');
var path = require('path');

AUTO_CAPTUER.MakeCaptureList = function () {
	this.init();
};
AUTO_CAPTUER.MakeCaptureList.prototype = {
	CONF: {
		ROOT_PATH: __dirname + '/../../..',
		INPUT_PATH: '/src/',
		INPUT_EXTENSION: '.html',
		DEST_NAME: __dirname + '/../input/capture-list.json',
		DEST_FORMAT: {
			'pc': '/pc/',
			'sp': '/sp/',
			'tablet': '/tablet/'
		}
	},
	init: function () {
		var _this = this;
		this.setParameters();

		var validateResult = this.validateInput();
		if( !validateResult.isValid ) {
			console.log( validateResult.message );
			return;
		}

		this.readAllFiles( this.readFilePath, function () {
			_this.parseCaptureList();
		});
	},
	setParameters: function () {
		this.readFilePath = process.argv[2] || this.CONF.ROOT_PATH + this.CONF.INPUT_PATH;
		this.prefix = process.argv[3] || this.CONF.ROOT_PATH;
		this.files = [];
	},
	validateInput: function () {
		var isValid = true;
		var message = '';
		if( !this.readFilePath ) {
			isValid = false;
			message = 'You have to input a path to read as first args.';
		}
		return {
			isValid: isValid,
			message: message
		};
	},
	readAllFiles: function ( dirPath, callback ) {
		var _this = this;

		if( this.dirQueue === undefined ) {
			this.dirQueue = [];
		}

		this.dirQueue.push( dirPath );

		fs.readdir( dirPath, function ( err, files ) {
			if( err ) throw err;

			_this.syncEach( files, function ( file, next ) {
				var pathname = dirPath + file;
				var s = fs.statSync( pathname );

				if( s.isDirectory() ) {
					_this.readAllFiles( pathname + '/', callback );
				}
				else if( s.isFile() ) {
					_this.files.push( pathname );
				}
				next();

			}, function () {
				var index = _this.dirQueue.indexOf( dirPath );
				if( index > -1 ) {
					_this.dirQueue.splice( index, 1 );
				}
				if( _this.dirQueue.length === 0 ) {
					_this.dirQueue = undefined;
					if( callback !== undefined && typeof callback === 'function' ) {
						callback();
					}
				}
			});
		});
	},
	parseCaptureList: function () {
		var _this = this;
		var relativePath = [];
		var pcPath = [];
		var spPath = [];

		this.syncEach( this.files,
			function ( value, next ) {
				var extname = path.extname( value );
				if( extname !== _this.CONF.INPUT_EXTENSION ) {
					next();
					return;
				}
				if( _this.prefix !== undefined ) {
					value = value.replace( _this.prefix, '' );
					relativePath.push( value );
				}
				next();
			},
			function () {
				_this.writeJsonFile( relativePath );

				var destPath = path.normalize( _this.CONF.DEST_NAME );
				console.log('INFO: make file "' + destPath + '".');
			}
		);
	},
	writeJsonFile: function ( pathList ) {
		var _this = this;
		var dataFormat = this.CONF.DEST_FORMAT;

		for( var key in this.CONF.DEST_FORMAT ) {
			var targetPath = dataFormat[key];
			var targetPathList = pathList.filter(function ( value ) {
				return value.indexOf( targetPath ) > -1;
			});

			dataFormat[key] = targetPathList;
		}
		var jsonData = {
			'captureTarget': [dataFormat]
		};
		fs.writeFile( this.CONF.DEST_NAME, JSON.stringify( jsonData, null, ' ' ) );
	},
	syncEach: function ( array, callback, complete ) {
		var len = array.length - 1;

		array.forEach( function ( value, index ) {
			callback( value, function () {
				if( len === index ) {
					complete();
				}
			});
		});
	}
};
new AUTO_CAPTUER.MakeCaptureList();