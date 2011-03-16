<?
error_reporting( E_ALL ^ E_NOTICE );

function make_request($url)
{
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

include_once( 'epitwitter/EpiCurl.php' );
include_once( 'epitwitter/EpiOAuth.php' );
include_once( 'epitwitter/EpiTwitter.php' );

define( 'TWITTER_CONSUMER_KEY', 		'6CbUi0yUqZzJ3FvqeXG2mA' );
define( 'TWITTER_CONSUMER_SECRET', 		'laRgTcpOkAkf0LNQpziinHkEPkrLL9LsZQ7NQguybc' );

$c		= $_COOKIE[ 'twitfavs' ];

if ( $c )
{
	$c	= unserialize( $c );
}

$api	= new EpiTwitter( TWITTER_CONSUMER_KEY, TWITTER_CONSUMER_SECRET, $c[ 'token' ], $c[ 'secret' ] );

switch ( $_GET[ 'method' ] )
{
	case 'oauth_callback':
		$api->setToken( $_GET[ 'oauth_token' ] );
		
		$t	= $api->getAccessToken( array( 'oauth_verifier' => $_GET[ 'oauth_verifier' ] ) );
		
		$c	= serialize( array( 'token' => $t->oauth_token, 'secret' => $t->oauth_token_secret ) );
		
		setcookie( 'twitfavs', $c, time() + 31556926 );
		
		header( 'Location: /' );
		
		exit();
		
	break;
	
	case 'check_auth':
		$r	= make_request( '/account/verify_credentials.json' );
		
	break;
	
	case 'get_favs':
		$r	= make_request( '/favorites.json' );
		
	break;
	
	case 'get_oauth_key':
		$r	= $api->getAuthorizeUrl();
	
	break;
}

header( 'content-type: application/json' );

echo json_encode( $r );