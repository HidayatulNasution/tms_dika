#!/bin/bash

git fetch
git pull

# Check if docker.env file exists
if [ -f docker.env ]; then
    echo "Sourcing environment file..."
    declare -A env_vars
    while IFS= read -r line || [ -n "$line" ]; do
        # Ignore empty lines and comments
        [[ -z "$line" || "$line" =~ ^# ]] && continue
        
        # Parse each line in the .env file
        IFS='=' read -r key value <<< "$line"
        env_vars["$key"]="$value"
    done < docker.env

    # Ensure required variables exist
    if [[ -n "${env_vars[APP_NAME]}" && -n "${env_vars[TAG]}" ]]; then
        export PROJECT="${env_vars[APP_NAME]}-${env_vars[TAG]}"
        echo "PROJECT set to: $PROJECT"
    else
        echo "Error: APP_NAME or TAG not found in docker.env. Aborting..."
        exit 1
    fi
else
    echo "Error: environment file not found. Aborting..."
    exit 1
fi

echo "Building & Running Image $PROJECT..."
sudo docker compose --env-file docker.env -p "$PROJECT" build --no-cache
sudo docker compose --env-file docker.env -p "$PROJECT" up -d --force-recreate

# Check the exit code of the last command
if [ $? -ne 0 ]; then
    echo "Deploy failed!"
    exit $?
fi

echo "Deploy completed."
exit 0