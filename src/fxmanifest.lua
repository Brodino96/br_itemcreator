fx_version "cerulean"
game "gta5"

author "Brodino"
description "A custom in-game item generator for ox_inventory"
version "1.0"

server_scripts { "dist/server.js" }
client_scripts { "dist/client.js" }

files { "config.json", "locales/*" }

dependencies { "ox_lib", "ox_inventory" }