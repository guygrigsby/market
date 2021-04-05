FROM golang:alpine

WORKDIR /go/src/app
COPY . .

RUN go mod download
RUN go build -o func cmd/local/main.go


CMD ["/go/src/app/func"]
