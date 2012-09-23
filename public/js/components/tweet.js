Crafty.c("Tweet", {
	setTweet: function(tweet) {
		this.tweet = tweet.value;
		this.tweet.id = tweet.key;
		this.tweet.doc_id = tweet.id;
		return this;
	}
});