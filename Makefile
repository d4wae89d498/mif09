all: mu lambda

mu:
	node mu/exercices.js

lambda:
	node lambda/list_non_nil.js 
	node lambda/list_nil_2cases.js 
	node lambda/list_nil_3cases.js 

.PHONY: lambda mu