# ghost-purge-images
Clean unused uploaded images of your Ghost blog

## Install
Run `npm install -g ghost-purge-images`

## Execute
Login into your server via ssh:
- Go to the folder where you have installed Ghost, usually in `/var/www/ghost`
- Run this package with a command, for example `ghost-purge-images display`

## Commands
### display
Print the list of all uploaded images that currently are not being used in any post, page or metadata
`ghost-purge-images display`

![ghost-purge-images display screenshot](https://user-images.githubusercontent.com/1589874/51084812-80e6f700-1730-11e9-96c4-4e106e4c7c63.png)

### purge
WARNING: Avoid issues taking a backup before run `purge` command

Delete all the unused files.
`ghost-purge-images purge`

![ghost-purge-images purge screenshot](https://user-images.githubusercontent.com/1589874/51084808-73ca0800-1730-11e9-8c2a-a3b43551fbaa.png)

## Author
David Burgos from [Ghostboard.io](https://ghostboard.io)
