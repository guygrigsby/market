GOOGLE_APPLICATION_CREDENTIALS=${HOME}/listing-publisher.json


run-functions:
	@./run.sh
release:
	@gcloud functions deploy CreateAllFormats 

test:
	($(shell export GOOGLE_APPLICATION_CREDENTIALS)  go test)

gg:
	echo $(shell 'cat ~/marketplace.json')

