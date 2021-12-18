# ghost-purge-images

Display or clean unused uploaded images, audio and video files of your Ghost blog

## 👻 Ghost versions

Which Ghost version are you running?

- Ghost v3, v4 👉 `npm install -g ghost-purge-images`
- Ghost v2 +v2.16 👉 `npm install -g ghost-purge-images@2.1.1`
- Ghost v2 - v2.15.x 👉 `npm install -g ghost-purge-images@2.0.3`
- Ghost v0.7.2 - v1.x 👉 `npm install -g ghost-purge-images@1.0.0`

## 🎁 Update to the last version

In your blog server, login via ssh and run:

`npm install -g ghost-purge-images`

💡 This command will install or update `ghost-purge-images` globally in your server, it doesn't matter in which folder you run it 

## 🤓 Observations

- Due [Content & Admin API](https://ghost.org/docs/api/v3/content/#resources), some **images associated to the next resouces will be removed**:
    - **Authors with zero published posts**
    - **Tags that are not associated with a post**
    - **Drafts** (both posts/pages) will be removed too if you are not running **Ghost v2.16 or newer** 
    
        💡 Why? Drafts are only available in [Ghost Admin API](https://docs.ghost.org/api/admin/) included in **Ghost 2.16**
- Backup your content folder first!

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
### `display`

Print the list of all uploaded images that currently are not being used in any post, page or metadata

- Example: `ghost-purge-images display --content-key=YOUR_CONTENT_KEY --admin-key=YOUR_ADMIN_KEY`


![ghost-purge-images display screenshot](https://user-images.githubusercontent.com/1589874/51084812-80e6f700-1730-11e9-96c4-4e106e4c7c63.png)

### `purge`

Delete all the unused files.

⚠️ WARNING: Take a backup before run this

- Example: `ghost-purge-images purge --content-key=YOUR_CONTENT_KEY --admin-key=YOUR_ADMIN_KEY`

![ghost-purge-images purge screenshot](https://user-images.githubusercontent.com/1589874/51084808-73ca0800-1730-11e9-8c2a-a3b43551fbaa.png)

## 🧩 Optional Params

- ### `url`

💡 By default, the URL in **config.production.json** will be used. This may be useful for Docker or custom configurations

Example: `... --url=https://yourblog.com/`

- ### `images-path`

💡 The **default images path** is `content/images`

You can change it with the optional param `... --images-path=your/custom/path/here`

- ### `media-path`

💡 The **default media path** is `content/media`

You can change it with the optional param `... --media-path=your/custom/path/here`


## 🎯 Troubleshooting

### Error: EACCES: permission denied, unlink ANY_FILE_PATH
Permissions issue on your server, try to run in your Ghost folder:

`sudo chmod -R a+rw content`

## 📋 Changelog
See [CHANGELOG.md](https://github.com/ghostboard/ghost-purge-images/blob/master/CHANGELOG.md)

## 👋 Credits
David Burgos from [Ghostboard.io](https://ghostboard.io)

## 👏 Contributors
- [mesquka](https://github.com/mesquka/ghost-purge-images-customdir/commits?author=mesquka)

## ✒️ License
See LICENSE file
