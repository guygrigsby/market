release:
	@gcloud functions deploy CreateAllFormats --runtime go113 --trigger-http


test:
	@GOOGLE_APPLICATION_CREDENTIALS=$(shell cat ${HOME}/listing-publisher.json)
	go test
