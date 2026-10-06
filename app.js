
const tracks = [
 {id:1,title:"African Sunrise",artist:"KMG Sessions",genre:"Afrobeat",cover:"https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=700",audio:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"},
 {id:2,title:"Kinshasa After Dark",artist:"Congo Urban",genre:"Afro",cover:"https://images.unsplash.com/photo-1506157786151-b8491531f063?w=700",audio:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"},
 {id:3,title:"Midnight Flow",artist:"Nova",genre:"R&B",cover:"https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=700",audio:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"},
 {id:4,title:"Street Poetry",artist:"Young Motion",genre:"Rap",cover:"https://images.unsplash.com/photo-1521337581100-8ca9a73a5f79?w=700",audio:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"},
 {id:5,title:"Grace",artist:"Faith Voices",genre:"Gospel",cover:"https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=700",audio:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3"},
 {id:6,title:"Electric Horizon",artist:"Neon District",genre:"Electro",cover:"https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=700",audio:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3"},
 {id:7,title:"Congo Love",artist:"Maya B",genre:"Rumba",cover:"https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=700",audio:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3"},
 {id:8,title:"Amapiano Nights",artist:"Luna Africa",genre:"Amapiano",cover:"https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=700",audio:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3"},
 {id:9,title:"Golden Memories",artist:"The Collective",genre:"Pop",cover:"https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=700",audio:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3"}
];

let current = -1;
const audio = document.getElementById("audio-player");
const titleEl = document.getElementById("player-title");
const artistEl = document.getElementById("player-artist");
const coverEl = document.getElementById("player-cover");
const playBtn = document.getElementById("play-button");
const seek = document.getElementById("seek-bar");
const curr = document.getElementById("current-time");
const dur = document.getElementById("duration");
const volume = document.getElementById("volume-bar");
const statusEl = document.getElementById("player-status");

function fmt(s){if(!Number.isFinite(s)) return "0:00";const m=Math.floor(s/60),r=Math.floor(s%60);return `${m}:${String(r).padStart(2,"0")}`}

function loadTrack(index, autoplay=true){
  if(index<0||index>=tracks.length) return;
  current=index; const t=tracks[index];
  audio.pause();
  audio.src=t.audio;
  audio.load();
  coverEl.src=t.cover; titleEl.textContent=t.title; artistEl.textContent=t.artist;
  if(statusEl) statusEl.textContent="Chargement...";
  seek.value=0; curr.textContent="0:00"; dur.textContent="0:00";
  if(autoplay) audio.play().catch(()=>{if(statusEl) statusEl.textContent="Cliquez sur lecture";});
}
function togglePlay(){
  if(current===-1){loadTrack(0,true);return}
  if(audio.paused) audio.play().catch(()=>{}); else audio.pause();
}
function nextTrack(){loadTrack((current+1+tracks.length)%tracks.length,true)}
function prevTrack(){loadTrack((current-1+tracks.length)%tracks.length,true)}
function renderTracks(){
  document.querySelectorAll("[data-track-grid]").forEach(grid=>{
    grid.innerHTML="";
    tracks.forEach((t,i)=>{
      const c=document.createElement("article");
      c.className="track-card";
      c.innerHTML=`<img src="${t.cover}" alt="${t.title}" loading="lazy"><h3>${t.title}</h3><p>${t.artist} · ${t.genre}</p>`;
      c.addEventListener("click",()=>loadTrack(i,true));
      grid.appendChild(c);
    });
  });
}
audio.addEventListener("loadstart",()=>{if(statusEl) statusEl.textContent="Chargement..."});
audio.addEventListener("waiting",()=>{if(statusEl) statusEl.textContent="Mise en mémoire..."});
audio.addEventListener("canplay",()=>{if(statusEl) statusEl.textContent="Prêt"});
audio.addEventListener("playing",()=>{if(statusEl) statusEl.textContent="Lecture"});
audio.addEventListener("pause",()=>{if(statusEl&&current>=0) statusEl.textContent="Pause"});
audio.addEventListener("error",()=>{if(statusEl) statusEl.textContent="Audio indisponible"});
audio.addEventListener("loadedmetadata",()=>{dur.textContent=fmt(audio.duration)});
audio.addEventListener("timeupdate",()=>{
  curr.textContent=fmt(audio.currentTime); dur.textContent=fmt(audio.duration);
  if(Number.isFinite(audio.duration)&&audio.duration>0) seek.value=(audio.currentTime/audio.duration)*100;
});
audio.addEventListener("ended",nextTrack);
playBtn?.addEventListener("click",togglePlay);
document.getElementById("next-button")?.addEventListener("click",nextTrack);
document.getElementById("previous-button")?.addEventListener("click",prevTrack);
seek?.addEventListener("input",()=>{if(Number.isFinite(audio.duration)) audio.currentTime=(Number(seek.value)/100)*audio.duration});
if(volume){audio.volume=.75;volume.addEventListener("input",()=>audio.volume=Number(volume.value)/100)}
document.getElementById("search-input")?.addEventListener("input",e=>{
  const q=e.target.value.trim().toLowerCase();
  document.querySelectorAll(".track-card").forEach(card=>{
    card.style.display=card.textContent.toLowerCase().includes(q)?"":"none";
  });
});
renderTracks();
