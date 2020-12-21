GOOGLE_APPLICATION_CREDENTIALS=${HOME}/listing-publisher.json
release:
	@gcloud functions deploy CreateAllFormats --runtime go113 --trigger-http --set-env-vars=[FIREBASE_CONFIG=${FIREBASE_CONFIG}]

test:
	($(shell export GOOGLE_APPLICATION_CREDENTIALS)  go test)

gg:
	echo $(shell 'cat ~/marketplace.json')
