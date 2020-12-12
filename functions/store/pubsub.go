package store

// PubSubMessage is the payload of a Pub/Sub event. We don't care about it.
type PubSubMessage struct {
	Data []byte `json:"data"`
}
