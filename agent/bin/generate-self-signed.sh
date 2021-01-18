# ensure ./data folder is there
mkdir data

# generate key and cert
openssl genrsa -des3 -out server.key 1024
openssl req -new -key server.key -out server.csr
cp server.key server.key.org
openssl rsa -in server.key.org -out server.key
openssl x509 -req -days 365 -in server.csr -signkey server.key -out server.crt

# move key and cert to correct folder
mv server.crt ./data
mv server.key ./data

# remove intermediate files
rm server.csr
rm server.key.orig