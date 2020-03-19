import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)


export default new Vuex.Store({
  state: {
    songs: [],
    genres: [],
    artists: [],
    open: false,
    playlist: [],
  },
  mutations: {
    openMenu(state) {
      state.open = true;
    },
    closeMenu(state) {
      state.open = false;
    },
    toggleMenu(state) {
      state.open = !state.open;
    },
  },
  actions: {
    openMenu(store) {
      store.commit('openMenu')
    },
    closeMenu(store) {
      store.commit('closeMenu')
    },
    toggleMenu(store) {
      store.commit('toggleMenu')
    },
    loadSongs(store) {
      return new Promise((resolve, reject) => {
        axios.get('https://api.your-music-player.com/songs/list').then((response) => {
          if (response.data.success) {
            store.state.songs = response.data.list;
            store.state.genres = response.data.genres;
            store.state.artists = response.data.artists;
            resolve(store.state)
          }
        })
        .catch(error => {
           reject(error)
        });
      })
    },
    playSong(store, { song, cancelAdding }) {
      return new Promise((resolve)=> {
        if (!cancelAdding) store.dispatch("addSong", { song }).catch(()=>{});
        if (store.state.songs.find(s=>s.playing&&s.id!==song.id)) {
          store.state.songs.find(s=>s.playing&&s.id!==song.id).playing = false;
        }
        song.playing = !song.playing;
        if (song.playing) {
          document.title = "Playing: " + song.filename + ' by ' + (song.artist||[]).join('; ');
          if(Notification.permission == "granted") {
            var n = new Notification((song.artist||[]).join('; '), {
              icon: song.albumurl || 'https://api.your-music-player.com/img/a2.png',
              body: song.filename
            });
            setTimeout(n.close.bind(n), 4000);
          }
        } else {
          document.title = "";
        }
        resolve(song);
      });
    },
    likeSong(store, { song }) {
      song.like = !song.like;
    },
    addSong(store, { song }) {
      return new Promise((resolve, reject) => {
        let index = store.state.playlist.find(s => s.id == song.id);
        if (index === undefined || index == -1) {
          store.state.playlist.push(song);
          resolve(song);
        } else {
          reject(song);
        }
      });
    },
    removeSong(store, { song }) {
      return new Promise((resolve) => {
        let index = store.state.playlist.findIndex(s => s.id == song.id);
        if (index !== undefined && index != -1) {
          store.state.playlist.splice(index, 1);
          resolve();
        }
      })
    },
    loadSong(store, { id }) {
      return new Promise(resolve => {
        axios.get('https://api.your-music-player.com/songs/' + id).then((response) => {
          if (response.data.success) {
            resolve(response.data);
          }
        })
      })
    },
    findData(store, { song } ) {
      return new Promise(resolve => {
        let requestAudios = new Array();
        (song.artist||[]).forEach(s => {
          requestAudios.push(axios.get('http://ws.audioscrobbler.com/2.0/', {
            params: {
              "method": "track.getInfo",
              "api_key": "ed3f6345c0413625687fdb95191bb452",
              "artist": (s||'').trim(),
              "track": (song.filename||'').trim(),
              "format": "json",
              "autocorrect": 1
            }
          }))
        })
        axios.all(requestAudios).then((r)=>{
          resolve(r);
        }).catch(()=>{
          
        }).then(()=> {})
      });
    },
    findArtist(store, { song }) {
      return new Promise(resolve => {
        let requestAudios = new Array();
        (song.artist||[]).forEach(s => {
          requestAudios.push(axios.get('http://ws.audioscrobbler.com/2.0/', {
            params: {
              "method": "artist.getInfo",
              "api_key": "ed3f6345c0413625687fdb95191bb452",
              "artist": (s||'').trim(),
              "format": "json",
              "autocorrect": 1
            }
          }))
        })
        axios.all(requestAudios).then((r)=>{
          resolve(r);
        }).catch(()=>{
          
        }).then(()=> {})
      })
    },
    findAlbum(store, { song }) {
      return new Promise(resolve => {
        let requestAudios = new Array();
        (song.artist||[]).forEach(s => {
          requestAudios.push(axios.get('http://ws.audioscrobbler.com/2.0/', {
            params: {
              "method": "album.getInfo",
              "api_key": "ed3f6345c0413625687fdb95191bb452",
              "artist": (s||'').trim(),
              "album": (song.album||'').trim(),
              "format": "json",
              "autocorrect": 1
            }
          }))
        })
        axios.all(requestAudios).then((r)=>{
          resolve(r);
        }).catch(()=>{
          
        }).then(()=> {})
      })
    },
    refresh() {
      return new Promise(resolve => {
        axios.get('https://api.your-music-player.com/refresh').then(response => {
          if (response.data.success) {
            resolve(response.data)
          }
        })
      })
    },
    updateSong(store, { song }) {
      return new Promise(resolve => {
        axios.put('https://api.your-music-player.com/songs/' + song.id, song).then((response) => {
          if (response.data.success) {
            resolve(response.data);
          }
        })
      })
    },
    deleteSong(store, {song}) {
      return new Promise(resolve => {
        axios.delete('https://api.your-music-player.com/song/'+ song.id, {params: {}}).then((response) => {
          if (response.data.success) {
            var deletedIndex = store.state.songs.findIndex(f=>f.id == song.id);
            store.state.songs.splice(deletedIndex, 1);
            resolve(response.data);
          }
        })
      })
    },
    searchMp3(store, {filter, page}) {
      return new Promise(resolve => {
        axios.post('https://api.your-music-player.com/download', {
          filter: filter,
          page: page,
          callback: (Math.random() * 10000000000000000)
        }).then((response) => {
          resolve(eval(response.data))
        })
      })
    },
    searchLyrics(store, {filter, artist, name}) {
      return new Promise(resolve => {
        axios.get('https://api.your-music-player.com/song/lyrics?f='+filter+'&a='+artist+'&n='+name).then((response) => {
          resolve(response.data)
        })
      })
    }
  },
  getters: {
    newList(state) {
      return state.songs.slice(0).sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0, 8);
    },
    popularList(state) {
      return state.songs.slice(0).sort((a,b)=>b.no_plays-a.no_plays).slice(0,10)
    },
    randomList(state) {
      return state.songs.slice(0).sort(()=>Math.random() - Math.random()).slice(0, 12)
    },
    filterList: (state, getters) => (query, listEmpty) => {
      query = getters.clearFilter(query);
      return state.songs.slice(0).filter((is)=> {
        let filterObj = {
          filename: is.filename,
          artist: is.artist,
          genre: is.genre,
          tags: is.tags,
          file_path: is.file_path,
        };
        return (!listEmpty ? query !== '': true) && getters.clearFilter(Object.values(filterObj).join('')).indexOf(query) > -1
      })
    },
    filterByGenre: (state, getters) => (genre, query) => {
      return getters.filterList(query, true).filter((is)=> {
        return (is.genre == genre || genre == 'All' || genre == '')
      });
    },
    filterByBand: (state, getters) => (band, query) => {
      band = getters.clearFilter(band);
      return getters.filterList(query, true).filter((is)=> {
        return ((is.artist||[]).map(a=>getters.clearFilter(a)).includes(band) || band == 'all' || band == '')
      });
    },
    isMenuOpen(state) {
      return state.open;
    },
    playlist(state) {
      return state.playlist.slice(0).map(s=>{
        return {
          id: +s.id,
          url: 'https://api.your-music-player.com/song/' + s.id + '.mp3',
          name: s.filename,
          artist: (s.artist||[]).join(';'),
          cover:  s.albumurl,
          playing: s.playing,
          duration: s.duration
        }
      });
    },
    playing(state, getters) {
      return getters.playlist.find(f=>f.playing);
    },
    genresList(state) {
      return ['All'].concat(state.songs.slice(0).map(s=>s.genre).filter(f=>f&&f!=null&&f!='').filter((value, index, self) => self.indexOf(value) === index).sort());
    },
    artistsList(state, getters) {
      let list = [];
      state.songs.slice(0).forEach((s)=>{
        list = list.concat(s.artist)
      });
      return ['All'].concat(list.filter(f=>f&&f!=null&&f!='').filter((value, index, self) => self.indexOf(value) === index).sort((a,b)=> getters.clearFilter(a) >  getters.clearFilter(b) ? 1 :  getters.clearFilter(a) <  getters.clearFilter(b) ? -1:0 ));
    },
    tagList(state, getters) {
      let list = [];
      state.songs.slice(0).forEach((s)=>{
        list = list.concat(s.tags)
      });
      return ['All'].concat(list.filter(f=>f&&f!=null&&f!=''&&f!='All').filter((value, index, self) => self.indexOf(value) === index).sort((a,b)=> getters.clearFilter(a) >  getters.clearFilter(b) ? 1 :  getters.clearFilter(a) <  getters.clearFilter(b) ? -1:0 ));
    },
    clearFilter: () => (s) => {
      s = (s||'').toLowerCase().trim();
      s = s.replace(/á/g, "a").replace(/é/g, "e").replace(/í/g, "i").replace(/ó/g, "o").replace(/ú/g, "u").replace(/ý/g, "y");
      s = s.replace(/ä/g, "a").replace(/ë/g, "e").replace(/ï/g, "i").replace(/ö/g, "o").replace(/ü/g, "u").replace(/ÿ/g, "y");
      s = s.replace(/à/g, "a").replace(/è/g, "e").replace(/ì/g, "i").replace(/ò/g, "o").replace(/ù/g, "u");
      s = s.replace(/â/g, "a").replace(/ê/g, "e").replace(/î/g, "i").replace(/ô/g, "o").replace(/û/g, "u");
      s = s.replace(/'/g, "").replace(/`/g, "");
      s = s.replace(/#/g,'');
      return s;
    }
  }
})
