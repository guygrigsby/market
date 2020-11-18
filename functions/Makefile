release:
	gcloud functions deploy CreateInternalDeck --runtime go113 --trigger-http
	gcloud functions deploy CreateTTSDeck --runtime go113 --trigger-http

update-cards:
	export FIREBASE_CONFIG=`cat ~/snackend-b1d70cced136.json`
	(cd ./cloudfuncs && go test )
