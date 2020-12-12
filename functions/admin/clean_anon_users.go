package admin

import (
	"context"

	firebase "firebase.google.com/go"
	"github.com/inconshreveable/log15"
	"google.golang.org/api/iterator"
)

const (
	Snackend = "snackend"
	Market   = "marketplace-c87d0"
)

var (
	log = log15.New()
)

type Message struct {
	ProjectName string `json:"project"`
}

func DeleteAnonymousUsers(ctx context.Context, m Message) error {
	return ClearAnonymousUsers(ctx)
}

func ClearAnonymousUsers(ctx context.Context) error {

	app, err := firebase.NewApp(ctx, nil)
	if err != nil {
		log.Error(
			"Cannot start firebase app",
			"err", err,
		)
	}
	client, err := app.Auth(ctx)
	if err != nil {
		log.Error(
			"Failed to get firestore client",
			"err", err,
		)
		return err
	}

	log.Info(
		"Created Connection to Firebase",
	)

	var uids []string
	res := client.Users(ctx, "")

	for {
		user, err := res.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			log.Error(
				"Failed to list users",
				"err", err,
			)
		}
		log.Debug("User", "user", user.UID)
		if user.Email == "" {
			log.Debug("Matchin User", "user", user)
			uids = append(uids, user.UID)

		}
	}

	deleteUsersResult, err := client.DeleteUsers(ctx, uids)
	if err != nil {
		log.Error("error deleting users",
			"err", err,
		)
		return err
	}
	log.Info("User delete results",
		"success", deleteUsersResult.SuccessCount,
		"failed", deleteUsersResult.FailureCount,
		"errs", deleteUsersResult.Errors,
	)

	return nil
}
