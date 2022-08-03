function chooseFiles()
{
    const
        metadata = require('music-metadata'),
        remote = require('@electron/remote'),
        fs = require('fs'),
        util = require('./js/util');

    const
        options =
        {
            filters: [ { name: 'Music Files', extensions: ['mp3', 'flac'] } ],
            properties: ['multiSelections', 'showHiddenFiles']
        },

        dir =
        {
            albumArts: 'app/album arts',
            config: 'app/config.json'
        };

    remote.dialog.showOpenDialog(remote.BrowserWindow.getFocusedWindow(), options)
    .then((selected) =>
    {
        if (selected.canceled) return;

        Promise.all([...selected.filePaths.map(x => metadata.parseFile(x))]).then((x) =>
        {
            x.forEach((tags) =>
            {
                if (tags.common?.picture)
                {
                    const
                        picture = tags.common.picture[0],
                        formatted = util.formatter(tags.common.album, tags.common.albumartist);

                    if (fs.existsSync(dir.albumArts) === false) { fs.mkdirSync(dir.albumArts); }
                    
                    const fileLocation = dir.albumArts + '/' + formatted + '.' + picture.format.split('/')[1];

                    if (fs.existsSync(fileLocation)) return;

                    fs.writeFileSync(fileLocation, picture.data);
                }
            });
        })
        .then(() =>
        {
            alert('Album art for the selected songs will be saved in the folder: ' + dir.albumArts);
        });
    });
};

document.getElementById('getAlbumArt').onclick = chooseFiles;