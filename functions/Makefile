GOOGLE_APPLICATION_CREDENTIALS=${HOME}/listing-publisher.json
release:
	@gcloud functions deploy CreateAllFormats --runtime go113 --trigger-http


test:
	($(shell export GOOGLE_APPLICATION_CREDENTIALS)  go test)
