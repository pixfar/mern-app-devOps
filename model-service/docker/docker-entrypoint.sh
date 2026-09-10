#!/bin/bash

function checkEnv() {
  if [[ -z "$DB_HOST" ]]; then
    echo "DB_HOST is not set"
    exit 1
  fi
  if [[ -z "$DB_NAME" ]]; then
    echo "DB_NAME is not set"
    exit 1
  fi
  if [[ -z "$DB_PORT" ]]; then
    echo "DB_PORT is not set"
    exit 1
  fi
  if [[ -z "$DB_USER" ]]; then
    echo "DB_USER is not set"
    exit 1
  fi
  if [[ -z "$DB_PASSWORD" ]]; then
    echo "DB_PASSWORD is not set"
    exit 1
  fi
  # Add checks for other environment variables if needed
}

function checkConnection() {
  echo "Connect MongoDB . . ."
  timeout 10 bash -c 'until printf "" 2>>/dev/null >>/dev/tcp/$0/$1; do sleep 1; done' $DB_HOST $DB_PORT
}

function configureServer() {
  if [ ! -f .env ]; then
    envsubst '${DB_HOST}
      ${DB_NAME}
      ${DB_PORT}
      ${DB_USER}
      ${DB_PASSWORD}
      ${RMQ_HOST}' \
      < docker/env.tmpl > .env
  fi
}
export -f configureServer

if [ "$1" = 'rollback' ]; then
  # Validate if DB_HOST is set.
  checkEnv
  # Validate DB Connection
  checkConnection
  # Configure server
  su pixfar -c "bash -c configureServer"

  # Configure server
  configureServer
  # Rollback Migrations
  echo "Rollback migrations"
  # Add your rollback command here
  exit 0
fi

if [ "$1" = 'start' ]; then
  # Validate if DB_HOST is set.
  checkEnv
  # Validate DB Connection
  checkConnection
  # Configure server

  # Configure server
  su pixfar -c "bash -c configureServer"

  configureServer
  # Run Migrations
  echo "Run migrations"
  # Add your migration command here

  # Start server
  echo "Starting the server..."
  # Add your command to start the server here
  su pixfar -c "node dist/main.js"
  exit $?
fi

# Add any additional commands or configurations as needed

exec runuser -u pixfar "$@"