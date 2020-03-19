<template>
  <section class="scrollable w-f-md" v-if="song">
    <loading :active.sync="isLoading" :can-cancel="true" :is-full-page="true">
      <img src="img/icons/loadingMusic.svg" />
    </loading>
    <section class="hbox stretch">
      <aside class="aside-lg bg-light lter b-r">
        <section class="vbox">
          
          <section class="scrollable">
            <div class="wrapper">
              <div class="text-center m-b m-t">
                <a href="#" class="" v-bind:class="{'hide': song.albumurl == '' || song.albumurl == null}">
                  <img v-bind:src="song.albumurl" class="" style="width: 100%;">
                </a>
                <div>
                  <div class="h3 m-t-xs m-b-xs">{{song.filename}}</div>
                  <small class="text-muted">
                    <i class="fa fa-music"></i>
                    {{song.artist | artistTags}}
                  </small>
                </div>
              </div>
              <div class="panel wrapper">
                <div class="row text-center">
                  <div class="col-xs-6">
                    <a href="#">
                      <span class="m-b-xs h4 block">{{song.no_plays}}</span>
                      <small class="text-muted">Plays</small>
                    </a>
                  </div>
                  <div class="col-xs-6">
                    <a href="#">
                      <span class="m-b-xs h4 block">{{song.rating}}</span>
                      <small class="text-muted">Rating</small>
                    </a>
                  </div>
                </div>
              </div>
              <div class="btn-group btn-group-justified m-b">
                <a class="btn btn-info btn-rounded" v-on:click.stop.prevent="song.like=!(song.like == '1')" >
                  <span class="text">
                    <i class="text-danger fa" v-bind:class="{'fa-heart-o': !song.like, 'fa-heart': song.like}"></i>
                    Like 
                  </span>
                </a>
                <a class="btn bg-primary lt btn-rounded" v-on:click.stop.prevent="play(song)" >
                  <i class="fa" v-bind:class="{'fa-pause': song.playing, 'fa-play': !song.playing}"></i>
                  Play 
                </a>
              </div>
              <div>
                <small class="text-uc text-xs text-muted">Artist</small>
                <p>{{song.artist | artistTags}}</p>
                <small class="text-uc text-xs text-muted">Album</small>
                <p>{{song.album}}</p>
                <small class="text-uc text-xs text-muted">Genre</small>
                <p>{{song.genre}}</p>
                <small class="text-uc text-xs text-muted">Duration</small>
                <p>{{song.duration|durationMin}}</p>
                <small class="text-uc text-xs text-muted">Size</small>
                <p>{{song.size|filesize}}</p>
                <small class="text-uc text-xs text-muted" v-if="song.tags">Tags</small>
                <p>
                  <router-link v-for="(t,ti) in song.tags" :key="ti" :to="'/songs/tags/'+t" class="badge m-r-xs">#{{t}}</router-link>
                </p>
                <small class="text-uc text-xs text-muted">Path</small>
                <p :class="{'text-danger': repeatedSong}">{{songPath}}</p>
                <dfn v-if="repeatedSong" class="help-block small text-info">
                  Repeated song
                  <button class="btn btn-info btn-rounded btn-xs" @click.stop.prevent="playRepeated()"><i class="fa fa-play"></i></button>
                </dfn>
                <div class="line"></div>
                <div class="btn-group" style="width: 100%;display: flex;">
                  <button type="submit" class="btn btn-sm btn-primary" @click.stop.prevent="saveSong()" v-if="canSave" style="flex: 1;">
                    <i class="fa fa-save"></i>
                    &nbsp;&nbsp;&nbsp;Save Changes
                  </button>
                  <button type="submit" class="btn btn-sm btn-danger" @click.stop.prevent="deleteSong()" style="flex: 1">
                    <i class="glyphicon glyphicon-trash"></i>
                    &nbsp;&nbsp;&nbsp;Delete Song
                  </button>
                </div>
              </div>
            </div>
          </section>
        </section>
      </aside>
      <aside>
        <section class="vbox">
          <tabs :options="{ useUrlFragment: false }" >
            <tab name="Info">
              <div class="row">
                <div class="col-md-12">
                  <section class="panel panel-default"> 
                    <header class="panel-heading font-bold">Song info</header> 
                    <div class="panel-body"> 
                      <form role="form"> 
                        <div class="form-group"> 
                          <label>Name</label> 
                          <input type="text" class="form-control" placeholder="" v-model="song.filename"/> 
                        </div>
                        <div class="form-group"> 
                          <label>Artist</label>
                          <md-autocomplete ref="artistAutocomplete" v-model="songArtist" :md-options="artistResult" @md-changed="getArtists" @md-opened="getArtists" @md-selected="setArtist"></md-autocomplete>
                        </div>
                        <div class="form-group"> 
                          <label>Album</label> 
                          <input type="text" class="form-control" placeholder="" v-model="song.album"> 
                        </div>
                        <div class="form-group"> 
                          <label>Genre</label>
                          <md-autocomplete v-model="song.genre" :md-options="genresList">
                          </md-autocomplete>
                        </div>
                        <div class="form-group"> 
                          <label>No. Track</label> 
                          <input type="number" min="0" class="form-control" placeholder="" v-model="song.track_number"> 
                        </div>
                      </form>
                    </div> 
                  </section>
                </div>
              </div>
              <div class="row">
                <div class="col-md-12">
                  <section class="panel panel-default"> 
                    <header class="panel-heading font-bold">More info</header> 
                    <div class="panel-body"> 
                      <form role="form"> 
                        <div class="checkbox i-checks"> 
                          <label> 
                            <input type="checkbox" v-model="song.like"><i></i> Like 
                          </label> 
                        </div>
                        <div class="form-group">
                          <label>Tags</label>
                          <multiselect v-model="song.tags" :options="tags" :multiple="true" :clear-on-select="false" :close-on-select="false"  :searchable="true" :hide-selected="true" :taggable="true" @tag="addTag">
                            
                          </multiselect>
                        </div>
                        <div class="form-group"> 
                          <label>Rating</label> 
                          <star-rating v-model="song.rating" :star-size="20" :show-rating="false" :round-start-rating="false" :increment="0.5"></star-rating>
                        </div>
                        <div class="form-group"> 
                          
                        </div>

                      </form>
                    </div> 
                  </section>
                </div>
              </div>
            </tab>
            <tab name="Lyrics" ref="tabLyrics">
              <div class="row">
                <div class="col-md-12">
                  <section class="panel panel-default" :class="{'sync': isSync}"> 
                    <header class="panel-heading font-bold">
                      Lyrics
                      <i class="fa fa-download pull-right btn btn-default m-t-n-xs" @click.stop.prevent="searchLyrics()"></i>
                      <i class="fa fa-exchange pull-right btn btn-default m-t-n-xs" @click.stop.prevent="startSync()"></i>
                      <span v-if="isSync" class="pull-right small">{{currentTime | durationMin}}</span>
                    </header> 
                    <div class="panel-body"> 
                      <form role="form"> 
                        <div class="form-group"> 
                          <label></label>
                          <textarea class="form-control" v-model="song.lyrics" style="min-height: 500px" v-if="!isSync" /> 
                          <template v-if="isSync">
                            <div v-for="(row_text, row_index) in lyrics" :key="row_index" class="row-song" @click.stop.prevent="syncThisRow(row_text, row_index, $event)" @contextmenu.prevent.stop="desyncThisRow(row_text, row_index)" :class="{'synqued': isSyncThisRow(row_text)}">
                              <span class="small pull-left">{{ row_text | showTimeRow }}</span>
                              {{ row_text | clearLyricRow}}
                            </div>
                          </template>
                        </div>
                      </form>
                    </div>
                  </section>
                </div>
              </div>
            </tab>
          </tabs>
        </section>
      </aside>
      <aside class="col-lg-3 b-l">
        <section class="vbox">
          <section class="scrollable padder-v">
            <div class="panel">
              <h4 class="font-thin padder">
                Audio Scrobbler Results <i class="icon-refresh i-fw pull-right" @click="findData"></i>
              </h4>
              <ul class="list-group">
                <li class="list-group-item" v-for="(a, ai) in audioResults" :key="ai" >
                  <img :src="a.albumurl" alt="" class="pull-left thumb m-xxs" v-if="a.albumurl&&a.albumurl!=''"/>
                  
                  <md-menu md-size="medium" md-align-trigger class=" pull-right">
                    <i class="fa fa-ellipsis-v i-fw" md-menu-trigger></i>

                    <md-menu-content>
                      <md-menu-item @click="downloadImage(a)" v-if="a.albumurl&&a.albumurl!=''"><i class="icon-cloud-download"></i> Image album</md-menu-item>
                      <md-menu-item @click="downloadName(a)" v-if="a.name&&a.name!=''&&a.type=='track'"><i class="icon-cloud-download"></i> Song name</md-menu-item>
                      <md-menu-item @click="downloadArtist(a)" v-if="a.name&&a.name!=''&&a.type=='artist'"><i class="icon-cloud-download"></i> Song artist</md-menu-item>
                      <md-menu-item @click="downloadArtist(a)" v-if="a.artist&&a.artist!=''"><i class="icon-cloud-download"></i> Song artist</md-menu-item>
                      <md-menu-item @click="downloadAlbum(a)" v-if="a.album&&a.album!=''&&a.type=='track'"><i class="icon-cloud-download"></i> Song album</md-menu-item>
                      <md-menu-item @click="downloadAlbum(a)" v-if="a.name&&a.name!=''&&a.type=='album'"><i class="icon-cloud-download"></i> Song album</md-menu-item>
                      <md-menu-item @click="downloadTags(a)" v-if="a.tags&&a.tags.length>0"><i class="icon-cloud-download"></i> Song tags</md-menu-item>
                      <md-menu-item @click="downloadAll(a)" v-if="audioResultHaveSomething(a)"><i class="icon-cloud-download"></i> All</md-menu-item>
                      <md-menu-item @click="downloadFill(a)" v-if="audioResultHaveSomething(a)"><i class="icon-cloud-download"></i> Fill</md-menu-item>
                    </md-menu-content>
                  </md-menu>
                  <div v-if="a.type=='track'">
                    {{a.name}} by {{a.artist}}
                  </div> 
                  <div v-if="a.type=='artist'||a.type=='album'">
                    {{a.name}}
                  </div> 
                  <small class="block text-muted" v-if="a.type=='track'">
                    <div>{{a.album}}</div>
                    <i class="fa fa-clock-o"></i> {{a.duration | durationMin}}
                    <div>
                      <a v-for="(t,ti) in a.tags" :key="ti" class="badge m-r-xs" v-bind:href="'/songs/tags/'+t">#{{t}}</a>
                    </div>
                  </small>
                  <small class="block text-muted" v-if="a.type=='artist'||a.type=='album'">
                    <div>
                      <router-link v-for="(t,ti) in a.tags" :key="ti" :to="'/songs/tags/'+t" class="badge m-r-xs">#{{t}}</router-link>
                    </div>
                  </small>
                  <div class="col-0"></div>
                </li>
              </ul>
            </div>
            <div class="panel clearfix hidden">
              <div class="panel-body"> <a href="#" class="thumb pull-left m-r"> <img src="images/a0.png" class="img-circle"> </a>
                <div class="clear"> <a href="#" class="text-info">@Mike Mcalidek <i class="fa fa-twitter"></i></a> <small class="block text-muted">2,415 followers / 225 tweets</small> <a href="#" class="btn btn-xs btn-success m-t-xs">Follow</a> </div>
              </div>
            </div>
          </section>
        </section>
      </aside>
    </section>
  </section>
