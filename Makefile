all: mu lambda

mu:
	node mu/exercices.js

lambda:
	node lambda/list_non_nil.js 
	node lambda/list_nil_2cases.js 
	node lambda/list_nil_3cases.js 
	node lambda/int_church.js

.PHONY: lambda mu