console.log("Runingg.....js")
let currentSong = new Audio();
let songs;

const headers = {'Content-Type':'application/json',
                    'Access-Control-Allow-Origin':'*',
                    'Access-Control-Allow-Methods':'POST,PATCH,OPTIONS'}
const response = {
    statusCode: 200,
    headers:headers,
    body: JSON.stringify("songs"),
}
// return response;

const playMusic = (track, pause=false)=>{
    currentSong.src = `/${currentFolder}/` + track
    if(!pause){
        currentSong.play()
        play.src = "svgs/pause.svg"
    }
    
    document.querySelector(".songinfo").innerHTML =decodeURI(track) 
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}


function formatTime(seconds) {
    if (isNaN(seconds)|| seconds < 0){
        return "00:00";
    }
    // Calculate the minutes and remaining seconds
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds =  Math.floor(seconds % 60);
    
    // Format the remaining seconds to always have two digits
    const formattedSeconds = remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds;

    // Combine minutes and formatted seconds
    return `${minutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
    currentFolder = folder
    // let a = await fetch(`/${folder}/`)
    let a = await fetch(`http://127.0.0.1:3000/${folder}/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    songs = [];

    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            let url = element.href;
            let part1 = url.split(`/${currentFolder}/`)[1];
            songs.push(part1);
            
        }
    }
     // SHow all the songs in the playlist
     let songUL = document.querySelector(".songList ul");
     songUL.innerHTML = "";
 
     let songHTML = "";
     for (const song of songs) {
         songUL.innerHTML += `<li>
             <div class="songPlay">
             <img src="svgs/music.svg">
                  <div class="info">
                 
                 <div>${song.replaceAll("%20", " ")}</div>
                     
                 </div>
                     <div class="playNow">
                         <h6>Play Now</h6>
                         <img src="svgs/play-grey.svg">
                        
                     </div>
             </div>
         </li>`;
     }
      // Attach an event listener to each song
      Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click",element=>{
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
            
            

        })
    })
     return songs;
}

async function main(){
    // Getting the list of all the songs
    await getSongs("songs/happy");
    console.log(songs);
    playMusic(songs[0],true)

     // Attach an event listener to play 
     play.addEventListener("click",()=>{
        if(currentSong.paused){
            currentSong.play()
            play.src = "svgs/pause.svg"
        }
        else{
            currentSong.pause()
            play.src = "svgs/play.svg"
            
        }
    })
    // Event listener for prev 
    prev.addEventListener("click", ()=>{
        currentSong.pause()
        console.log("play prev")
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if((index-1)>= 0){
            playMusic(songs[index-1])
        }
    })
    // Event listener for next
    next.addEventListener("click", ()=>{
        currentSong.pause()
        console.log("Next playing")
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if((index+1) <songs.length){
            playMusic(songs[index+1])
        }
       
    })
}
main()
