all: godel church turing

godel:
	@echo ======== $@ ========
	node godel/exercices.js

church:
	@echo ======== $@ ========
	node church/list_non_nil.js 
	node church/list_nil_2cases.js 
	node church/list_nil_3cases.js 
	node church/int_church.js

turing:
	@echo ======== $@ ========
	node turing/exercices.js

.PHONY: church godel turing