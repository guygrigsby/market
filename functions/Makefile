GOOGLE_APPLICATION_CREDENTIALS=${HOME}/listing-publisher.json
release:
	@gcloud functions deploy CreateAllFormats 

test:
	($(shell export GOOGLE_APPLICATION_CREDENTIALS)  go test)

gg:
	echo $(shell 'cat ~/marketplace.json')

run-functions:
	FIREBASE_CONFIG=${FIREBASE_CONFIG}  go run cmd/local/main.go
