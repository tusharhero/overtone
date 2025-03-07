const
    outAlbum = { wait: false, lastInput: undefined },
    inAlbum = { wait: false, lastInput: undefined };

function displayNone(x) { x.style.display = 'none'; };
function displayRevert(x) { x.style.display = ''; };

function searchOutAlbum(E)
{
    const input = E.currentTarget;

    if (outAlbum.wait) return;

    outAlbum.wait = true;

    if (outAlbum.lastInput === input.value.toLowerCase()) return outAlbum.wait = false;
    
    const { read } = require('./js/util');

    outAlbum.lastInput = input.value.toLowerCase();

    const albumItems = Array.from(document.querySelector('section.album .out .body').children);

    albumItems.forEach(x => x.classList.remove('displayNone'));

    const filtered = albumItems.filter(x => !read.albums()[x.dataset.id].album.toLowerCase().includes(outAlbum.lastInput));

    filtered.length === albumItems.length ? input.classList.add('noMatch') : input.classList.remove('noMatch');
    
    filtered.forEach(x => x.classList.add('displayNone'));

    setTimeout(() =>
    {
        outAlbum.wait = false;

        if (outAlbum.lastInput === input.value.toLowerCase()) return;

        searchOutAlbum(E);
    }, 500);
};
        
function searchInAlbum(E)
{
    const input = E.currentTarget;
    
    if (inAlbum.wait) return;
    
    inAlbum.wait = true;

    if (inAlbum.lastInput === input.value.toLowerCase()) return inAlbum.wait = false;

    inAlbum.lastInput = input.value.toLowerCase();

    const songList = Array.from(document.getElementById('songListInAlbum').children);

    songList.forEach(displayRevert);

    const filtered = songList.filter(x => !x.dataset.songName.includes(inAlbum.lastInput));

    filtered.length === songList.length ? input.classList.add('noMatch') : input.classList.remove('noMatch');
    
    filtered.forEach(displayNone);

    setTimeout(() =>
    {
        inAlbum.wait = false;

        if (inAlbum.lastInput === input.value.toLowerCase()) return;

        searchInAlbum(E);
    }, 500);
};

document.getElementById('outAlbumInput').addEventListener('input', searchOutAlbum);
document.getElementById('inAlbumInput').addEventListener('input', searchInAlbum);