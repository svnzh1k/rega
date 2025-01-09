FROM golang:alpine

WORKDIR /app

COPY . .


# Install build dependencies
RUN apk add --no-cache build-base gcc git


# Install SQLite dependencies
RUN apk add --no-cache sqlite-dev

# Enable CGO and build the application
RUN CGO_ENABLED=1 go build -o main .

EXPOSE 7070

CMD ["./main"]
