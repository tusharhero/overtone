let
    firstAlertOver = false,
    client;

function updateRPC({detail})
{
    const tags = detail;

    const util = require('./js/util');

    if (client === undefined)
    {
        if (!firstAlertOver)
        {
            firstAlertOver = true;
            alert('ALERT: RPC is not connected');
        }

        return;
    }

    const
        songName = tags.common?.title,
        albumArtist = tags.common?.albumartist,
        albumName = tags.common?.album;

    const pressence = 
    {
        details: songName,
        state: albumArtist,
        largeImageKey: util.formatter(albumName, albumArtist),
        largeImageText: albumName
    };

    client.setActivity(pressence);
};

document.addEventListener('-RPC', ({detail}) => client = detail);
document.addEventListener('-updateMetaData', updateRPC);