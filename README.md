# ghost-purge-images
Display or clean unused uploaded images of your Ghost blog

## 👻 Ghost versions
Which Ghost version are you running?
- Ghost v3 👉 `npm install -g ghost-purge-images`
- Ghost v2 +v2.16 👉 `npm install -g ghost-purge-images@2.1.1`
- Ghost v2 - v2.15.x 👉 `npm install -g ghost-purge-images@2.0.3`
- Ghost v0.7.2 - v1.x 👉 `npm install -g ghost-purge-images@1.0.0`

⚠️ Note: images in drafts (both posts/pages) will be removed too if you are not running **Ghost v2.16 or newer**

Why? Drafts are only available in [Ghost Admin API](https://docs.ghost.org/api/admin/) included in **Ghost 2.16**

## 🎁 Update to the last version
In your blog server, login via ssh and run:

`npm install -g ghost-purge-images`

✅ This command will install or update `ghost-purge-images` globally in your server, it doesn't matter in which folder you run it 

## 🔑 Keys
This tool use:
- [Ghost Content API](https://docs.ghost.org/api/content/) for check authors & tags
- [Ghost Admin API](https://docs.ghost.org/api/admin/) for check posts & pages, including drafts

Get the keys following this steps:
- On your Ghost admin, click on **Integrations** at the left menu
- Click on **Add custom integration** and set any name
- Copy the Content API & Admin API Keys to use them

💡 Need help? Check this [step-by-step guide to create them](https://ghostboard.io/blog/how-to-integrate-ghostboard-with-ghost-content-api/)

## 🚀 Execute
Login into your server via ssh:
- Where you have installed Ghost, usually:

`cd /var/www/ghost`
- Run a command, for example:

`ghost-purge-images display --content-key=YOUR_CONTENT_KEY --admin-key=YOUR_ADMIN_KEY`

## ⚡️ Commands
### `ghost-purge-images display --content-key=YOUR_CONTENT_KEY --admin-key=YOUR_ADMIN_KEY`
Print the list of all uploaded images that currently are not being used in any post, page or metadata

![ghost-purge-images display screenshot](https://user-images.githubusercontent.com/1589874/51084812-80e6f700-1730-11e9-96c4-4e106e4c7c63.png)

### `ghost-purge-images purge --content-key=YOUR_CONTENT_KEY --admin-key=YOUR_ADMIN_KEY`
WARNING: Take a backup before run this

Delete all the unused files.

![ghost-purge-images purge screenshot](https://user-images.githubusercontent.com/1589874/51084808-73ca0800-1730-11e9-8c2a-a3b43551fbaa.png)

## 🎯 Troubleshotting

### Error: EACCES: permission denied, unlink ANY_FILE_PATH
Permissions issue on your server, try to run in your Ghost folder:

`sudo chmod -R a+rw content`

## 📋 Changelog
See [CHANGELOG.md](https://github.com/ghostboard/ghost-purge-images/blob/master/CHANGELOG.md)

## 👋 Credits
David Burgos from [Ghostboard.io](https://ghostboard.io)

## ✒️ License
See LICENSE file
