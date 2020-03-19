<template>
  <section class="w-f-md" id="bjax-target">
    <section class="hbox stretch">
      <!-- side content -->
      <aside class="aside bg-light dk hidden-xs hidden-sm" id="sidebar">
        <section class="vbox animated fadeInUp">
          <section class="scrollable hover">
            <div class="list-group no-radius no-border no-bg m-t-n-xxs m-b-none auto"> 
              <a href="#" class="list-group-item" v-bind:class="{'active': selected.band == g}"  v-for="g in bandsList" v-on:click.stop.prevent="selected.band=g;selected.page=1" :key="g"> {{g}} </a> 
            </div>
          </section>
        </section>
      </aside> <!-- / side content -->

      <section>
        <section class="vbox">
          <section class="scrollable padder-lg"> 
            <h2 class="font-thin m-b">
              {{selected.band}}
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
            
            <div class="row row-sm" v-bind:class="{'hide': listType=='table'}">
              <template v-for="(s, index) in songList.slice(0).slice((selected.page-1) * 18, selected.page * 18)">
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
                      <router-link :to="'/songs/'+s.id">
                        <img src="/img/a2.png" alt="" class="r r-2x img-full" v-if="s.albumurl==''||!s.albumurl">
                        <img v-bind:src="s.albumurl" onerror="this.src='/img/a2.png';" alt="" class="r r-2x img-full" v-if="s.albumurl!=''" >
                      </router-link>
                    </div>
                    <div class="padder-v"> 
                      <router-link :to="'/songs/'+s.id" class="text-ellipsis">{{s.filename}}</router-link>
                      <router-link :to="'/songs/'+s.id" class="text-ellipsis text-xs text-muted">{{s.artist}}</router-link>
                    </div>
                  </div>
                </div>
                <div class="clearfix visible-lg" v-if="(index+1)%6==0&&index>1" :key="'breaklg-' + index"></div>
                <div class="clearfix visible-md" v-if="(index+1)%4==0&&index>1" :key="'breakmd-' + index"></div>
                <div class="clearfix visible-sm" v-if="(index+1)%3==0&&index>1" :key="'breaksm-' + index"></div>
                <div class="clearfix visible-xs" v-if="(index+1)%2==0&&index>1" :key="'breakxs-' + index"></div>
              </template>
              <div class="clearfix"></div>
              <ul class="pagination pagination" v-if="pagelimit">
                <li><a href="#" v-on:click.stop.prevent="selected.page>1&&selected.page--"><i class="fa fa-chevron-left"></i></a></li>
                <li v-for="index in pagelimit" :key="index" v-bind:class="{'active': selected.page == index}">
                  <a href="#" v-on:click.stop.prevent="selected.page=index">{{index}}</a>
                </li>
                <li><a href="#"  v-on:click.stop.prevent="selected.page<Math.ceil(songList.length / 18)&&selected.page++"><i class="fa fa-chevron-right"></i></a></li>
              </ul>
            </div>
            <div class="row row-sm panel panel-default" v-bind:class="{'hide': listType=='box'}">
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
                      <th style="width: 1px;" @click.stop.prevent="sort=''"></th>
                      <th style="" @click.stop.prevent="sort='name'">Name</th>
                      <th style="width: 25%;" class="visible-lg">Artist</th>
                      <th style="width: 1%;" class="visible-lg visible-md">Duration</th>
                      <th style="width: 135px;"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(s, index) in songList.slice(0).slice((selected.page-1) * 18, selected.page * 18)" :key="index">
                      <td style="vertical-align: middle;">
                        <a href="#" v-on:click.stop.prevent="play(s)">
                          <i class="fa fa-play-circle" v-if="!s.playing"></i>
                          <i class="fa fa-pause" v-if="s.playing"></i>
                        </a>
                      </td>
                      <td>
                        <router-link :to="'/songs/'+s.id" class="text-ellipsis">{{s.filename}}</router-link>
                        <span class="text-muted small visible-lg">
                          {{s.file_path}}
                        </span> 
                        <span class="text-muted small hidden-lg">
                          {{s.artist}}
                        </span> 
                        <span class="block text-muted small hidden-lg hidden-md">
                          {{s.duration | durationMin}}
                        </span> 
                      </td>
                      <td style="vertical-align: middle;" class="visible-lg">
                        {{s.artist | artistTags}}
                      </td>
                      <td class="text-right visible-lg visible-md" style="vertical-align: middle;">
                        {{s.duration|durationMin}}
                      </td>
                      <td class="text-right"  style="vertical-align: middle;width: 140px;">
                        <router-link :to="'/songs/'+s.id" class="btn btn-xs btn-info"><i class="fa fa-edit"></i> Edit</router-link>
                        <button class="btn btn-xs btn-danger" v-on:click.stop.prevent="deletesong(s, index)">
                          <i class="fa fa-trash-o"></i> Delete
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <footer class="panel-footer"> 
                <div class="row"> 
                  <div class="col-sm-4 hidden-xs"> 
                    <select class="input-sm form-control input-s-sm inline v-middle" v-model="selected.action">
                    <option value="0">Add to PlayList</option>
                  </select> 
                  <button class="btn btn-sm btn-default" v-on:click.stop.prevent="applyListAction">Apply</button> 
                  </div> 
                  <div class="col-sm-4 text-center"> 
                    <small class="text-muted inline m-t-sm m-b-sm">Showing {{(selected.page*18)-17}}-{{(selected.page*18)>songList.length?songList.length:selected.page*18}} of {{songList.length | commas}} songs</small> 
                  </div> 
                  <div class="col-sm-4 text-right text-center-xs" v-if="pagelimit"> 
                    <ul class="pagination pagination-sm m-t-none m-b-none"> 
                      <li><a href="#" v-on:click.stop.prevent="selected.page>1&&selected.page--"><i class="fa fa-chevron-left"></i></a></li> 
                      <li v-for="index in pagelimit" :key="index" v-bind:class="{'active': selected.page == index}">
                        <a href="#" v-on:click.stop.prevent="selected.page=index">{{index}}</a>
                      </li>
                      <li><a href="#" v-on:click.stop.prevent="selected.page<Math.ceil(songList.length / 18)&&selected.page++"><i class="fa fa-chevron-right"></i></a></li> 
                    </ul> 
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
export default {
  name: 'band',
  components: {},
  data: () => ({
    selected: {
      band: localStorage.getItem('list.config.selected.band') || 'All',
      page: 1,
      action:'',
    },
    listType: localStorage.getItem('list.config.selected.type') || 'table',
    filter: '',
    sort: '',
  }),
  watch: {
    selected: {
      handler: function() {
        localStorage.setItem('list.config.selected.band',this.selected.band);
        localStorage.setItem('list.config.selected.type',this.listType);
      },
      deep: true
    },
    listType: {
      handler: function() {
        localStorage.setItem('list.config.selected.band',this.selected.band);
        localStorage.setItem('list.config.selected.type',this.listType);
      },
      deep: true
    }
  },
  filters: {
    artistTags(value) {
      return (value||[]).join(', ')
    }
  },
  computed: {
    bandsList() {
      return this.$store.getters.artistsList;
    },
    songList() {
      return this.$store.getters.filterByBand(this.selected.band, this.filter).sort((a, b) => {
        if (this.sort == 'name') {
          if (a.filename > b.filename) return 1;
          if (a.filename < b.filename) return -1;
        } 
        return 0;
      });
    },
    songCount() {
      return this.songList.length.toString();
    },
    pagelimit() {
      return new Array(Math.ceil(this.songList.length / 18)).slice(Math.max(this.selected.page - 5,0), Math.max(Math.min(this.selected.page + 6, Math.ceil(this.songList.length / 18)),10)).fill(true).map((e,ei)=>Math.max(this.selected.page-5,1)+ei);
    },
  },
  methods: {
    play(song) {
      this.add(song).then(() => {
        this.$parent.$refs.musicPlayer.play(song);
      });
    },
    like(song) {
      this.$store.dispatch("likeSong", { song });
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
    applyListAction() {
      if (this.selected.action == '0') {
        this.songList.forEach((s) => {
          this.$store.dispatch("addSong", { song: s }).then(() => {
            
          });
        })
      }
    },
    deletesong(song) {
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
          this.$store.dispatch("deleteSong", { song }).then((response) => {
            if (response.success) {
              this.$swal({
                title: 'Deleted!',
                text: 'Your file has been deleted.',
                icon: 'success',
                position: 'top',
              }).then(function() {
                
              });
            } else {
              this.$swal.stopLoading();
              this.$swal.close();
            }
          });
        }
      });
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .list-group.no-bg .list-group-item {
    text-transform: capitalize;
  }
</style>