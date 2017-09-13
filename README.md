# admin

Nudj admin for nudj employees only

## Contributing

### Requirements

1. Docker
1. Make

### Outside container

1. `make build` to build the image
1. `make ssh` to ssh into container
1. `make test` to run the tests

### Development (Inside container)

1. `run` to run the app
1. `dev` to run the app with a watcher
1. `test` to run the tests
1. `tdd` to run the tests with a watcher
1. `exit` to leave the container and close the ssh session
