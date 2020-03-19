<template>
  <div class="aplayer aplayer-withlist aplayer-loading">
    <div class="aplayer-body">
      <div class="aplayer-pic" :style="{'background-image': 'url(&quot;'+currentSong.albumurl + '&quot;)'}">
        <div class="aplayer-button aplayer-play" v-on:click.stop.prevent="playPause">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 31" class="" v-if="!currentSong.playing">
            <path d="M15.552 15.168q.448.32.448.832 0 .448-.448.768L1.856 25.28q-.768.512-1.312.192T0 24.192V7.744q0-.96.544-1.28t1.312.192z"></path>
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 32" class="" v-if="currentSong.playing">
            <path d="M14.08 4.8q2.88 0 2.88 2.048v18.24q0 2.112-2.88 2.112t-2.88-2.112V6.848q0-2.048 2.88-2.048zm-11.2 0q2.88 0 2.88 2.048v18.24q0 2.112-2.88 2.112T0 25.088V6.848Q0 4.8 2.88 4.8z"></path>
          </svg>
        </div>
      </div>
      <div class="aplayer-info">
        <div class="aplayer-music" @click.stop.prevent="goToSong">
          <span class="aplayer-title">{{currentSong.filename}}</span>
          <span class="aplayer-author" v-if="currentSong.artist">By {{currentSong.artist|artistTags}}</span>
        </div>
        <div class="aplayer-lrc">
          <div class="aplayer-lrc-contents" style="transition-duration: 0ms; transform: translate3d(0px, 0px, 0px);">
            <p class="aplayer-lrc-current"></p>
          </div>
        </div>
        <div class="aplayer-controller">
          <div class="aplayer-bar-wrap" style="touch-action: none; user-select: none; -webkit-user-drag: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0);">
            <div class="aplayer-bar" v-on:click.stop.prevent="seekTrack">
              <div class="aplayer-loaded" style="width: 0%;"></div>
              <div class="aplayer-played" :style="{width: (song.currentTime*100)/currentSong.duration + '%'}"></div>
            </div>
          </div>
          <div class="aplayer-time">
            <span class="aplayer-time-inner">
              <span class="aplayer-ptime">{{song.currentTime|durationMin}}</span> / <span class="aplayer-dtime">{{currentSong.duration|durationMin}}</span> 
            </span>
            <span class="aplayer-icon aplayer-icon-back">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" class="">
                <path d="M25.468 6.947a1.004 1.004 0 0 0-1.03.057L18 11.384V7.831a1.001 1.001 0 0 0-1.562-.827l-12 8.164a1 1 0 0 0 0 1.654l12 8.168A.999.999 0 0 0 18 24.164v-3.556l6.438 4.382A.999.999 0 0 0 26 24.164V7.831c0-.371-.205-.71-.532-.884z"></path>
              </svg>
            </span>
            <span class="aplayer-icon aplayer-icon-play">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 31" class="">
                <path d="M15.552 15.168q.448.32.448.832 0 .448-.448.768L1.856 25.28q-.768.512-1.312.192T0 24.192V7.744q0-.96.544-1.28t1.312.192z"></path>
              </svg>
            </span>
            <span class="aplayer-icon aplayer-icon-forward">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" class="">
                <path d="M25.468 6.947a1.004 1.004 0 0 0-1.03.057L18 11.384V7.831a1.001 1.001 0 0 0-1.562-.827l-12 8.164a1 1 0 0 0 0 1.654l12 8.168A.999.999 0 0 0 18 24.164v-3.556l6.438 4.382A.999.999 0 0 0 26 24.164V7.831c0-.371-.205-.71-.532-.884z"></path>
              </svg>
            </span>
            <div class="aplayer-volume-wrap">
              <button type="button" class="aplayer-icon aplayer-icon-volume-down" v-on:click.stop.prevent="audio.muted=!audio.muted">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 32" class="">
                  <path d="M13.728 6.272v19.456q0 .448-.352.8t-.8.32-.8-.32l-5.952-5.952H1.152q-.48 0-.8-.352t-.352-.8v-6.848q0-.48.352-.8t.8-.352h4.672l5.952-5.952q.32-.32.8-.32t.8.32.352.8zM20.576 16q0 1.344-.768 2.528t-2.016 1.664q-.16.096-.448.096-.448 0-.8-.32t-.32-.832q0-.384.192-.64t.544-.448.608-.384.512-.64.192-1.024-.192-1.024-.512-.64-.608-.384-.544-.448-.192-.64q0-.48.32-.832t.8-.32q.288 0 .448.096 1.248.48 2.016 1.664T20.576 16z"></path>
                </svg>
              </button>
              <div class="aplayer-volume-bar-wrap" style="touch-action: none; user-select: none; -webkit-user-drag: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0);">
                <div class="aplayer-volume-bar" v-on:click.prevent.stop="seekVolume">
                  <div class="aplayer-volume" :style="{width: (audio.volume * 100) +'%'}"></div>
                </div>
              </div>
            </div> 
            <button type="button" class="aplayer-icon aplayer-icon-order" v-on:click.stop.prevent="shuffle=!shuffle">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" class="" v-if="!shuffle">
                <path d="M.622 18.334h19.54v7.55l11.052-9.412-11.052-9.413v7.549H.622v3.725z"></path>
              </svg>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" class="" v-if="shuffle">
                <path d="M22.667 4l7 6-7 6 7 6-7 6v-4h-3.653l-3.76-3.76 2.827-2.827L20.668 20h2v-8h-2l-12 12h-6v-4h4.347l12-12h3.653V4zm-20 4h6l3.76 3.76L9.6 14.587 7.013 12H2.666V8z"></path>
              </svg>
            </button> 
            <button type="button" class="aplayer-icon aplayer-icon-loop" v-on:click.stop.prevent="changeRepeat">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 29 32" class="" v-if="repeat=='all'">
                <path d="M9.333 9.333h13.333v4L27.999 8l-5.333-5.333v4h-16v8h2.667V9.334zm13.334 13.334H9.334v-4L4.001 24l5.333 5.333v-4h16v-8h-2.667v5.333z"></path>
              </svg>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 33 32" class="" v-if="repeat=='one'">
                <path d="M9.333 9.333h13.333v4L27.999 8l-5.333-5.333v4h-16v8h2.667V9.334zm13.334 13.334H9.334v-4L4.001 24l5.333 5.333v-4h16v-8h-2.667v5.333zM17.333 20v-8H16l-2.667 1.333v1.333h2v5.333h2z"></path>
              </svg>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 29 32" class="" v-if="repeat=='none'">
                <path d="M2.667 7.027l1.707-1.693 22.293 22.293-1.693 1.707-4-4H9.334v4l-5.333-5.333 5.333-5.333v4h8.973l-8.973-8.973v.973H6.667v-3.64l-4-4zm20 10.306h2.667v5.573l-2.667-2.667v-2.907zm0-10.666v-4L28 8l-5.333 5.333v-4H11.76L9.093 6.666h13.573z"></path>
              </svg>
            </button> 
            <button type="button" class="aplayer-icon aplayer-icon-menu" v-on:click.prevent.stop="list.open=!list.open;" v-if="playlist.length > 1">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 32" class="">
                <path d="M20.8 14.4q.704 0 1.152.48T22.4 16t-.48 1.12-1.12.48H1.6q-.64 0-1.12-.48T0 16t.448-1.12T1.6 14.4h19.2zM1.6 11.2q-.64 0-1.12-.48T0 9.6t.448-1.12T1.6 8h19.2q.704 0 1.152.48T22.4 9.6t-.48 1.12-1.12.48H1.6zm19.2 9.6q.704 0 1.152.48t.448 1.12-.48 1.12-1.12.48H1.6q-.64 0-1.12-.48T0 22.4t.448-1.12T1.6 20.8h19.2z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div class="aplayer-notice" style="opacity: 0;">Failed to set the 'currentTime' property on 'HTMLMediaElement': The provided double value is non-finite.</div>
    </div>
    <ol class="aplayer-list" :class="{'open': list.open}">
      <li v-for="(p,pi) in playlist" :key="pi" v-on:click.stop.prevent="play(p)" :class="{'aplayer-list-light': p.playing}">
        <span class="aplayer-list-cur" style="background-color: rgb(183, 218, 255);"></span>
        <span class="aplayer-list-index">{{p.id}}</span> 
        <span class="aplayer-list-title">{{p.filename}}</span>
        <span class="aplayer-list-author">{{p.artist|artistTags}}</span>
        <span class="aplayer-close" v-on:click.stop.prevent="removeFromList(p)">&times;</span>
      </li>
    </ol>
    <ul v-if="currentSong.lyrics" class="lyrics-box" :class="{'lyrics-scroll': !this.runner}">
      <li class="lyric-row synqued" v-if="this.runner">
        {{ currentLyric | clearLyricRow}}
      </li>
      <li class="lyric-row synqued" v-if="!this.runner">
        {{ currentSong.lyrics }}
      </li>
    </ul>
  </div>
