var S = {
	tweetToLinks												: { },
	
	ready														: function()
	{
		S.detectBrowser();
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
				
				$.each( d, function()
				{
					var a	= t.clone();
					var l	= $( 'li', a ).remove();
					var id	= this.id;
					var lk	= this.user.screen_name + '/status/' + id;
					
					S.tweetToLinks[ id ]	= [ ];
					
					$( 'h3', a ).html( S.prepareLinks( this.text, id ) );
					
					if ( S.tweetToLinks[ id ].length > 0 )
					{
						$.each( S.tweetToLinks[ id ], function()
						{
							var li	= l.clone();

							$( 'a', li ).attr( 'href', this ).text( this.toString() );

							$( 'ul', a ).append( li );
						});
						
						if ( S.tweetToLinks[ id ].length == 1 )
						{
							$( '.controls', a ).remove();
						}
						else
						{
							$( '.controls', a ).click( function()
							{
								var c	= $( 'li a.selected', a ).removeClass( 'selected' );
								var t	= $( this ).hasClass( 'left' ) ? c.parent().prev().find( 'a' ) : c.parent().next().find( 'a' );
								
								$( 'li a', a ).removeClass( 'selected' );
								
								if ( t.length == 0 )
								{
									t	= $( this ).hasClass( 'left' ) ? $( 'li:last a', a ) : $( 'li:first a', a );
								}
								
								if ( t.length !== 1 )
								{
									return;
								}
								
								t.click();
							});
						}
						
						$( 'li a', a ).click( function(e)
						{
							$( 'li a', a ).removeClass( 'selected' );
							
							$( 'iframe', a ).removeClass( 'loaded' ).attr( 'src', $( this ).addClass( 'selected' ).attr( 'href' ) );
							
							return false;
						});
					}
					else
					{
						$( 'iframe, .controls', a ).remove();
					}
					
					$( 'iframe, .controls', a ).hide();
					
					$( 'iframe', a ).load( function()
					{
						$( this ).addClass( 'loaded' );
						
						$( window ).resize();
					});
					
					a.attr( 'id', id ).click( function()
					{
						var a	= $( this );
						
						$( 'iframe, .controls', $( 'article' ).not( a ) ).stop( true ).hide();
						
						$( 'html, body' ).stop( true ).animate({
							'scrollTop'	: a.offset().top
						}, 'normal', 'easeOutQuint', function()
						{
							//window.location.hash	= id;

							if ( S.tweetToLinks[ id ].length > 0 )
							{
								$( 'iframe:visible', $( 'article' ).not( a ) ).attr( 'src', '' );

								$( 'iframe, .controls', a ).stop( true ).slideDown( 'normal', function()
								{
									$( 'html, body' ).stop( true ).animate({
										'scrollTop'	: a.offset().top
									}, 'normal', 'easeOutQuint' );
									
									$( window ).resize();
									
									$( 'li:first a', a ).click();
								});
							}
							else
							{
								window.open( 'http://twitter.com/' + lk );
							}
						});
					});
					
					a.appendTo( '#favs' );
				});
				
				S.handleExternalLinks();
				
				//$( 'article[id=' + window.location.hash.replace( '#', '' ) + ']' ).click();
				
				$( window ).resize( S.resizeIframes );
			}
			else
			{
				window.location.reload();
			}
			
			S.hideLoader();
		});
	},
	
	resizeIframes												: function()
	{
		var i 	= $( 'iframe:visible' );
		
		if ( i.length > 0 )
		{
			var h	= $( window ).height() - i.position().top - ( parseInt( i.parents( 'article' ).eq( 0 ).css( 'padding-bottom' ) ) * 3 );

			if ( arguments[ 0 ] !== true )
			{
				i.height( h );
			}
			else
			{
				i.animate({
					'height'		: h + 'px'
				}, 'normal', 'easeOutQuint' );
			}
		}
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
		
		t	= t.replace( /\s(\@[^\s]+)\s?/gim, function(m)
		{
			m		= m.replace( /\s/gim, '' );
			
			var l	= 'http://twitter.com/' + m;
			
			//S.tweetToLinks[ i ].push( l );
			
			return ' <a href="' + l + '" class="external">' + m + '</a> ';
		});
		
		t	= t.replace( /\s(\#[^\s]+)\s?/gim, function(m)
		{
			m		= m.replace( /\s/gim, '' );
			
			var l	= 'http://twitter.com/search?q=' + m;
			
			//S.tweetToLinks[ i ].push( l );
			
			return ' <a href="' + l + '" class="external">' + m + '</a> ';
		});
		
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