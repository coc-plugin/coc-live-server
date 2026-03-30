# coc-live-server

Launch a development local Server with live reload feature for static & dynamic pages.

## Install

```vim
:CocInstall coc-live-server

```

## Configuration options

- `coc-live-server.enabled`: Enable coc-live-server extension, default: `true`
- `coc-live-server.host`: Host for the live server, default: `0.0.0.0`
- `coc-live-server.port`: Port number for the live server, default: `8080`
- `coc-live-server.cors`: Enable CORS for the live server, default: `false`
- `coc-live-server.wait`: Wait time in milliseconds before reloading the page after a file change is detected, default: `100`
- `coc-live-server.spa`: translate requests from /abc to /#/abc (handy for Single Page Apps), default: `false`
- `coc-live-server.open`: Open the browser automatically when the server starts, default: `true`

## Commands

- `live-server.toggle`: Toggle Live Server
- `live-server.start`: Start Live Server
- `live-server.stop`: Stop Live Server

---

> This extension is built with [create-coc-extension](https://github.com/fannheyward/create-coc-extension)
