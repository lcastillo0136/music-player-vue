<template>
  <section class="w-f-md" id="bjax-target">
    <section class="hbox stretch">

      <section>
        <section class="vbox">
          <section class="scrollable padder-lg"> 
            <h2 class="font-thin m-b">
              <div class="pull-left" style="font-size: 13px;line-height: 35px;width: 80%;">
                <div class="form-group"> 
                  <div class="input-group">
                    <input type="text" class="form-control" placeholder="" v-model="search" @keypress.enter="searchMp3(true)"/> 
                    <span class="input-group-btn">
                      <button class="btn btn-default" type="button" @click.stop.prevent="searchMp3(true)"><i class="fa fa-search"></i></button>
                    </span>
                  </div>
                </div>
              </div>
              <div class="pull-right btn-group">
                <button class="btn btn-default" :class="{'active': listType=='table'}" v-on:click.stop.prevent="listType='table'">
                  <i class="fa fa-list"></i>
                </button>
                <button class="btn btn-default" :class="{'active': listType=='box'}" v-on:click.stop.prevent="listType='box'">
                  <i class="fa fa-th"></i>
                </button>
              </div>
              <div class="pull-right m-r-sm" style="font-size: 13px;line-height: 35px;">
                Total songs: {{songCount | commas}}
              </div>
              <div class="clearfix"></div>
            </h2>
            

            <div v-if="loading.all">
              <PingPong></PingPong>
            </div>

            <div class="row row-sm" v-bind:class="{'hide': listType=='table'}" v-if="songCount > 0">
              <template v-for="(s, index) in songTable">
                <div class="col-xs-6 col-sm-4 col-md-3 col-lg-2" :key="'picture-' + index">
                  <div class="item">
                    <div class="pos-rlt">
                      <div class="item-overlay opacity r r-2x bg-black" v-bind:class="{'active': s.playing}">
                        <div class="center text-center m-t-n"> 
                          <a href="#" v-on:click.stop.prevent="play(s)">
                            <i class="fa fa-play-circle i-2x" v-if="!s.playing"></i>
                            <i class="fa fa-pause i-2x" v-if="s.playing"></i>
                          </a> 
                        </div>
                      </div> 
                      <a href="#">
                        <img src="img/a2.png" alt="" class="r r-2x img-full" v-if="!s.album" >
                        <img :src="s.album.thumb.photo_300" alt="" class="r r-2x img-full" v-if="s.album && s.album.thumb&&s.album.thumb.photo_300" >
                      </a>
                    </div>
                    <div class="padder-v" v-if="s"> 
                      <a class="text-ellipsis">{{s.title}}</a>
                      <a class="text-ellipsis text-xs text-muted">{{s.artist}}</a>
                    </div>
                  </div>
                </div>
                <div class="clearfix visible-lg" v-if="(index+1)%6==0&&index>1" :key="'breaklg-' + index"></div>
                <div class="clearfix visible-md" v-if="(index+1)%4==0&&index>1" :key="'breakmd-' + index"></div>
                <div class="clearfix visible-sm" v-if="(index+1)%3==0&&index>1" :key="'breaksm-' + index"></div>
                <div class="clearfix visible-xs" v-if="(index+1)%2==0&&index>1" :key="'breakxs-' + index"></div>
              </template>
              <div class="clearfix"></div>
            </div>
            <div class="row row-sm panel panel-default" v-bind:class="{'hide': listType=='box'}" v-if="songCount > 0">
              <div class="row wrapper"> 
                <div class="col-sm-5 m-b-xs"> 
                  <select class="input-sm form-control input-s-sm inline v-middle" v-model="selected.action"> 
                    <option value="0">Add to PlayList</option>
                  </select> 
                  <button class="btn btn-sm btn-default" v-on:click.stop.prevent="applyListAction">Apply</button> 
                </div> 
                <div class="col-sm-4 m-b-xs"> 
                  
                </div> 
                <div class="col-sm-3"> 
                  <div class="input-group"> 
                    <input type="text" class="input-sm form-control" placeholder="Search" v-model="filter"> 
                    <span class="input-group-btn"> 
                      <button class="btn btn-sm btn-default" type="button"><i class="fa fa-search"></i></button> 
                    </span> 
                  </div> 
                </div> 
              </div>
              <div class="table-responsive no-padder ">
                <table class="table table-striped b-t b-light song-list">
                  <thead>
                    <tr>
                      <th style="width: 1px;"></th>
                      <th style="">Name</th>
                      <th style="width: 25%;" class="visible-lg">Artist</th>
                      <th style="width: 1%;" class="visible-lg visible-md">Duration</th>
                      <th style="width: 135px;"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(s, index) in songTable" :key="index" :class="{'text-danger': s.error, 'bg-success-ltest': s.downloaded, 'bg-warning-ltest': s.playing, 'bg-success-ltest': inDownloaded(s), 'bg-warning-ltest': isSongPlaying(s)}">
                      
                        <td style="vertical-align: middle;">
                          <a href="#" v-on:click.stop.prevent="play(s)" :class="{'text-danger': s.error}">
                            <i class="fa fa-play-circle" v-if="!isSongPlaying(s)"></i>
                            <i class="fa fa-pause" v-if="isSongPlaying(s)"></i>
                          </a>
                        </td>
                        <td>
                          <a class="text-ellipsis" :class="{'text-danger': s.error}" @click.stop.prevent="searchSong(s)">
                            {{s.title}}
                          </a>
                          <span class="text-muted small visible-lg" :class="{'text-danger': s.error}" v-if="s.album">
                            {{s.album.title}}
                          </span> 
                          <span class="text-muted small hidden-lg" :class="{'text-danger': s.error}">
                            {{s.artist}}
                          </span> 
                          <span class="block text-muted small hidden-lg hidden-md" :class="{'text-danger': s.error}" v-if="isSongPlaying(s)">
                             {{currentTime|durationMin}}<b>&nbsp;/&nbsp;{{s.duration|durationMin}}</b>
                          </span> 
                          <span class="block text-muted small hidden-lg hidden-md" :class="{'text-danger': s.error}" v-if="!isSongPlaying(s)">
                            {{s.duration | durationMin}}
                          </span> 
                        </td>
                        <td style="vertical-align: middle;" class="visible-lg">
                          <a class="text-ellipsis" :class="{'text-danger': s.error}" @click.stop.prevent="searchSongByArtist(s)">{{s.artist}}</a>
                        </td>
                        <td class="text-right visible-lg visible-md" style="vertical-align: middle;" v-if="isSongPlaying(s)">
                          {{currentTime|durationMin}}<b>&nbsp;/&nbsp;{{s.duration|durationMin}}</b>
                        </td>
                        <td class="text-right visible-lg visible-md" style="vertical-align: middle;" v-if="!isSongPlaying(s)">
                          {{s.duration|durationMin}}
                        </td>
                        <td class="text-right"  style="vertical-align: middle;width: 140px;">
                          <div class="btn-group">
                            <a class="btn btn-xs btn-info" :href="downloadRef(s)" v-on:click="saveDownloadRef(s)" v-if="!inDownloaded(s)">
                              <i class="fa fa-download"></i> Download
                            </a>
                          </div>
                        </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <footer class="panel-footer"> 
                <div class="row"> 
                  <div class="col-sm-4 hidden-xs"> 
                      
                  </div> 
                  <div class="col-sm-4 text-center"> 
                    <a href="#" class="small" v-if="songCount > 0 && !loading.page" @click.stop.prevent="searchMp3(false)" >
                      More <i class="fa fa-caret-down"></i>
                    </a>
                    <Stretch v-if="loading.page" size="30px" color="#4cb6cb"></Stretch>
                  </div> 
                  <div class="col-sm-4 text-right text-center-xs"> 
                    
                  </div> 
                </div> 
              </footer>
            </div>
          </section>
        </section>
      </section>
    </section>
  </section>
