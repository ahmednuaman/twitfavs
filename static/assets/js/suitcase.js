var S = {
	ready														: function()
	{
		S.checkAuth();
	},
	
	checkAuth													: function()
	{
		$.postJSON( { method: 'check_auth' }, function(d)
		{
			console.log( d );
			
			if ( d )
			{
				$( '#unauthed' ).remove();
			}
			else
			{
				$( '#authed' ).remove();
				
				$( '#unauthed button' ).click( S.prepareOAuthKey );
			}
			
			S.hideLoader();
		});
	},
	
	prepareOAuthKey												: function()
	{
		//S.displayLoader();
		
		$.postJSON( { method: 'get_oauth_key' }, function(d)
		{
			console.log(d);
			
			//window.location.href	= d;
		});
		
		return false;
	},
	
	detectBrowser												: function()
	{
		if ( $.browser.msie )
		{
			$( 'html' ).addClass( 'ie' );
			
			if ( $.browser.version == '9.0' )
			{
				$( 'html' ).addClass( 'ie9' );
			}
			else if ( $.browser.version == '8.0' )
			{
				$( 'html' ).addClass( 'ie8' );
			}
			else if ( $.browser.version == '7.0' )
			{
				$( 'html' ).addClass( 'ie7' );
			} 
			else
			{
				$( 'html' ).addClass( 'ie6' );
			}
		}

		if ( $.browser.webkit )
		{
			$( 'html' ).addClass( 'webkit' );
			
			if ( navigator.userAgent.indexOf( 'Chrome' ) === -1 )
			{
				$( 'html' ).addClass( 'safari' );
			}
			else
			{
				$( 'html' ).addClass( 'chrome' );
			}
		}

		if ( $.browser.mozilla )
		{
			$( 'html' ).addClass( 'ff' );

			if ( $.browser.version.substr( 0, 3 ) == '1.9' )
			{
				$( 'html' ).addClass( 'ff3' );
			}
			else
			{
				$( 'html' ).addClass( 'ff2' );
			}
		}
		
		if ( $.browser.opera )
		{
			$( 'html' ).addClass( 'opera' );
		}

		if ( navigator.userAgent.indexOf( 'Windows' ) != -1 )
		{
			$( 'html' ).addClass( 'windows' );
		}
		else if ( navigator.userAgent.indexOf( 'Mac' ) != -1 )
		{
			$( 'html' ).addClass( 'mac' );
		}
		
		var input	= document.createElement( 'input' );
		
		input.setAttribute( 'type', 'number' );
		
		if ( input.type == 'number' )
		{
			$( 'html' ).addClass( 'html5' );
		}
	},
	
	displayLoader												: function()
	{
		$( '#loader' ).stop( true ).fadeIn( 'normal', S.setTo100Opacity );
	},
	
	hideLoader													: function(p)
	{
		$( '#loader' ).stop( true ).fadeOut();
	}
};

$.postJSON = function(data, callback)
{
	$.post( '/ajax', data, callback, 'json' );
};

$( document ).ready( S.ready );