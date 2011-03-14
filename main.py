#!/usr/bin/env python

from google.appengine.ext import webapp
from google.appengine.ext.webapp import util

class AJAXHandler(webapp.RequestHandler):
  def post(self):
    self.response.out.write( 'true' )

class OAuthHandler(webapp.RequestHandler):
  def get(self):
    self.response.out.write( 'oauth!' )

def main():
  application = webapp.WSGIApplication( [ ( '/oauth_callback.*?', OAuthHandler ), ( '/ajax', AJAXHandler ) ], debug=True )
  util.run_wsgi_app(application)

if __name__ == '__main__':
  main()