</template>
<script>
import { Runner, Lrc } from 'lrc-kit';

export default {
  name: 'Player',
  data: () => ({
    mouseposition: '',
    audio: new Audio(),
    song: {
      duration: 0,
      currentTime: 0,
      id: -1,
    },
    volume: localStorage.getItem('list.config.player.volume') || 1,
    list: {
      open: false
    },
    repeat: localStorage.getItem('list.config.player.repeat') || 'all',
    shuffle: false,
    runner: null,
  }),
  filters: {
    artistTags(value) {
      return (value||[]).join(', ')
    },
    clearLyricRow(value) {
      return (value||'').substring((value||'').indexOf(']') > -1 ? (value||'').indexOf(']')+1 : 0);
    },
  },
  watch:{
    volume() {
      this.audio.volume = this.volume;
      localStorage.setItem('list.config.player.volume', this.volume)
    },
    repeat() {
      localStorage.setItem('list.config.player.repeat', this.repeat)
    }
  },
  computed: {
    currentSong() {
      return this.playlist.find(p=>p.id==this.song.id) || {tag: {}};
    },
    currentIndex() {
      return this.shuffle ? this.shuffleList.findIndex(p=>p.id==this.song.id) : this.playlist.findIndex(p=>p.id==this.song.id);
    },
    playlist() {
      return this.$store.state.playlist;
    },
    shuffleList() {
      return this.playlist.slice(0).sort(()=>Math.random()-Math.random());
    },
    lyrics() {
      return ((this.currentSong||{lyrics: ''}).lyrics||'').split('\n').filter(f=>f!=='').filter(f=>/^\[[\d.]+\] [\w\W]+$/.test(f));
    },
    currentLyric() {
      try {
        if (this.runner) {
          var line = this.runner.curLyric();
          return line&&line.content;
        }
      } catch(runLyrErr) {
        return false;
      }

      return false;
    }
  },
  mounted() {
    //this.volume = 0.1;
    
    this.audio.addEventListener('timeupdate', (e) => {
      this.song.currentTime = e.target.currentTime;
      if(this.runner) this.runner.timeUpdate(this.song.currentTime);
    });
    ['ended', 'error'].forEach((sender) => {
      this.audio.addEventListener(sender, () => {
        this.currentSong.playing = false;
        if (this.repeat == "one") {
          this.playPause();
        } else if (this.repeat == 'all' || this.repeat == 'none') {
          this.playNext();
        }
      });
    });
    this.audio.addEventListener('volumechange', (e) => {
      this.volume = e.target.volume;
    });
  },
  methods: {
    seekTrack(e) {
      var rect = e.target.getBoundingClientRect();
      var x = e.clientX - rect.left; //x position within the element.
      // var y = e.clientY - rect.top;  //y position within the element.

      this.audio.currentTime = (((x * 100)/rect.width) * this.currentSong.duration) / 100;
    },
    seekVolume(e) {
      var rect = e.target.getBoundingClientRect();
      var x = e.clientX - rect.left; //x position within the element.
      // var y = e.clientY - rect.top;  //y position within the element.

      this.volume = ((x * 100)/rect.width) / 100;
    },
    playNext() {
      if (this.playlist.length > 0) {
        if (this.currentIndex > -1 && (this.currentIndex+1) <= this.playlist.length - 1) {
          let song = this.shuffle ? this.shuffleList[this.currentIndex+1] : this.playlist[this.currentIndex+1];
          this.play(song);
        } else if (this.repeat != "none") {
          let song = this.shuffle ? this.shuffleList[0] : this.playlist[0];
          this.play(song);
        }
      }
    },
    playPrev() {
      if (this.playlist.length > 0) {
        if (this.currentIndex > -1 && (this.currentIndex-1) > 0 && (this.currentIndex-1) <= this.playlist.length - 1) {
          let song = this.shuffle ? this.shuffleList[this.currentIndex-1] : this.playlist[this.currentIndex-1];
          this.play(song);
        } else if (this.repeat != "none") {
          let song = this.shuffle ? this.shuffleList[0] : this.playlist[0];
          this.play(song);
        }
      }
    },
    changeRepeat() {
      if (this.repeat == 'all') {
        this.repeat = 'one';
      } else if (this.repeat == 'one') {
        this.repeat = 'none';
      } else {
        this.repeat = 'all';
      }
    },
    removeFromList(song) {
      this.$store.dispatch('removeSong', { song });
    },
    playPause() {
      if (!this.currentSong.id && this.playlist.length > 0) {
        this.playNext();
      } else if (this.playlist.length > 0) {
        if (!this.audio.paused && !this.audio.ended) {
          this.audio.pause();
          this.currentSong.playing = false;
        } else {
          this.audio.play();
          this.currentSong.playing = true;
        }
      }
    },
    play(song) {
      if (song.id) {
        if (this.song.id != song.id) {
          this.audio.src = 'https://api.your-music-player.com/song/' + song.id + '.mp3';
          this.audio.load();
          
          this.audio.play();
          this.song.id = song.id;

          this.$store.dispatch('playSong', {song, cancelAdding: true }).then(() => {
            //document.querySelector('.aplayer-list-light')&&document.querySelector('.aplayer-list-light').scrollIntoView();
            this.runner = new Runner(Lrc.parse(((this.currentSong||{lyrics: ''}).lyrics||'')));
          });
        } else {
          this.playPause();
        }
      }
    },
    goToSong() {
      if (this.currentSong.id) {
        this.$router.push({ path: `/songs/${this.currentSong.id}` })
      }
    }
  }
}
</script>

