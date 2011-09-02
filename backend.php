<?
error_reporting( E_ALL ^ E_NOTICE );

function make_request($url)
{
	global $api;
	
	try
	{
		$r	= $api->get( $url );
		
		$r	= $r->response;
	} 
	catch ( EpiTwitterException $e )
	{
		$r	= false;
	}
	
	return $r;
}

include_once( 'twitteroauth/twitteroauth/twitteroauth.php' );

include_once( 'config.php' );

/*

The config file contains this:

define( 'TWITTER_CONSUMER_KEY', 		'your key' );
define( 'TWITTER_CONSUMER_SECRET', 		'your secret' );

*/

define( 'COOKIE_NAME',	'twitfavs' );
define( 'COOKIE_TIME',	time() + 31556926 );

$c		= $_COOKIE[ COOKIE_NAME ];

if ( $c )
{
	$c	= unserialize( stripslashes( $c ) );
	
	$t	= $c[ 'token' ];
	$s	= $c[ 'secret' ];
	$u	= $c[ 'user' ];
}

if ( $_GET[ 'oauth_token' ] )
{
	$t	= $_GET[ 'oauth_token' ];
}

$api	= new TwitterOAuth( TWITTER_CONSUMER_KEY, TWITTER_CONSUMER_SECRET, $t, $s );

switch ( $_GET[ 'method' ] )
{
	case 'oauth_callback':
		$t	= $api->getAccessToken();
		
		$c	= serialize( array( 'token' => $t[ 'oauth_token' ], 'secret' => $t[ 'oauth_token_secret' ], 'user' => $t[ 'screen_name' ] ) );
		
		setcookie( COOKIE_NAME, $c, COOKIE_TIME );
		
		$r	= true;
		
	break;
	
	case 'check_auth':
		$r	= $api->get( 'account/verify_credentials' );
		
		if ( isset( $r->error ) )
		{
			setcookie( COOKIE_NAME, '', time() - 3600 );
		}
		
	break;
	
	case 'get_favs':
		$r	= $api->get( 'favorites', array( 'id' => $u, 'page' => $_GET[ 'page' ] ) );
		
	break;
	
	case 'get_oauth_key':
		$r	= $api->getRequestToken();
		
		$c	= serialize( array( 'token' => $r[ 'oauth_token' ], 'secret' => $r[ 'oauth_token_secret' ] ) );
		
		setcookie( COOKIE_NAME, $c, COOKIE_TIME );
	
	break;
}

header( 'content-type: application/json' );

echo json_encode( $r );