var AUTO_CAPTURE = {
	CONF: {
		DEST: './image',
		WAIT_TIME: 1000
	},
	DEVICE: {
		PC: {
			folder: '/pc',
			ua: 'Mozilla/5.0 (iPhone; CPU iPhone OS 8_0_2 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) Version/8.0 Mobile/12A405 Safari/600.1.4',
			width: 1280,
			height: 900
		},
		SP: {
			folder: '/sp',
			ua: 'Mozilla/5.0 (iPhone; CPU iPhone OS 8_0_2 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) Version/8.0 Mobile/12A405 Safari/600.1.4',
			width: 320,
			height: 568
		},
		TABLET: {
			folder: '/tablet',
			ua: 'Mozilla/5.0 (iPad; CPU OS 8_0_2 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) Version/8.0 Mobile/12A405 Safari/600.1.4',
			width: 768,
			height: 1024
		}
	},
	init: function () {
		this.setParameters();
		this.run();
	},
	setParameters: function () {
		this.casper = require('casper').create({
			clientScripts: ['./lib/jquery-1.12.2.min.js']
		});
		this.links = require('./input/capture-list.json');
		this.captureTarget = this.links.captureTarget;
		this.basicId = this.casper.cli.options.id;
		this.basicPass = this.casper.cli.options.pass;
		this.deviceType;

		var args = String( this.casper.cli.args );
		switch( args ) {
			case 'pc':
				this.deviceType = this.DEVICE.PC;
				break;
			case 'sp':
				this.deviceType = this.DEVICE.SP;
				break;
			case 'tablet':
				this.deviceType = this.DEVICE.TABLET;
				break;
			default:
				this.deviceType = this.DEVICE.PC;
				break;
		}
	},
	run: function () {
		var _this = this;
		this.casper.start();
		this.casper.userAgent( this.deviceType.ua );
		this.casper.viewport( this.deviceType.width, this.deviceType.height );

		if( this.basicId && this.basicPass ) {
			this.casper.setHttpAuth( this.basicId, this.basicPass );
		}

		this.casper.each(
			this.captureTarget,
			function ( casper, link ) {
				var url = link.url;
				var file = link.file;
				casper.thenOpen( url, function ( response ) {
					casper.evaluate( function () {
						$('body').css('background-color', '#FFF');
					});
					var statusCode = response.status;
					if( statusCode === 200 ) {
						this.echo('GET: capture page title is "' + this.getTitle() + '".');
					}else {
						this.echo('ERROR: couldn\'t capture of "' + url + '".' );
					}
				});
				casper.wait( _this.CONF.WAIT_TIME, function () {
					casper.capture( _this.CONF.DEST + _this.deviceType.folder + '/' + file );
				});
			}
		);
		this.casper.run();
	}
};
AUTO_CAPTURE.init();

