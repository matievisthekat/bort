function install () 
{
    if [ -d "./node_modules" ]
    then
        npm ci
    else
        npm i
    fi
}

install
cd client
install

