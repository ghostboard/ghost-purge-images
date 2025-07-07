/* eslint-disable no-await-in-loop */
const ghost = require('./ghost');
const argv = require('minimist')(process.argv.slice(2));
const fs = require('fs');
const { promisify } = require('util');
const { exec } = require('child_process');
const SHOULD_FIX_PERMISSIONS = argv['fix-permissions'] || argv.fix_permissions || argv.FIX_PERMISSIONS || false;

function checkFileAccess(filePath) {
  try {
    fs.accessSync(filePath, fs.constants.W_OK);
    return { type: 'none', message: null };
  } catch (err) {
    if (err.code === 'EACCES') {
      // If --fix-permissions flag is used, simulate that permissions are fixed
      if (SHOULD_FIX_PERMISSIONS) {
        return { type: 'none', message: null };
      }
      return { type: 'permission', message: null };
    }
    return { type: 'other', message: err.message };

  }
}

function filterUnused(params) {
  const uploads = params.uploads;
  const content = params.content;
  const result = {
    totalSpace: 0,
    totalUploads: uploads.length,
    list: []
  };

  for (const upload of uploads) {
    const out = {
      authors: ghost.authors.isBeingUsed(upload, content.authors),
      pages: ghost.pages.isBeingUsed(upload, content.pages),
      posts: ghost.posts.isBeingUsed(upload, content.posts),
      settings: ghost.settings.isBeingUsed(upload, content.settings),
      tags: ghost.tags.isBeingUsed(upload, content.tags)
    };
    const used = out.authors || out.pages || out.posts || out.settings || out.tags;
    if (!used) {
      result.totalSpace += upload.size;
      result.list.push(upload);
    }
  }
  return result;
}

function display(result) {
  console.clear();
  const hasUnused = result.list.length === 0;
  if (hasUnused) {
    console.log('✅  Completed but nothing to do here...');
    console.log('Congrats, all the uploads are being used 👍');
    return;
  }
  console.log('👇 Unused files that can be removed:');

  result.list.forEach((item) => {
    const accessCheck = checkFileAccess(item.path);
    let permissionIcon = '📄';
    let errorMessage = '';

    if (accessCheck.type === 'permission') {
      permissionIcon = '🔒';
    } else if (accessCheck.type === 'other') {
      permissionIcon = '❌';
      errorMessage = ` - ${accessCheck.message}`;
    }

    console.log(`${permissionIcon} ${item.path} (${(item.size / 1000000).toFixed(2)} MB)${errorMessage}`);
  });
  console.log('');
  console.log('📊 Summary:');
  console.log(`- ${result.list.length} files of ${result.totalUploads} uploaded files (${(result.list.length * 100 / result.totalUploads).toFixed(2)}%)`);
  console.log(`- Total space: ${(result.totalSpace / 1000000).toFixed(2)}MB`);

  const permissionIssuesCount = result.list.filter((item) => checkFileAccess(item.path).type === 'permission').length;
  const otherIssuesCount = result.list.filter((item) => checkFileAccess(item.path).type === 'other').length;

  if (permissionIssuesCount > 0) {
    console.log(`- ${permissionIssuesCount} files have permission issues (🔒)`);
    console.log('');
    console.log('💡 Rerun display command with --fix-permissions flag to simulate the fix');
  }

  if (otherIssuesCount > 0) {
    console.log(`- ${otherIssuesCount} files have other issues (❌)`);
    console.log('');
    console.log('💡 Check the error messages above');
  }

  console.log('');
  console.log('❔ Want to delete these files for good? Run:');
  console.log('`ghost-purge-images purge --content-key=YOUR_CONTENT_KEY --admin-key=YOUR_ADMIN_KEY`');
  console.log('🎁 Open source tool by David Burgos from https://ghostboard.io');

}

async function purge(result) {
  console.clear();
  const output = {
    space: 0,
    files: 0,
    errors: 0
  };

  // Handle interruption to show restoration commands
  const originalSigInt = process.listeners('SIGINT')[0];
  process.on('SIGINT', () => {
    if (SHOULD_FIX_PERMISSIONS) {
      console.log('\n⚠️  Process interrupted! Run these 2 commands to restore permissions to Ghost defaults:');
      console.log('`sudo find ./ -type d -exec chmod 00775 {} \\;`');
      console.log('`sudo find ./ ! -path "./versions/*" -type f -exec chmod 664 {} \\;`');
    }
    process.exit(1);
  });
  const hasUnused = result.list.length === 0;
  if (hasUnused) {
    console.log('✅  Completed but nothing to do here...');
    console.log('Congrats, all uploads are being used 👍');
    return;
  }

  if (SHOULD_FIX_PERMISSIONS) {
    try {
      console.log('🔧 Attempting to fix permissions...');
      const execAsync = promisify(exec);
      await execAsync('sudo chmod -R a+rw content');
      console.log('✅ Permissions fixed successfully');
    } catch (err) {
      console.log('❌ Failed to fix permissions automatically');
      console.log('Try running manually: `sudo chmod -R a+rw content`');
    }
  }

  console.log('👇 Starting to delete unused uploads:');
  for (const item of result.list) {
    try {
      await ghost.uploads.remove(item.path);
      output.files += 1;
      output.space += item.size;
      console.log(`✅ ${item.path}`);
    } catch (err) {
      output.errors += 1;
      console.log(`❌ ${item.path}`);
      console.log(` Error: ${err}`);
    }
  }
  console.log('');
  console.log('📊 Summary:');
  console.log(`- ${output.files} files removed`);
  console.log(`- Saved space: ${(output.space / 1000000).toFixed(2)}MB`);

  if (output.errors > 0) {
    console.log(`- ${output.errors} files failed to delete; try running with --fix-permissions flag`);
  }

  console.log('');

  // Restore permissions to original state after deletions
  if (SHOULD_FIX_PERMISSIONS) {
    console.log('🔧 Restoring permissions to original state...');
    try {
      const execAsync = promisify(exec);

      // Restore proper directory permissions (775)
      console.log('   📁 Restoring directory permissions...');
      await execAsync('sudo find ./ -type d -exec chmod 00775 {} \\;');

      // Restore proper file permissions (664)
      console.log('   📄 Restoring file permissions...');
      await execAsync('sudo find ./ ! -path "./versions/*" -type f -exec chmod 664 {} \\;');

      console.log('✅ Permissions restored successfully');
    } catch (err) {
      console.log('❌ Failed to restore permissions automatically');
      console.log(`Error: ${err.message}`);
      console.log('Run these 2 commands to restore permissions to Ghost defaults:');
      console.log('`sudo find ./ -type d -exec chmod 00775 {} \\;`');
      console.log('`sudo find ./ ! -path "./versions/*" -type f -exec chmod 664 {} \\;`');
    }
  }

  console.log('');
  console.log('🎁 Open source tool by David Burgos from https://ghostboard.io');

}

module.exports = {
  filterUnused,
  display,
  purge
};
