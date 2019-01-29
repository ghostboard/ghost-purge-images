# ghost-purge-images
Display or clean unused uploaded images of your Ghost blog

## 🎁 Install
Run `npm install -g ghost-purge-images`

## 🚀 Execute
Login into your server via ssh:
- Go to the folder where you have installed Ghost, usually in `/var/www/ghost`
- Run any command, for example `ghost-purge-images display key=YOUR_KEY`

## 🔑 Key
This tool use the [Ghost Content API](https://docs.ghost.org/api/content/), so you need to provide a Content API Key.

Get a key following this steps:
- On your Ghost admin, click on **Integrations** at the left menu
- Click on green button **Add custom integration** and set any name
- Copy the Content API Key and use it

👉 **This key can be the same** you are using in your [Ghostboard](https://ghostboard.io) account

💡 Need help? Check this [step-by-step guide to get a Content API Key](https://ghostboard.io/blog/how-to-integrate-ghostboard-with-ghost-content-api/)

## ⚡️ Commands
### `ghost-purge-images display key=YOUR_KEY_HERE`
Print the list of all uploaded images that currently are not being used in any post, page or metadata

![ghost-purge-images display screenshot](https://user-images.githubusercontent.com/1589874/51084812-80e6f700-1730-11e9-96c4-4e106e4c7c63.png)

### `ghost-purge-images purge key=YOUR_KEY_HERE`
WARNING: Take a backup before run this

Delete all the unused files.

![ghost-purge-images purge screenshot](https://user-images.githubusercontent.com/1589874/51084808-73ca0800-1730-11e9-8c2a-a3b43551fbaa.png)

## 📋 Changelog
### 2.x
- Support Ghost Content API
- Deprecated Ghost Public API
- Add support for images used in Tags & Authors
### 1.x
- Support Ghost Public API
- Support for images in posts, pages, logo & cover

## 👋 Credits
David Burgos from [Ghostboard.io](https://ghostboard.io)

## ✒️ License
See LICENSE file
