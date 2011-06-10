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

include_once( 'twitter-async/EpiCurl.php' );
include_once( 'twitter-async/EpiOAuth.php' );
include_once( 'twitter-async/EpiTwitter.php' );

include_once( 'config.php' );

/*

The config file contains this:

define( 'TWITTER_CONSUMER_KEY', 		'your key' );
define( 'TWITTER_CONSUMER_SECRET', 		'your secret' );

*/

define( 'COOKIE_NAME',	'twitfavs' );

$c		= $_COOKIE[ COOKIE_NAME ];

if ( $c )
{
	$c	= unserialize( stripslashes( $c ) );
	
	$t	= $c[ 'token' ];
	$s	= $c[ 'secret' ];
}

$api	= new EpiTwitter( TWITTER_CONSUMER_KEY, TWITTER_CONSUMER_SECRET, $t, $s );

switch ( $_GET[ 'method' ] )
{
	case 'oauth_callback':
		$api->setToken( $_GET[ 'oauth_token' ] );
		
		$t	= $api->getAccessToken( array( 'oauth_verifier' => $_GET[ 'oauth_verifier' ] ) );
		
		$c	= serialize( array( 'token' => $t->oauth_token, 'secret' => $t->oauth_token_secret ) );
		
		setcookie( COOKIE_NAME, $c, time() + 31556926 );
		
		$r	= true;
		
	break;
	
	case 'check_auth':
		$r	= make_request( '/account/verify_credentials.json' );
		
		if ( !$r )
		{
			setcookie( COOKIE_NAME, '', time() - 3600 );
		}
		
	break;
	
	case 'get_favs':
		$r	= make_request( '/favorites.json?page=' . $_GET[ 'page' ] );
		
	break;
	
	case 'get_oauth_key':
		$r	= $api->getAuthorizeUrl();
	
	break;
}

header( 'content-type: application/json' );

echo json_encode( $r );