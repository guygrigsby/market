serve:
	yarn build
	firebase serve --only hosting

run-functions:
	go run functions/cmd/local/main.go