<style lang="scss" >
  div.aplayer {
    overflow: visible;
    margin: 0;
    background: transparent;
    box-shadow: none;
    border-radius: 0;

    .aplayer-list {
      position: absolute;
      top: 0;
      max-width: 30%;
      width: 100%;
      transform: translate(30%, -101%);
      background: #405161;
      border: 0;
      border-radius: 0;
      height: auto;
      max-height: 0px;
      &.open {
        max-height: 250px;
      }
      li {
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        height: 36px;
        line-height: normal;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: row;
        padding: 3px;
        margin: 0;
        .aplayer-list-index {
          color: #c9d0d7;
        }
        span {
          &.aplayer-list-index {
            color: transparent;
            font-size: 0px;
            margin: 0;
            flex: 0 0 auto;
          }
          &.aplayer-list-index:before {
            display: inline-block;
            text-align: center;
            width: 30px;
            font-family: FontAwesome;
            content: "\f0da";
            opacity: 0.6;
            font-size: 14px;
            color: #e6eaed;
          }

          &.aplayer-list-title {
            color: #e6eaed;
            flex: 0 1 auto;
          }
          &.aplayer-list-author {
            color: #e6eaed;
            float: none;
            opacity: 0.6;
            flex: 1 1 auto;
          }

          &.aplayer-list-author:before {
            content: ' by ';
            padding-left: 6px;
          }
          &.aplayer-list-cur {
            background-color: transparent !important;
          }
          &.aplayer-close {
            float: right;
            display: flex;
            align-items: center;
            justify-content: center;
            flex: 0 1 auto;
            height: 30px;
            width: 30px;
          }
        }
        &:hover {
          background: #515f6d;
          span.aplayer-close {
            &:hover {
              background: #707b86;
            }
          }
        } 
        &.aplayer-list-light {
          background: #515f6d;
          span.aplayer-list-title, span.aplayer-list-index, span.aplayer-list-author {
            color: #e6eaed;
          }

          span.aplayer-list-index:before {
            content: "\f144";
            opacity: 1;
          }
        }
      }

      &::-webkit-scrollbar {
        width:10px;
      }
    }

    .aplayer-body {
      display: flex;
      .aplayer-info {
        height: 56px;
        position: relative;
        display: inline-block;
        border-bottom: none;
        margin-left: 0;
        padding: 0;
        flex: 1 1 auto;
        display: flex;
        flex-flow: column wrap;
        align-items: center;
        .aplayer-music {
          overflow: visible;
          white-space: normal;
          text-overflow: unset;
          margin: 0;
          padding-bottom: 0;
          height: auto;
          position: relative;
          z-index: 10;
          flex: 1 0 auto;
          display: flex;
          flex-direction: row;
          align-items: center;
          cursor: pointer;
          .aplayer-title {
            color: #fff;
          }
          .aplayer-author {
            font-size: 14px;
            margin-left: 0px;
            display: block;
            color: #fff;
            opacity: 0.6;
            margin-left: 6px;
          }
        }
        .aplayer-controller {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          .aplayer-bar-wrap {
            margin: 0;
            padding: 0;
            overflow: hidden;
            .aplayer-bar {
              height: 100%;
              background-color: #4d5d6e;
              .aplayer-loaded {
                height: 100%;
                opacity: 0.6;
              }
              .aplayer-played {
                height: 100%;
                background-color: #4cb6cb !important;
              }
            }
          }
          .aplayer-time {
            right: auto;
            bottom: auto;
            height: auto;
            flex: 0 0 auto;
            display: flex;
            flex-direction: row;
            padding: 5px;
            align-items: center;
            > * {
              padding-left: 10px;
              padding-right: 10px;
              margin: 0;
              color: #acb7c1 !important;
              font-size: 12px;
              opacity: 1;
            }
            .aplayer-volume-wrap {
              display: flex;
              flex-direction: row;
              align-items: center;
              flex: 1 1 auto;
              width: 50px;
              .aplayer-icon {
                &.aplayer-icon-volume-down {
                  flex: 0 1 auto;
                }
              }
              .aplayer-volume-bar-wrap {
                flex: 0 0 auto;
                position: relative;
                bottom: auto;
                right: auto;
                height: 5px;
                width: 35px;
                .aplayer-volume-bar {
                  bottom: auto;
                  right: auto;
                  border-radius: 0;
                  background-color: #4d5d6e;
                  position: relative;
                  width: 35px;
                  height: 5px;
                  .aplayer-volume {
                    background-color: #778490 !important;
                    position: relative;
                    bottom: auto;
                    right: auto;
                    height: 5px;
                  }
                }
              }
            }
            .aplayer-icon {
              path {
                font-size: 12px;
                opacity: 1;
                  fill: #97a4af !important;
              }
              &:hover {
                path {
                fill: #acb7c1 !important;
                }
              }
            }
          }
        }
      }
      .aplayer-pic {
        height: 56px;
        width: 56px;
        float: none;
        display: inline-block;
        vertical-align: bottom;
        flex: 0 0 auto;
      }
    }
    .lyrics-box {
      position: absolute;
      bottom: 56px;
      right: 0;
      background-color: #5a6a7a9e;
      height: 100px;
      width: 350px;
      padding: 0;
      margin: 0;
      list-style: none;
      overflow: hidden;
      li {
        display: none;
        text-align: center;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        color: #fff;
        font-weight: 600;
        font-size: 1.4em;
        &.lyric-row.synqued {
          display: block;
        }
      }
      &.lyrics-scroll {
        overflow-y: scroll;
        padding: 15px;
        box-sizing: border-box; 
        li {
          transform: none;
          top: 0;
          left: 0;
          position: relative;
        }
      }
    }
  }
</style>