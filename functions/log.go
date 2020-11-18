package cloudfuncs

import (
	"os"

	"github.com/go-kit/kit/log"
	kitlog "github.com/go-kit/kit/log"
	"github.com/go-kit/kit/log/level"
	"github.com/inconshreveable/log15"
)

type kit15 struct {
	log kitlog.Logger
}

// New returns a new Logger that has this logger's context plus the given context
func (k *kit15) New(ctx ...interface{}) log15.Logger {
	return &kit15{kitlog.With(k.log, ctx...)}
}

// GetHandler gets the handler associated with the logger.
func (k *kit15) GetHandler() log15.Handler {
	return nil
}

// SetHandler updates the logger to write records to the specified handler.
func (k *kit15) SetHandler(h log15.Handler) {
}

// Log a message at the given level with context key/value pairs
func (k *kit15) Debug(msg string, ctx ...interface{}) {
	kvs := []interface{}{"msg", msg}
	kvs = append(kvs, ctx...)
	level.Debug(k.log).Log(ctx)
}

func (k *kit15) Info(msg string, ctx ...interface{}) {
	kvs := []interface{}{"msg", msg}
	kvs = append(kvs, ctx...)
	level.Info(k.log).Log(ctx)
}

func (k *kit15) Warn(msg string, ctx ...interface{}) {
	kvs := []interface{}{"msg", msg}
	kvs = append(kvs, ctx...)
	level.Warn(k.log).Log(ctx)
}

func (k *kit15) Error(msg string, ctx ...interface{}) {
	kvs := []interface{}{"msg", msg}
	kvs = append(kvs, ctx...)
	level.Error(k.log).Log(ctx)
}

func (k *kit15) Crit(msg string, ctx ...interface{}) {
	kvs := []interface{}{"msg", msg}
	kvs = append(kvs, ctx...)
	level.Error(k.log).Log(ctx)
}

// NewLogger creates a new logger. If debug is true, the logger outputs all levels, otherwise only >= info
func NewLogger(str string) log15.Logger {
	logger := kitlog.NewJSONLogger(kitlog.NewSyncWriter(os.Stdout))

	logger = setLevelKey(logger, "severity")

	switch str {
	case "debug":
		return &kit15{level.NewFilter(logger, level.AllowAll())}
	default:
		return &kit15{level.NewFilter(logger, level.AllowInfo())}
	}
}

// setLevelKey change the key level "level" to "severity" for StackDriver
func setLevelKey(logger kitlog.Logger, key interface{}) log.Logger {
	return log.LoggerFunc(func(keyvals ...interface{}) error {
		for i := 1; i < len(keyvals); i += 2 {
			if _, ok := keyvals[i].(level.Value); ok {
				// overwriting the key without copying keyvals
				// techically violates the log.Logger contract
				// but is safe in this context because none
				// of the loggers in this program retain a reference
				// to keyvals
				keyvals[i-1] = key
				break
			}
		}
		return logger.Log(keyvals...)
	})
}