</template>

<script>
import { PingPong, Stretch} from 'vue-loading-spinner'

export default {
  name: 'download',
  components: { PingPong, Stretch },
  data: () => ({
    selected: {},
    listType: localStorage.getItem('list.config.selected.type') || 'table',
    filter: '',
    lastpage: 0,
    search: '',
    songList: [],
    playing: new Audio(),
    songDonloaded: [],
    currentTime: 0,
    loading: {
      all: false,
      page: false
    }
  }),
  filters: {
    artistTags(value) {
      return (value||[]).join(', ')
    }
  },
  watch: {},
  mounted() {
    ['error'].forEach((sender) => {
      this.playing.addEventListener(sender, () => {
        if (this.inPlay) {
          this.playing.pause();
          this.$set(this.inPlay, 'error', true);
          this.inPlay.playing = false;
        } 
      });
    });
    this.playing.addEventListener('ended', () => {
      if (this.inPlay) {
        this.playing.pause();
        this.inPlay.playing = false;
      } 
    });
    this.playing.addEventListener("loadeddata", () => {

    });
    this.playing.addEventListener('timeupdate', (e) => {
      this.currentTime = e.target.currentTime;
    });
  },
  computed: {
    songCount() {
      return (this.songList||[]).length;
    },
    songTable() {
      return (this.songList||[]).filter(f=>f.toString() === "[object Object]").filter(f=>this.$store.getters.clearFilter(f.title).indexOf(this.$store.getters.clearFilter(this.filter)) > -1 || this.$store.getters.clearFilter(f.artist).indexOf(this.$store.getters.clearFilter(this.filter)) > -1 || this.$store.getters.clearFilter((f.album||{title:''}).title).indexOf(this.$store.getters.clearFilter(this.filter)) > -1 || this.$parent.$options.filters.durationMin(f.duration).indexOf(this.$store.getters.clearFilter(this.filter)) > -1 || this.$store.getters.clearFilter(this.filter) == '')
    },
    inPlay() {
      return this.songList.find(f=>f.playing);
    },
  },
  methods: {
    searchMp3(restart) {
      if (restart) {
        this.loading.all = true; 
        this.lastpage = 0;
      }
      else {
        this.loading.page = true;
        this.lastpage++;
      }

      this.$store.dispatch('searchMp3', {
        filter: this.search,
        page: this.lastpage,
      }).then((response) => {
        if (restart) {
          this.songList = response.response.slice(1);
        }
        else {
          this.songList = this.songList.concat(response.response.slice(1));
        }
        this.loading.all = false;
        this.loading.page = false;
      });
    },
    play(song) {

        //this.playing.src = song.url;
      let ownerId = song.owner_id,
        aid = song.id,
        prettyId = this.c(ownerId) + ":" + this.c(aid);

      if (this.playing.src != "https://s.mp3-music-downloads.com/stream/" + prettyId) {
        if (!this.playing.paused) {
          (this.inPlay||{}).playing = false;
          this.playing.pause();
        } 
        this.playing.src = "https://s.mp3-music-downloads.com/stream/" + prettyId;
        this.playing.load();
        this.playing.play();
        setTimeout(() => {
          this.$set(song, 'playing', !song.playing);
        }, 100);

      } else {
        if (this.playing.paused) {
          this.playing.play();
          song.playing = true;
        } else {
          this.playing.pause();
          song.playing = false;
        }
      }
    },
    downloadRef(song) {
      let ownerId = song.owner_id,
        aid = song.id,
        prettyId = this.c(ownerId) + ":" + this.c(aid);

      return 'https://s.mp3-music-downloads.com/' + prettyId;
    },
    saveDownloadRef(song) {
      let ownerId = song.owner_id,
        aid = song.id,
        prettyId = this.c(ownerId) + ":" + this.c(aid);

      this.$set(song, 'downloaded', true);

      this.songDonloaded.push(prettyId);
    },
    inDownloaded(song) {
      let ownerId = song.owner_id,
        aid = song.id,
        prettyId = this.c(ownerId) + ":" + this.c(aid);

      return this.songDonloaded.includes(prettyId);
    },
    isSongPlaying(song) {
      let ownerId = song.owner_id,
        aid = song.id,
        prettyId = this.c(ownerId) + ":" + this.c(aid);

      return this.playing && !this.playing.paused && this.playing.currentSrc === "https://s.mp3-music-downloads.com/stream/" + prettyId;
    },
    searchSong(song) {
      this.search = song.title;
      this.searchMp3(true);
    },
    searchSongByArtist(song) {
      this.search = song.artist;
      this.searchMp3(true);
    },
    c(t) {
      let u = ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "M", "N", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "j", "k", "m", "n", "p", "q", "r", "s", "t", "u", "v", "x", "y", "z", "1", "2", "3"], val= '',
      length = u.length;
      var e = "";
      if (0 == t)
          return u[0];
      for (t < 0 && (t *= -1,
      e += "-"); t > 0; )
          val = parseInt(t % length),
          t = parseInt(t / length),
          e += u[val];
      return e
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .text-ellipsis {
    max-width: 200px;
  }
  .panel .table-striped>tbody>tr, .panel .table-striped>tbody>tr {
    &.bg-success-ltest {
      background-color: #f1ffed;
      td {
        background-color: #f1ffed;
      }
      th {
        background-color: #f1ffed;
      }
    }
    &.bg-warning-ltest {
      background-color: #fffee6;
      td {
        background-color: #fffee6;
      }
      th {
        background-color: #fffee6;
      }
    }
  }
  .spinner {
    margin: 0 auto;
  }
</style>