function clean_bot() {
    rm -rf node_modules
    rm -rf dist
}

function clean_client() {
    (cd client && npm run clean && rm -rf node_modules)
}

function clean_img() {
    (cd api/image && rm main)
}

if [ $1 == "bot" ]; then
    clean_bot
else
    if [ $1 == "client" ]; then
        clean_client
    else
        if [ $1 == "img" ]; then
            clean_img
        else
            if [ $1 == "all" ]; then
                clean_bot
                clean_client
                clean_img
            fi
        fi
    fi
fi
