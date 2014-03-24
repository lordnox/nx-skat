
project = require '../project'
sProxy  = (require 'socket-proxy')
log     = (require 'debug') "nx-skat-static"
Static  = sProxy.static
client  = sProxy.client

config =
  path: "/"

server = new Static
  path: project.appbase
  options:
    headers:
      "Access-Control-Allow-Origin" : "*"
      "Access-Control-Allow-Headers": "X-Requested-With"

client config, server.httpServer, ->
  log "server is listening now %d", server.httpServer.address().port

