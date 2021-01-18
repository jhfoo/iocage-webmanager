# iocage-webmanager
Ambitious attempt to create a web UI so I don't have to remember all the mumbo jumbo.

# Key components
### Agent
1. Nodejs service running on pm2 for the server to interface against.

#### Generate self-signed cert
In <code>iocage-webmanager/agent</code> run:
```sh
./bin/generate-self-signed.sh
```
<code>data/</code> will be created if not existing and server cert and key will be created there.

### Server
1. Nodejs service running on pm2 interfacing with agents on each iocage host.
2. Server can reside on the same host as an Agent. 