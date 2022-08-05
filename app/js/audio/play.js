const audio = new Audio();

let queueList, current;

function play({detail} = '')
{
    if (detail !== undefined)
    {
        if (typeof(detail) === 'object')
        {
            queueList = detail;
            current = 0;
        }

        else { current = detail; }
    }

    const metadata = require('music-metadata');

    audio.src = queueList[current];

    metadata.parseFile(queueList[current]).then(tags => document.dispatchEvent(new CustomEvent('-updateMetaData', {detail: tags})));

    document.dispatchEvent(new CustomEvent('-audio', {detail: audio}));

    document.dispatchEvent(new CustomEvent('-current', {detail: current}));
        
    pauseORplay();
};

function pauseORplay(x)
{
    if (audio.paused)
    {
        if (audio.src.length === 0)
        {
            if (x)
            { return alert('Choose a song first !'); }
        }

        else { audio.play(); }
    }

    else { audio.pause(); }
};

function changeCurrentState(E)
{
    const
        imgPause = document.getElementById('imgPause'),
        imgPlay = document.getElementById('imgPlay'),
        albumArtWrapper = document.getElementById('albumArtWrapper');

    if (E.type === 'pause')
    {
        if (audio.duration === audio.currentTime && queueList.length !== (current + 1))
        {
            current++;

            play();
        }

        albumArtWrapper.style.transform = 'scale(0.98)';

        imgPause.classList.add('opacity0');
        imgPlay.classList.remove('opacity0');
    }

    else
    {
        albumArtWrapper.style.transform = '';

        imgPlay.classList.add('opacity0');
        imgPause.classList.remove('opacity0');
    }
};

function skip(E)
{
    pauseORplay();

    const id = E.target.id;

    setTimeout(() =>
    {
        if (queueList.length === 0) return;

        if (id === 'imgNext')
        {
            if (queueList.length === (current + 1)) return play();
        
            current++;
            
            play(); 
        }
        
        if (id === 'imgPrevious')
        {
            if (current === 0) return play();
        
            current = current - 1;
            
            play(); 
        }     
    });
};

document.getElementById('pauseORplay').onclick = pauseORplay;
document.getElementById('imgNext').onclick = skip;
document.getElementById('imgPrevious').onclick = skip;

audio.addEventListener('pause', changeCurrentState);
audio.addEventListener('play', changeCurrentState);

document.addEventListener('-clickedQueueItem', (obj) =>
{
    pauseORplay();

    setTimeout(() => play(obj));
});

document.addEventListener('-selectedFilePaths', (obj) =>
{
    pauseORplay();

    setTimeout(() => play(obj));
});