</template>
<script>
import { Lrc } from 'lrc-kit';

export default {
  name: 'Detalles',
  components: {},
  data: () => ({
    song: {
      filename: '',
      tags: [],
      genre: '',
      artist: [],
      size: 0,
      albumurl: '',
      album: '',
      duration: 0,
      file_path: '',
      id: '',
      like: false,
      lyrics: '',
      date: '',
      no_plays: '',
      rating: 0,
      filter: '',
      track_number: '',
      year: 1900,
      updated: false,
    },
    saving: false,
    responseStatus: false,
    tags: [],
    audioResults: [],
    artistResult: [],
    options: [{ name: 'Info', selected: true }, { name: 'Songs', selected: false }, { name: 'Lyrics', selected: false }],
    folderPath: '',
    isLoading: false,
    isSync: false,
    syncAudio: new Audio(),
    tryAudio: new Audio(),
    currentTime: 0,
  }),
  filters: {
    artistTags(value) {
      return (value||[]).join(', ')
    },
    clearLyricRow(value) {
      return value.substring(value.indexOf(']') > -1 ? value.indexOf(']')+1 : 0);
    },
    showTimeRow(value) {
      return value.indexOf(']') > -1 ? value.substring(0, value.indexOf(']')).replace('[','').trim() : '00:00.00';
    }
  },
  computed: {
    songArtist: {
      get() {
        return (this.song.artist||[]).join(', ');
      },
      set(v) {
        this.song.artist = v.split(', ');
      }
    },
    genresList() {
      return this.$store.getters.genresList;
    },
    artistList() {
      return this.$store.getters.artistsList;
    },
    songPath() {
      let fullpath = this.folderPath;
      if (this.song.artist && this.song.artist.length > 0 && this.clearFolder(this.song.artist[0]) && this.clearFolder(this.song.artist[0].trim()) != '') {
        fullpath += '\\' + this.clearFolder(this.song.artist[0]);
      } else {
        fullpath += '\\unknown';
      }

      if (this.clearFolder(this.song.album) && this.clearFolder(this.song.album.trim()) != '') {
        fullpath += '\\' + this.clearFolder(this.song.album);
      }

      if (this.clearFolder(this.song.filename) && this.clearFolder(this.song.filename.trim()) != '') {
        if (this.song.artist && this.song.artist.length > 0 && this.clearFolder(this.song.artist[0]) && this.clearFolder(this.song.artist[0].trim()) != '') {
          fullpath += '\\' + this.clearFolder(this.song.artist[0]) + ' - ';
          if (this.clearFolder(this.song.track_number) && this.clearFolder(this.song.track_number.trim()) != '') {
            fullpath += this.clearFolder(this.song.track_number) + ' - ' + this.clearFolder(this.song.filename);
          } else {
            fullpath += this.clearFolder(this.song.filename);
          }
        } else {
          if (this.clearFolder(this.song.track_number) && this.clearFolder(this.song.track_number.trim()) != '') {
            fullpath += this.clearFolder(this.song.track_number) + ' - ' + this.clearFolder(this.song.filename);
          } else {
            fullpath += this.clearFolder(this.song.filename);
          }
        }
      } else {
        if (this.song.artist && this.song.artist.length > 0 && this.clearFolder(this.song.artist[0]) && this.clearFolder(this.song.artist[0].trim()) != '') {
          fullpath += '\\' + this.clearFolder(this.song.artist[0]) + ' - ';
          if (this.clearFolder(this.song.track_number) && this.clearFolder(this.song.track_number.trim()) != '') {
            fullpath += this.clearFolder(this.song.track_number) + ' - unknown';
          } else {
            fullpath += 'unknown';
          }
        } else {
          if (this.clearFolder(this.song.track_number) && this.clearFolder(this.song.track_number.trim()) != '') {
            fullpath += this.clearFolder(this.song.track_number) + ' - unknown';
          } else {
            fullpath += 'unknown';
          }
        }
      }

      return fullpath + '.mp3';
    }, 
    repeatedSong() {
      if (this.song) {
        let listSongs = (this.$store.getters.filterList(this.songPath)||[{id:0}])[0];
        return listSongs && listSongs.id != this.song.id;
      } else {
        return false;
      }
    },
    canSave() {
      return !this.repeatedSong
    },
    lyrics() {
      return ((this.song||{lyrics: ''}).lyrics||'').split('\n')
    },
    lyricsQuery() {
      return this.song.filename + ' - ' + (this.song.artist||[]).join(' ') + ' lyrics';
    }
  },
  watch: {
    song: {
      deep: true,
      handler() {
        
      }
    }
  },
  methods: {
    clearFolder(folderValue) {
      return (folderValue||'').replace(/[\\/:*.?"“”’<>|']/g, '').trim();
    },
    setArtist(val) {
      let lastArtist = (this.$refs.artistAutocomplete.value||'').substring(0, this.$refs.artistAutocomplete.value.lastIndexOf(', '));
      
      this.songArtist = lastArtist + (lastArtist ? ', ': '') + val;
    },
    getArtists(searchTerm) {
      this.artistResult = new Promise(resolve => {
        if (!searchTerm) {
          searchTerm = this.songArtist;
        }
        let lastArtist = (searchTerm||'').split(', ').length > 0 ? (searchTerm||'').split(', ')[(searchTerm||'').split(', ').length-1] : '';
        resolve(this.$store.getters.artistsList.filter(f => this.$store.getters.clearFilter(f).indexOf(this.$store.getters.clearFilter(lastArtist)) != -1))
      })
    },
    audioResultHaveSomething(a) {
      let havesome = false;
      if (a.name && a.name != '') {
        havesome = true;
      }
      if (a.artist && a.artist != '') {
        havesome = true;
      }
      if (a.album && a.album != '') {
        havesome = true;
      }
      if (a.albumurl && a.albumurl != '') {
        havesome = true;
      }
      if (a.tags && a.tags.length > 0) {
        havesome = true;
      }
      return havesome;
    },
    findData() {
      this.audioResults = [];
      this.$store.dispatch('findData', { song: this.song }).then((response) => {
        if (response) {
          (response||[]).forEach(r => {
            if (r && r.data && r.data.track) {
              let albumResponse = (r.data.track.album||{}).image || [];

              this.audioResults.push({
                type: 'track',
                name: r.data.track.name,
                artist: (r.data.track.artist||{}).name,
                album: (r.data.track.album||{}).title,
                albumurl: (albumResponse.find(a=>a.size=='extralarge')||albumResponse.find(a=>a.size=='large')||albumResponse.find(a=>a.size=='medium')||albumResponse.find(a=>a.size=='small')||{'#text':''})['#text'],
                tags: ((r.data.track.toptags||{tag:[]}).tag||[]).map(t=>t.name),
                duration: Math.abs(r.data.track.duration / 1000),
                track_number: ((r.data.track.album||{'@attr': {position: 0}})['@attr']||{position: 0}).position,
              })
            }
          })
        }
      }).then(() => {
        this.$store.dispatch('findArtist', { song: this.song }).then((response) => {
          if (response) {
            (response||[]).forEach(r => {
              if (r && r.data && r.data && r.data.artist) {
                let albumResponse = (r.data.artist||{}).image || [];

                this.audioResults.push({
                  type: 'artist',
                  name: r.data.artist.name,
                  albumurl: (albumResponse.find(a=>a.size=='extralarge')||albumResponse.find(a=>a.size=='large')||albumResponse.find(a=>a.size=='medium')||albumResponse.find(a=>a.size=='small')||{'#text':''})['#text'],
                  tags: ((r.data.artist.tags||{tag:[]}).tag||[]).map(t=>t.name),
                })
              }
            })
          }
        }).then(() => {
          this.$store.dispatch('findAlbum', { song: this.song }).then((response) => {
            if (response) {
              (response||[]).forEach(r => {
                if (r && r.data && r.data && r.data.album) {
                  let albumResponse = (r.data.album||{}).image || [];

                  this.audioResults.push({
                    type: 'album',
                    name: r.data.album.name,
                    artist: r.data.album.artist,
                    albumurl: (albumResponse.find(a=>a.size=='extralarge')||albumResponse.find(a=>a.size=='large')||albumResponse.find(a=>a.size=='medium')||albumResponse.find(a=>a.size=='small')||{'#text':''})['#text'],
                    tags: ((r.data.album.tags||{tag:[]}).tag||[]).map(t=>t.name),
                  })
                }
              })
            }
          });
        })
      })
    },
    downloadImage(selected) {
      if (selected.albumurl && selected.albumurl.trim() != '') {
        this.toDataUrl(selected.albumurl, (baseResult) => {
          this.song.albumurl = baseResult;
        })
      }
    },
    downloadName(selected) {
      if (selected.type == 'track') {
        if (selected.name && selected.name.trim() != '') {
          this.song.filename = selected.name;
        }
        if (selected.track_number && selected.track_number > 0) {
          this.song.track_number = selected.track_number;
        }
      }
    },
    downloadArtist(selected, add = false) {
      if (selected.type == 'artist') {
        if (selected.name && selected.name.trim() != '') {
          if (!this.song.artist.map(b=>b.toLowerCase()).includes(selected.name.trim().toLowerCase())) {
            this.song.artist.push(selected.name);
          }
          if (!add) this.song.artist = [selected.name]
        }
      } else {
        if (selected.artist && selected.artist.trim() != '') {
          if (!this.song.artist.map(b=>b.toLowerCase()).includes(selected.artist.trim().toLowerCase())) {
            this.song.artist.push(selected.artist);
          }
          if (!add) this.song.artist = [selected.artist]
        }
      }
    },
    downloadAlbum(selected) {
      if (selected.album && selected.album.trim() != '') {
        this.song.album = selected.album;
      }
      if (selected.type == 'album' && selected.name && selected.name.trim() != '') {
        this.song.album = selected.name;
      }
    },
    downloadTags(selected) {
      if (selected.tags) {
        selected.tags.forEach((t) => {
          if (!this.song.tags.map(b=>b.toLowerCase()).includes(t.trim().toLowerCase())) {
            this.song.tags.push(t.trim())
          }
          if (!this.tags.map(b=>b.toLowerCase()).includes(t.trim().toLowerCase())) {
            this.tags.push(t.trim())
          }
        })
      }
    },
    downloadAll(selected) {
      this.downloadArtist(selected);
      this.downloadName(selected);
      this.downloadImage(selected);
      this.downloadAlbum(selected);
      this.downloadTags(selected);
    },
    downloadFill(selected) {
      if (this.song.artist.length == 0) this.downloadArtist(selected, true);
      if ((this.song.filename||'').trim() == '') this.downloadName(selected);
      if ((this.song.albumurl||'').trim() == '') this.downloadImage(selected);
      if ((this.song.album||'').trim() == '') this.downloadAlbum(selected);
      if (this.song.track_number && selected.track_number > 0 && (this.song.track_number <= 0 || this.song.track_number == '' || this.song.track_number != selected.track_number)) this.song.track_number = selected.track_number || 0;
      this.downloadTags(selected);
    },
    toDataUrl(url, callback) {
      var xhr = new XMLHttpRequest();
      xhr.onload = function() {
          var reader = new FileReader();
          reader.onloadend = function() {
              callback(reader.result);
          }
          reader.readAsDataURL(xhr.response);
      };
      xhr.open('GET', url);
      xhr.responseType = 'blob';
      xhr.send();
    },
    play() {
      let testAudio = new Audio();
      testAudio.src = 'https://api.your-music-player.com/song/' + this.song.id + '.mp3';
      testAudio.play();
      setTimeout(() => {
        testAudio.pause();
        testAudio.currentTime = 0;
      }, 30000);
    },
    like(song) {
      this.$store.dispatch("likeSong", { song });
    },
    add(song) {
      return new Promise((resolve) => {
        this.$store.dispatch("addSong", { song }).then(() => {
          resolve()
        }).catch(() => {
          resolve()
        });
      });
    },
    load() {
      return new Promise((resolve) => {
        this.$store.dispatch('loadSong', { id: this.$route.params.id }).then((data) => {
          this.song.filename = data.info.name;
          this.song.tags = data.info.tags.filter(t=>t!='');
          this.song.size = data.info.size;
          this.song.albumurl = data.info.albumurl || '';
          this.song.album = data.info.album || '';
          this.song.duration = data.info.duration;
          this.song.file_path = data.info.file_path;
          this.song.id = data.info.id;
          this.song.like = data.info.like;
          this.song.lyrics = data.info.lyrics || '';
          this.song.date = data.info.modification_date;
          this.song.no_plays = data.info.no_plays;
          this.song.rating = +data.info.rating;
          this.song.artist = data.info.artist;
          this.song.track_number = data.info.track_number;
          this.song.updated = !!data.info.updated;
          this.song.genre = data.info.genre || '';
          this.tags = data.tags.map(t=>t.tag).filter(t=>t!='');
          this.folderPath = data.path;
          resolve();
        });
      });
    },
    saveSong() {
      this.isLoading = true;
      this.song.file_path = this.songPath;
      this.$store.dispatch('updateSong', {song: this.song}).then(() => {
        this.isLoading = false;
        if(this.isSync) {
          this.startSync();
        }
        let listSongs = this.$store.getters.filterList('',true).find(f=>f.id==this.song.id);
        if (listSongs.id > 0) {
          listSongs.filename = this.song.filename;
          listSongs.tags = this.song.tags;
          listSongs.genre = this.song.genre;
          listSongs.artist = this.song.artist;
          listSongs.file_path = this.song.file_path;
          listSongs.like = this.song.like;
          listSongs.rating = this.song.rating;
          listSongs.albumurl = this.song.albumurl;
          listSongs.lyrics = this.song.lyrics;
        }
      })
    },
    addTag (newTag) {
      this.tags.push(newTag)
      this.song.tags.push(newTag)
    },
    deleteSong() {
      this.$swal({
        title: 'Are you sure?',
        position: 'top',
        text: "You won't be able to revert this!",
        icon: 'warning',
        buttons: {
          cancel: {
            text: "Cancel",
            visible: true,
          },
          confirm: {
            text: 'Yes, delete it!',
            visible: true,
            closeModal: false,
          }
        },   
        closeOnClickOutside : false
      }).then((result) => {
        if (result) {
          this.$store.dispatch("deleteSong", { song: this.song }).then((response) => {
            if (response.success) {
              this.$swal({
                title: 'Deleted!',
                text: 'Your file has been deleted.',
                icon: 'success',
                position: 'top',
              }).then(()=>{
                this.$router.go(-1);
              });
            } else {
              this.$swal.stopLoading();
              this.$swal.close();
            }
          });
        }
      });
    },
    playRepeated() {
      let foundSong = (this.$store.getters.filterList(this.song.file_path)||[{id:0}])[0];
      
      this.tryAudio.src = 'https://api.your-music-player.com/song/' + foundSong.id + '.mp3';
      this.tryAudio.play();
      setTimeout(() => {
        this.tryAudio.pause();
        this.tryAudio.currentTime = 0;
      }, 30000);
    },
    startSync() {
      this.isSync = !this.isSync;
      let foundSong = (this.$store.getters.filterList(this.song.file_path)||[{id:0}])[0];
      if (this.isSync) {
        this.syncAudio.src = 'https://api.your-music-player.com/song/' + foundSong.id + '.mp3';
        // this.syncAudio.volume = 0.1;
        this.syncAudio.load();
        this.syncAudio.play();
      } else {
        this.syncAudio.pause();
      }
    },
    syncThisRow(row_text, row_index, ev) {
      this.$refs.tabLyrics.$el.parentElement.scrollTo({
          top: ev.toElement.offsetTop - 80,
          behavior: "smooth"
      });

      if (this.isSync) {
        let timeRow = /^\[[\d.]+\]/.exec(row_text);
        if (timeRow && timeRow.length > 0) {
          row_text = row_text.replace(/^\[[\d.]+\] /,'');
        }

        let lyricsArr = ((this.song||{lyrics: ''}).lyrics||'').split('\n');
        var parsedLyrics = null;
          parsedLyrics = new Lrc()
          parsedLyrics.lyrics.push({
              content: row_text,
              timestamp: this.syncAudio.currentTime,
          })

        lyricsArr[row_index] = parsedLyrics.toString({combine: false});
        (this.song||{lyrics: ''}).lyrics = lyricsArr.join('\n');
      }
    },
    desyncThisRow(row_text, row_index) {
      let timeRow = row_text.indexOf(']') > -1 ? row_text.substring(0, row_text.indexOf(']')).replace('[','').trim() : "00:00.00";
      let lyricsArr = ((this.song||{lyrics: ''}).lyrics||'').split('\n');
      lyricsArr[row_index] = row_text.replace(`[${timeRow}]`, '');
      (this.song||{lyrics: ''}).lyrics = lyricsArr.join('\n');
    },
    isSyncThisRow(row_text) {
      let timeRow = row_text.indexOf(']') > -1 ? row_text.substring(0, row_text.indexOf(']')).replace('[','').trim() : "00:00.00";

      if (/^\[[\d.]+\]/.exec(row_text)) {
        timeRow = /^\[[\d.]+\]/.exec(row_text);
      } else if (timeRow) {
        timeRow = (parseInt(timeRow.substring(0,2)) * 60) + parseInt(timeRow.substring(3,5));
      }

      return timeRow <= this.currentTime && timeRow > 0;
    },
    searchLyrics() {
      this.$store.dispatch('searchLyrics', {
        filter: this.lyricsQuery,
        artist: (this.song.artist||[]).join(' '),
        name: this.song.filename,
      }).then(letras => {
        this.song.lyrics = letras;
      })
    }
  },
  beforeRouteUpdate(to, from, next) {
    next();
    this.load().then(() => {

    })
  },
  mounted() {
    this.syncAudio.addEventListener('timeupdate', () => {
      this.currentTime = this.syncAudio.currentTime;
    });
    this.load().then(() => {
      this.$nextTick().then(() => {

      })
    })
  },
  beforeDestroy() {
    if(!this.syncAudio.paused) this.syncAudio.pause();
    if(!this.tryAudio.paused) this.tryAudio.pause();
  }
}
</script>
<style>
  .tabs-component {}

  .tabs-component-tabs {
    background-color: #edf2f3;
    color: #545a5f;
    min-height: 50px;
    padding: 0 15px;
    padding-left: 0;
    margin-bottom: 0;
    list-style: none;
  }

  @media (min-width: 700px) {}

  .tabs-component-tab {
    float: left;
    margin-bottom: -1px;
    position: relative;
    display: block;
  }

  .tabs-component-tab:not(:last-child) {}

  .tabs-component-tab:hover {}

  .tabs-component-tab.is-active {
    background-color: #fff;
    color: #788188;
  }

  .tabs-component-tab.is-disabled * {}

  @media (min-width: 700px) {
    .tabs-component-tab {}

    .tabs-component-tab.is-active {}
  }

  .tabs-component-tab-a {
    border: none !important;
    border-radius: 0;
    padding-top: 15px;
    padding-bottom: 15px;
    line-height: 20px;
    margin-right: 2px;
    position: relative;
    display: block;
    padding: 15px;
    color: #545a5f;
  }

  .tabs-component-tab.is-active .tabs-component-tab-a {

    color: #788188;
  }

  .tabs-component-panels {
    overflow-x: hidden;
    overflow-y: auto;
    top: 0;
    bottom: 0;
    width: 100%;
    top: 50px;
    position: absolute;
  }

  @media (min-width: 700px) {
    .tabs-component-panels {}
  }

  .multiselect__option--selected.multiselect__option--highlight {
    background: #f3f3f3;
      color: #35495e;
  }
  .multiselect__option--highlight {
    background: #f3f3f3;
      color: #35495e;
  }
  .panel .list-group-item .badge {
    font-size: 10px;
  }
  .md-field.md-clearable .md-input {
    border-color: #cbd5dd;
    border-radius: 2px;
    display: block;
    width: 100%;
    height: 34px;
    padding: 6px 12px;
    font-size: 14px;
    line-height: 1.42857143;
    color: #555;
    background-color: #fff;
    background-image: none;
    border: 1px solid #ccc;
    border-radius: 4px;
    -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);
    box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);
    -webkit-transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;
    transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;
    border-color: #cbd5dd;
    border-radius: 2px;
  }
  .md-field {
    width: 100%;
    min-height: 0px;
    margin: 0px 0 0px;
    padding-top: 0px;
  }
  .md-field .md-input-action {
    display: none;
  }
  .row-song {
    text-align: center;
    padding: 16px;
  }
  .row-song:hover {
    background-color: #E1F5FE;
    padding: 15px;
    border: solid 1px #B3E5FC;
    cursor: pointer;
  }
  .row-song.synqued {
    background-color: #DCEDC8;
    padding: 15px;
    border: solid 1px #C5E1A5;
    cursor: pointer;
  }
  .sync .row-song {
    
  }
  .sync .row-song .small {
    font-size: 10px;
  }
</style>