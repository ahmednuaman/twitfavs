#!/usr/bin/env python

import sys

from datetime import datetime, timedelta
from hashlib import sha1
from hmac import new as hmac
from os.path import dirname, join as join_path
from random import getrandbits
from time import time
from urllib import urlencode, quote as urlquote
from uuid import uuid4

from django.utils import simplejson
from google.appengine.api import urlfetch
from google.appengine.ext import db
from google.appengine.ext import webapp
from google.appengine.ext.webapp import util

TWITTER_SETTINGS = {
  'urls' : {
    'base' : 'https://api.twitter.com/',
    
    'auth' : 'oauth/authorize',
    'req'  : 'oauth/request_token',
    'ac'   : 'oauth/access_token',
    
    'favs' : '1/favorites.json'
  },
  'keys' : {
    'customer_key'    : '6CbUi0yUqZzJ3FvqeXG2mA',
    'customer_secret' : 'laRgTcpOkAkf0LNQpziinHkEPkrLL9LsZQ7NQguybc'
  }
}

class OAuthRequestToken(db.Model):
  service = db.StringProperty()
  oauth_token = db.StringProperty()
  oauth_token_secret = db.StringProperty()
  created = db.DateTimeProperty(auto_now_add=True)


class OAuthAccessToken(db.Model):
  service = db.StringProperty()
  specifier = db.StringProperty()
  oauth_token = db.StringProperty()
  oauth_token_secret = db.StringProperty()
  created = db.DateTimeProperty(auto_now_add=True)


class AJAXHandler(webapp.RequestHandler):
  def post(self):
    self.response.headers[ 'Content-Type' ] = 'application/json'
    
    method = self.request.get( 'method' )
    
    twitter = Twitter()
    
    if method == 'check_auth':
      o = twitter.get_favs()
      
    elif method == 'get_oauth_key':
      o = twitter.get_request_token()
    
    return self.response.out.write( simplejson.dumps( o ) )


class OAuthHandler(webapp.RequestHandler):
  def get(self):
    self.response.out.write(  )


class Twitter(object):
  def get_favs(self):
    r = urlfetch.fetch( TWITTER_SETTINGS[ 'urls' ][ 'base' ] + TWITTER_SETTINGS[ 'urls' ][ 'favs' ] )
    
    if r.status_code == 200:
      return r.content
    
    else:
      return False
    

  def get_request_token(self):
    token_info = self.get_data_from_signed_url(
      TWITTER_SETTINGS[ 'urls' ][ 'base' ] + TWITTER_SETTINGS[ 'urls' ][ 'req' ]
    )

    token = OAuthRequestToken(
      service='Twitter',
      **dict(token.split('=') for token in token_info.split('&'))
    )

    token.put()
    
    return self.get_signed_url( TWITTER_SETTINGS[ 'urls' ][ 'base' ] + TWITTER_SETTINGS[ 'urls' ][ 'auth' ], token )
  
  def get_data_from_signed_url(self, __url, __token=None, __meth='GET', **extra_params):
    return urlfetch( self.get_signed_url( __url, __token, __meth, **extra_params ) ).content

  def get_signed_url(self, __url, __token=None, __meth='GET', **extra_params):
    return '%s?%s' %( __url, self.get_signed_body( __url, __token, __meth, **extra_params ) )

  def get_signed_body(self, __url, __token=None, __meth='GET', **extra_params):
    service_info = 'Twitter'

    kwargs = {
        'oauth_consumer_key'      : TWITTER_SETTINGS[ 'keys' ][ 'customer_key' ],
        'oauth_signature_method'  : 'HMAC-SHA1',
        'oauth_version'           : '1.0',
        'oauth_timestamp'         : int( time() ),
        'oauth_nonce'             : getrandbits( 64 )
    }

    kwargs.update( extra_params )
    
    service_key = self.get_service_key()

    if __token is not None:
      kwargs[ 'oauth_token' ] = __token.oauth_token
      key = self.service_key + encode( __token.oauth_token_secret )
      
    else:
      key = self.service_key
    
    for k,v in kwargs.items():
      if isinstance( v, unicode ):
        kwargs[k] = v.encode( 'utf8' )        

    message = '&'.join( map( encode, [ 
      __meth.upper(), __url, '&'.join(
        '%s=%s' % (encode(k), encode(kwargs[k])) for k in sorted(kwargs)
        )
    ] ) )
    
    kwargs[ 'oauth_signature' ] = hmac(
        key, message, sha1
      ).digest().encode( 'base64' )[ :-1 ]
      
    return urlencode(kwargs)

  def get_service_key(service):
    return cache.setdefault( 'Twitter', "%s&" % encode( TWITTER_SETTINGS[ 'keys' ][ 'customer_secret' ] ) )

  def create_uuid():
    return 'id-%s' % uuid4()

  def encode(text):
    return urlquote(str(text), '')

def main():
  application = webapp.WSGIApplication( [ ( '/oauth_callback.*?', OAuthHandler ), ( '/ajax', AJAXHandler ) ], debug=True )
  util.run_wsgi_app(application)

if __name__ == '__main__':
  main()
