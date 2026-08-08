#!/bin/zsh
		
FIREBASE_CONFIG=`cat ~/marketplace-c87d0-firebase-adminsdk-3gz7a-d0d7f659a0.json`
FIREBASE_CONFIG=$FIREBASE_CONFIG go run cmd/local/main.go
