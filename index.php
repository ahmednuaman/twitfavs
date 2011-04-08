<!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="content-type" content="text/html;charset=UTF-8" />
		<link type="text/css" rel="stylesheet" href="http://yui.yahooapis.com/3.3.0/build/cssreset/reset-min.css" />
		<link type="text/css" rel="stylesheet" href="http://fonts.googleapis.com/css?family=Kreon" />
		<link type="text/css" rel="stylesheet" href="/assets/css/styles.css" />
		<title>Twitfavs &mdash; Aggregating your Twitter favourites since 2011</title>
	</head>
	<body>
		<div id="container">
			<div id="authed">
				<header>
					<h1><span id="username"></span>'s favs</h1>
					<h2>Powered by Twitfavs &mdash; Aggregating your Twitter favourites since 2011</h2>
				</header>
				<div id="favs">
					<article>
						<span class="right">&#9758;</span>
						<h3></h3>
						<ul>
							<li>
								<a></a>
							</li>
						</ul>
						<iframe></iframe>
						<span class="right controls">&#9758;</span>
						<span class="left controls">&#9756;</span>
					</article>
				</div>
				<div id="bottom">
					<button>Load some more &raquo;</button>
					<button>Loading...</button>
				</div>
			</div>
			<div id="unauthed" class="center">
				<h1>Hello there!</h1>
				<h2>Before you can see your favourites and aggregate their arse off, you need to authorise this app to read them.</h2>
				<button>
					Authorise me &raquo;
				</button>
				<hr />
				<h3>So what's happening here exactly?</h3>
				<p>Well I'm glad you asked. Twitfavs is a small and simple aggregator for all your twitter favourite needs. If you're like me, you have lots and lots of favourites that you don't have time to read through. So, much like an RSS reader, this little app displays your favourites in a nice and simple manner and preloads previews of the links (if any) contained within those tweets.</p>
				<h3>How does one use it?</h3>
				<p>Well one needs to have a twitter account (if one hasn't got one, please visit: <a href="http://twitter.com/">http://twitter.com/</a> and sort one self out). Once one is on twitter, come back here (here being <a href="http://twitfavs.fsmg.co.uk/">http://twitfavs.fsmg.co.uk/</a>) and authorise one's arse. Then one'll be in twitter favourites heaven.</p>
			</div>
			<footer>
				<p>
					Built by <a href="http://ahmednuaman.com/?utm_referrer=twitfavs">Ahmed Nuaman</a> in my little spare time using the awesome <a href="https://github.com/jmathai/twitter-async">epitwitter</a>. 
					Feel free to fork me at Github: <a href="https://github.com/ahmednuaman/twitfavs">https://github.com/ahmednuaman/twitfavs</a>.
				</p>
			</footer>
		</div>
		<a href="http://github.com/ahmednuaman/twitfavs"><img style="position: absolute; top: 0; right: 0; border: 0;" src="https://d3nwyuy0nl342s.cloudfront.net/img/7afbc8b248c68eb468279e8c17986ad46549fb71/687474703a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f72696768745f6461726b626c75655f3132313632312e706e67" alt="Fork me on GitHub"></a>
		<div id="loader"></div>
		<script src="/assets/js/jquery.min.js"></script>
		<script src="/assets/js/jquery-ui.min.js"></script>
		<script src="/assets/js/suitcase.js"></script>
		<script>
		<!--
			var _gaq = _gaq || [];_gaq.push(['_setAccount', 'UA-352545-19']);_gaq.push(['_trackPageview']);(function() {var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);})();
		-->
		</script>
	</body>
</html>