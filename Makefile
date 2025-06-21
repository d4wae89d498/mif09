all: godel lambda

godel:
	node godel.js

lambda:
	node lambda.js
	scheme --script lambda.scm