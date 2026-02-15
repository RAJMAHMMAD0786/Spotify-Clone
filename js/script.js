console.log("Lets write JavaScript :");

//global ho gya current song ab
let currentsong = new Audio();

// global variable 
let songs

// secondsToMinutesSeconds
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

// http://127.0.0.1:3000/songs/
async function getsongs() {
    let a = await fetch("http://127.0.0.1:3000/songs/");
    let response = await a.text()
    console.log(response)

    let div = document.createElement("div");
    div.innerHTML = response;

    let as = div.getElementsByTagName("a");

    let songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];

        // if (element.href.endsWith(".mp4")) {
        //     songs.push(element.href)                      //.split("/songs/")[1]
        // }

        if (element.href.endsWith(".mp4")) {
            let url = new URL(element.href);
            songs.push(url.pathname.split("/").pop());
        }
    }
    return songs;

}


// playMusic function
// first song set karne ke liye     

const playMusic = (track, pause = false) => {

    currentsong.src = track;   // yaha songs/ mat lagao

    if (!pause) {
        currentsong.play();
        play.src = "img/pause.webp";
    }

    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
};


async function main() {

    // get the list of all songs 
    songs = await getsongs();

    playMusic(songs[0], true)




    // show all the songs in the playlist
    let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songul.innerHTML = songul.innerHTML + `<li><img class="invert" src="img/music.webp" alt="">
                            <div class="info">
                                <div>${song.replaceAll("%5Csongs%5C", " ")}</div>
                                <div>Harry</div>
                            </div>

                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="img/playbarsong.webp" alt="">
                            </div></li>`;
    }

    // Attech an event listener to each song 
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })


    // Attech an event listener to play , next and previus 
    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play()
            play.src = "img/pause.webp"

        }
        else {
            currentsong.pause()
            play.src = "img/playbarsong.webp"
        }
    })


    // Listen for timeupdate event
    currentsong.addEventListener("timeupdate", () => {
        console.log(currentsong.currentTime, currentsong.duration);
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentsong.currentTime)} / ${secondsToMinutesSeconds(currentsong.duration)}`

        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";
    })


    // Add an event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentsong.currentTime = ((currentsong.duration) * percent) / 100
    })


    // Add an event listener for humburger   ---mobile ke liye lagaya gya hai
    document.querySelector(".humburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    })


    // Add an event listener for close   ---mobile ke liye lagaya gya hai
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%";
    })


    // Add an event listener to previus
    previus.addEventListener("click", () => {
        console.log("previus clicked");

        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
    })

    // Add an event listener to next
    next.addEventListener("click", () => {
        console.log("next clicked");

        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }
    })


    // Add an event listener to voluem
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("setting volume to", e.target.value, "/ 100")
        currentsong.volume = parseInt(e.target.value) / 100
    })


      // Add an event listener to mute the track
    document.querySelector(".volume>img").addEventListener("click", e=>{ 
        if(e.target.src.includes("volume.webp")){
            e.target.src = e.target.src.replace("volume.webp", "mute.webp")
            currentsong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else{
            e.target.src = e.target.src.replace("mute.webp", "volume.webp")
            currentsong.volume = .10;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }

    })


    

}

main();




