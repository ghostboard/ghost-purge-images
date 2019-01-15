# ghost-purge-images
Clean unused uploaded images of your Ghost blog

## Install
Run:
`npm install -g ghost-purge-images`

## Execute
Login into your server via ssh:
- Go to the folder where you have installed Ghost, usually in `/var/www/ghost`
- See the files list with `ghost-purge-images display`
- Make a backup of `/content/images`
- Delete unused files with `ghost-purge-images purge`
- Done!

## Commands
### `ghost-purge-images display`
Print the list of all uploaded images that currently are not being used in any post, page or metadata

![ghost-purge-images display screenshot](https://user-images.githubusercontent.com/1589874/51084812-80e6f700-1730-11e9-96c4-4e106e4c7c63.png)

### `ghost-purge-images purge`
WARNING: Take a backup before run this

Delete all the unused files

![ghost-purge-images purge screenshot](https://user-images.githubusercontent.com/1589874/51084808-73ca0800-1730-11e9-8c2a-a3b43551fbaa.png)

## Author
David Burgos from [Ghostboard.io](https://ghostboard.io)

## License
See LICENSE file
