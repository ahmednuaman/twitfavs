var S = {
	tweetToLinks												: { },
	
	ready														: function()
	{
		S.checkAuth();
	},
	
	checkAuth													: function()
	{
		$.getJSON( '/backend.php', { method: 'check_auth' }, function(d)
		{
			if ( d )
			{
				$( '#unauthed' ).remove();
				
				$( '#username' ).text( d.screen_name );
				
				S.buildList();
			}
			else
			{
				$( '#authed' ).remove();
				
				$( '#unauthed button' ).click( S.prepareOAuthKey );
				
				S.hideLoader();
			}
		});
	},
	
	buildList													: function()
	{
		$.getJSON( '/backend.php', { method: 'get_favs' }, function(d)
		{
			if ( d )
			{
				var t	= $( '#favs article' ).remove();
				var a;
				var l;
				
				$.each( d, function()
				{
					a	= t.clone();
					l	= $( 'li', a ).remove();
					
					S.tweetToLinks[ this.id ]	= [ ];
					
					$( 'h3', a ).html( S.prepareLinks( this.text, this.id ) );
					
					$.each( S.tweetToLinks[ this.id ], function()
					{
						var li	= l.clone();
						
						$( 'a', li ).attr( 'href', this ).text( this.toString() );
						
						$( 'ul', a ).append( li ).hide();
					});
					
					a.appendTo( '#favs' );
				});
				
				S.handleExternalLinks();
			}
			else
			{
				window.location.reload();
			}
			
			S.hideLoader();
		});
	},
	
	prepareLinks												: function(t, i)
	{
		t	= t.replace( /&/gim, '&amp;' ).replace( /</gim, '&lt;' ).replace( />/gim, '&gt;' ).replace( /'/gim, '&quot;' ).replace( /'/gim, '&#039;' ); // stolen from: http://stackoverflow.com/questions/1787322/htmlspecialchars-equivalent-in-javascript
		
		t	= t.replace( /((https?:\/\/|www\.)[^\s]+)/gim, function(m)
		{
			var l	= ( m.indexOf( 'http' ) === -1 ? 'http://' : '' ) + m;
			
			S.tweetToLinks[ i ].push( l );
			
			return '<a href="' + l + '" class="external">' + m + '</a>';
		});
		
		t	= t.replace( /\s(\@[^\s]+)\s?/gim, ' <a href="http://twitter.com/$1" class="external">$1</a> ' );
		t	= t.replace( /\s(\#[^\s]+)\s?/gim, ' <a href="http://twitter.com/search?q=$1" class="external">$1</a> ' );
		
		return t;
	},
	
	handleExternalLinks											: function()
	{
		$( 'a.external' ).click( function()
		{
			window.open( $( this ).attr( 'href' ) );
			
			return false;
		});
	},
	
	prepareOAuthKey												: function()
	{
		S.displayLoader();
		
		$.getJSON( '/backend.php', { method: 'get_oauth_key' }, function(d)
		{
			window.location.href	= d;
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

$( document ).ready( S.ready );