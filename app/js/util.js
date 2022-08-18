function formatter(albumName, albumArtist)
{
    const
        allowedChars = 'abcdefghijklmnopqrstuvwxyz_-0123456789'.split(''),
        replaceWith = '-';

    const array = 
    {
        albumName: albumName.toLowerCase().split(' ').join('_').split(''),
        albumArtist: albumArtist.toLowerCase().split(' ').join('_').split('')
    };

    array.albumName.forEach(x => allowedChars.includes(x) ? null : array.albumName[array.albumName.indexOf(x)] = replaceWith);
    array.albumArtist.forEach(x => allowedChars.includes(x) ? null : array.albumArtist[array.albumArtist.indexOf(x)] = replaceWith);

    return array.albumName.join('') + '_' + array.albumArtist.join('');
};

function parseTime(ms)
{
    const round = ms > 0 ? Math.floor : Math.ceil;

	const data =
	{
		days: round(ms / (24 * 60 * 60 * 1000)),
		hours: round(ms / (60 * 60 * 1000)) % 24,
		minutes: round(ms / (60 * 1000)) % 60,
		seconds: round(ms / 1000) % 60
	};

	return data;
};

function getFileSize(fileLocation)
{
    const { statSync } = require('fs');

    const byte = statSync(fileLocation).size;

    const round = byte > 0 ? Math.floor : Math.ceil;

	const data =
	{
		gb: round(byte / (1024 * 1024 * 1024)) % 1024,
		mb: round(byte / (1024 * 1024)) % 1024,
		kb: round(byte / 1024) % 1024,
		byte
	};

	return data;
};

function buffer2DataURL(format, buffer)
{
    const dataURL = `data:${format};base64,${buffer?.toString('base64')}`;

    return dataURL;
};

function getAudioDuration(fileLocation)
{
    const { parseFile } = require('music-metadata');
    
    return new Promise((resolve) =>
    {
        parseFile(fileLocation, {skipCovers: true, skipPostHeaders: true}).then((result) =>
        {
            const ms = result.format.duration * 1000;

            resolve(parseTime(ms));
        });
    });
};

function getElement(localName, obj)
{
    let foundElement;

    if (obj?.localName === localName) { foundElement = obj; }

    else if (obj?.detail?.localName === localName) { foundElement = obj.detail; }

    else { obj?.composedPath()?.forEach(x => x.localName === localName ? foundElement = x : null); }

    return foundElement;
};

function getAlbumArt(fileLocation)
{
    const { parseFile } = require('music-metadata');

    return new Promise((resolve) =>
    {
        parseFile(fileLocation, {skipPostHeaders: true}).then((tags) =>
        {
            const picture = tags.common?.picture[0];

            const obj = {};

            obj.format = picture?.format;
            obj.buffer = picture?.data;
            obj.URL = buffer2DataURL(picture?.format, picture?.data);

            resolve(obj);
        });
    });
};

function getMetaData(fileLocation)
{
    const { parseFile } = require('music-metadata');

    return new Promise((resolve) =>
    {
        parseFile(fileLocation, {skipCovers: true, skipPostHeaders: true}).then((tags) =>
        {
            const { album, albumartist, artists, bpm, disk, genre, title, track, year } = tags.common;

            resolve
            ({
                album,
                albumArtist: albumartist,
                artists,
                bpm,
                disk,
                genre,
                title,
                track,
                year
            });
        });
    });
};

function getAudioInfo(fileLocation)
{
    const { parseFile } = require('music-metadata');

    return new Promise((resolve) =>
    {
        parseFile(fileLocation, {skipCovers: true, skipPostHeaders: true}).then((result) =>
        {
            const { bitrate, codec, duration, lossless, numberOfChannels, sampleRate } = result.format;

            resolve
            ({
                bitrate: `${bitrate / 1000} kbps`,
                encoding: codec,
                sampleRate: `${sampleRate} Hz`,
                channelType: numberOfChannels === 2 ? 'Stereo' : 'Mono',
                lossless,
                duration: { parsed: parseTime(duration * 1000), rawSeconds: duration },
                fileSize: getFileSize(fileLocation)
            });
        });
    });
};

class json
{
    constructor(fileLocation)
    {
        this.fileLocation = fileLocation;
        this.fs = require('fs');
    };

    read()
    {
        const json = this.fs.readFileSync(this.fileLocation);

        this.json = JSON.parse(json);

        return this.json;
    };


    save()
    {
        const json = JSON.stringify(this.json, null, 4);

        this.fs.writeFileSync(this.fileLocation, json);
    };
};

function readConfig()
{
    const { readFileSync } = require('fs');

    return JSON.parse(readFileSync('app/config.json'));
};

//

module.exports =
{
    formatter,
    parseTime,
    getFileSize,
    buffer2DataURL,
    getAudioDuration,
    getElement,
    getAlbumArt,
    getMetaData,
    getAudioInfo,
    json,
    readConfig
};