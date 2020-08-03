if [ $1 == "bot" ]; then
    if [ -d "./dist/src" && -d "./dist/lib" && -d "./dist/api" && -f "./dist/src/index.js" ]; then
        node dist/src/index.js
    else
        ./scripts/build.sh bot
        node dist/src/index.js
    fi
else
    if [ $1 == "img" ]; then
        if [ -f "./api/image/main" ]; then
            ./api/image/main
        else
            ./scripts/build.sh img
            ./api/image/main
        fi
    else
        if [ $1 == "client" ]; then
            (cd client && npm start)
        else
            echo "No valid start option provided"
        fi
    fi

fi
