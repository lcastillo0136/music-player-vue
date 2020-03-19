<template>
  <section class="vbox" v-if="ready">
      <Header></Header>
      <section>
        <section class="hbox stretch"> 
          <Menu></Menu>
          <section id="content">
            <section class="hbox stretch">
              <section>
                <section class="vbox">
                  <router-view></router-view>
                  <footer class="footer bg-dark" style="padding: 0px;" v-if="aplayer.available">
                    <Player ref="musicPlayer"></Player>
                    <!-- <a-player :audio="playlist" :lrc-type="0" ref="musicPlayer" :autoplay="false"></a-player> -->
                  </footer>
                </section>
              </section> <!-- side content -->
              
            </section> 
          </section>
        </section>
      </section>
    </section> 
</template>


<script>
import Header from '@/components/header.vue'
import Menu from '@/components/leftmenu.vue'
import Player from '@/components/Player.vue'

export default {
  name: 'Normal',
  components: {
    Header,
    Menu,
    Player,
  },
  data: () => ({
    aplayer: {
      available: true
    },
    ready: false
  }),
  computed: {
    playlist() {
      return this.$store.getters.playlist
    },
    playing() {
      return this.$store.getters.playing || {title: ' ',artist: ' ',src: '',pic: ''}
    },
    player() {
      return this.$refs.musicPlayer || {}
    }
  },
  mounted() {

    Notification.requestPermission().then(() => { //function(response) {
      // if (response == "granted") {}
    });

    document.addEventListener('keydown', (evt) => {
      if (!document.querySelector(':focus')) {
        switch(evt.code) {
          case 'ArrowRight':
            evt.preventDefault();
            evt.stopPropagation();
            this.$refs.musicPlayer.playNext();
            break;
          case 'ArrowLeft':
            evt.preventDefault();
            evt.stopPropagation();
            this.$refs.musicPlayer.playPrev();
            break;
          case 'Space':
            evt.preventDefault();
            evt.stopPropagation();
            this.$refs.musicPlayer.playPause();
            break;
        }
      }
    });
    
    this.$store.dispatch('loadSongs').then(() => {
      this.ready = true;
    }).catch((e)=>{
      this.$swal(e.message, "", "error");
    })
  }
}
</script>