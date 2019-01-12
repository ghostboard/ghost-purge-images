# ghost-purge-images
Clean unused uploaded images of your Ghost blog

## Install (WIP)
Run `npm install -g ghost-purge-images`

## How to execute it
Login into your server:
- Go to the folder where you have installed Ghost, usually `/var/www/ghost`
- Run this package, for example `ghost-purge-images display`

## Commands
### display
Print the list of all uploaded images that currently are not being used in any post, page or metadata

### purge
Delete all the unused files.

See the list before purge, running the `display` command

WARNING: Avoid issues taking a backup before run `purge` command

## Author
David Burgos from [Ghostboard.io](https://ghostboard.io)
