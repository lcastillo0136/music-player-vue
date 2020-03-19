<template>
  <section class="scrollable padder-lg w-f-md" id="bjax-target"> 
    <loading :active.sync="isLoading" :can-cancel="true" :is-full-page="true">
      <img src="img/icons/loadingMusic.svg" />
    </loading>

    <div id="discover-container">
      <a href="#" class="pull-right text-muted m-t" data-toggle="class:fa-spin" v-on:click.stop.prevent="refresh">
        <i class="icon-refresh i-lg inline" :class="{'fa-spin': loading}"></i>
      </a> 
                      
      <h2 class="font-thin m-b">
        Discover 
        <span class="musicbar animate inline m-l-sm" style="width:20px;height:20px"> 
          <span class="bar1 a1 bg-primary lter"></span> 
          <span class="bar2 a2 bg-info lt"></span> 
          <span class="bar3 a3 bg-success"></span> 
          <span class="bar4 a4 bg-warning dk"></span> 
          <span class="bar5 a5 bg-danger dker"></span> 
        </span>
      </h2>
      <div class="row row-sm">
        <div class="col-xs-6 col-sm-4 col-md-3 col-lg-2" v-for="(s,si) in discoverSongs" v-bind:key="si" v-bind:class="{'col-0':si%6==0}" >
          <div class="item">
            <div class="pos-rlt">
              <div class="bottom"> <span class="badge bg-info m-l-sm m-b-sm">{{s.duration|durationMin}}</span> </div>
              <div class="item-overlay opacity r r-2x bg-black" v-bind:class="{'active': s.playing}">
                <div class="text-info padder m-t-sm text-sm"> 
                  <i class="fa fa-star" v-bind:class="{'fa-star-o text-muted': s.rating < 1}"></i> 
                  <i class="fa fa-star" v-bind:class="{'fa-star-o text-muted': s.rating < 2}"></i> 
                  <i class="fa fa-star" v-bind:class="{'fa-star-o text-muted': s.rating < 3}"></i> 
                  <i class="fa fa-star" v-bind:class="{'fa-star-o text-muted': s.rating < 4}"></i> 
                  <i class="fa fa-star" v-bind:class="{'fa-star-o text-muted': s.rating < 5}"></i> 
                </div>
                <div class="center text-center m-t-n"> 
                  <a href="#" v-on:click.stop.prevent="play(s)">
                    <i class="icon-control-play i-2x" v-if="!s.playing"></i>
                    <i class="icon-control-pause i-2x" v-if="s.playing"></i>
                  </a> 
                </div>
                <div class="bottom padder m-b-sm"> 
                  <a href="#" v-on:click.stop.prevent="like(s)" class="pull-right"> 
                    <i class="fa" v-bind:class="{'fa-heart-o': s.like == 0, 'fa-heart': s.like ==1}"></i> 
                  </a> 
                  <a href="#" v-on:click.stop.prevent="add(s)"> 
                    <i class="fa fa-plus-circle"></i> 
                  </a> 
                </div>
              </div> 
              <router-link to="/" style="overflow: hidden;display: block;height: 450px;position: relative;z-index: -1;border-radius: 5px;">
                <img src="img/p1.jpg" alt="" class="r r-2x img-full" style="width: auto;max-width: unset;min-height: 100%;min-width: 100%;transform: translate(-50%, -50%);position: absolute;top: 50%;left: 50%;" v-if="!s.albumurl">
                <img :src="s.albumurl" alt="" class="r r-2x img-full" style="width: auto;max-width: unset;min-height: 100%;min-width: 100%;transform: translate(-50%, -50%);position: absolute;top: 50%;left: 50%;" v-if="s.albumurl&&s.albumurl != ''">
              </router-link>
            </div>
            <div class="padder-v">
              <router-link :to="'/songs/'+s.id" class="text-ellipsis">{{s.filename}}</router-link>
              <router-link to="/" class="text-ellipsis text-xs text-muted">{{s.artist | artistTags}}</router-link>
            </div>
          </div>
        </div>

        <!-- EVERY 2-->
        <div class="clearfix visible-xs"></div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-7"> 
        <h3 class="font-thin">New Songs</h3>
        <div class="row row-sm">
          <div class="col-xs-6 col-sm-3" v-for="(s,si) in newSongs" v-bind:key="si">
            <div class="item">
              <div class="pos-rlt">
                <div class="item-overlay opacity r r-2x bg-black" v-bind:class="{'active': s.playing}">
                  <div class="center text-center m-t-n"> 
                    <a href="#"  v-on:click.stop.prevent="play(s)">
                      <i class="fa fa-play-circle i-2x" v-if="!s.playing"></i>
                      <i class="fa fa-pause i-2x" v-if="s.playing"></i>
                    </a> 
                  </div>
                </div> 
                <a v-bind:href="'#/songs/'+s.id">
                  <img src="img/a2.png" alt="" class="r r-2x img-full" v-if="!s.albumurl">
                  <img :src="s.albumurl" alt="" class="r r-2x img-full" v-if="s.albumurl && s.albumurl!=''">
                </a>
              </div>
              <div class="padder-v"> 
                <router-link :to="'/songs/'+s.id" class="text-ellipsis">{{s.filename}}</router-link>
                <router-link to="/" class="text-ellipsis text-xs text-muted">{{s.artist | artistTags}}</router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-5"> 
        <h3 class="font-thin">Top Songs</h3>
        <div class="list-group bg-white list-group-lg no-bg auto" > 
           <router-link :to="'/songs/'+s.id" class="list-group-item clearfix" v-for="(s,si) in topSongs" v-bind:key="si" v-bind:class="{'active': s.playing}"> 
            <span class="pull-right h2 text-muted m-l">{{s.no_plays}}</span> 
            <span class="pull-left thumb-sm avatar m-r"  v-on:click.stop.prevent="play(s)"> 
              <img src="img/a4.png" alt="" v-if="!s.albumurl">
              <img :src="s.albumurl" alt="" v-if="s.albumurl && s.albumurl!=''">
            </span> 
            <span class="clear"> 
              <span>{{s.filename}}</span> 
              <small class="text-muted clear text-ellipsis">by {{s.artist | artistTags}}</small> 
            </span> 
          </router-link>
        </div>
      </div>
    </div>
  </section>
</template>

<script>

export default {
  name: 'home',
  data: () => ({
    loading: false,
    isLoading: false,
  }),
  filters: {
    artistTags(value) {
      return (value||[]).join(', ')
    }
  },
  computed: {
    discoverSongs() {
      return this.$store.getters.randomList
    },
    newSongs() {
      return this.$store.getters.newList
    },
    topSongs: function() {
      return this.$store.getters.popularList
    }
  },
  methods: {
    play(song) {
      this.add(song).then(() => {
        this.$parent.$refs.musicPlayer.play(song);
      });
    },
    add(song) {
      return new Promise((resolve) => {
        this.$store.dispatch("addSong", { song }).then(()=> {
          resolve()
        }).catch(() => {
          resolve();
        });
      });
    },
    like(song) {
      this.$store.dispatch("likeSong", { song });
    },
    refresh() {
      this.isLoading = true;
      let oldtitle = document.title;
      document.title = "Loading...";
      this.$store.dispatch("refresh").then(() => {
        this.$store.dispatch('loadSongs').then(() => {
          this.isLoading = false;
          document.title = oldtitle;
        })
      });
    }
  }
}
</script>
