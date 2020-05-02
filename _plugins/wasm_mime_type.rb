require 'webrick'
include WEBrick
WEBrick::HTTPUtils::DefaultMimeTypes.store 'wasm', 'application/wasm'