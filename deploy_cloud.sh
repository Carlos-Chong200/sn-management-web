#/bin/bash
rm ./dist -rf
yarn build
scp -r  ./dist/* root@aliyun:/root/nginx/share/nginx/html/
