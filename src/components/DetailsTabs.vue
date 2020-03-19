<template>
  <section class="vbox">
    <header class="header bg-light lt">
      <ul class="nav nav-tabs nav-white">

        <li v-for="(tab,tabi) in $slots.default" :key="tabi" :class="{'active': selected == tabi}" v-on:click.stop.prevent="selected = tabi">
          <a href="#activity">{{getName(tab).children[0].text}}</a>
        </li>
      </ul>
    </header>
    <section class="scrollable">
      <div class="tab-content">
        <div v-for="(tab,tabi) in $slots.default" :key="tabi" :class="{ 'tab-pane':true ,'active': selected == tabi}">
          
        </div>
      </div>
    </section>
  </section>
</template>
<script>
  
export default {
  name: 'DetailsTabs',
  props:['Tabs'],
  data: () => ({
    selected: 0
  }),
  methods: {
    selectTab(Tab) {
      let sTab = this.$slots.default.find(t=>t.data&&t.data.attrs&&t.data.attrs.selected);
      if (sTab&&sTab.data&&sTab.data.attrs) sTab.data.attrs.selected = false;

      if (!Tab.data) this.$set(Tab, 'data', {attrs: {selected: false }});
      if (!Tab.data.attrs) this.$set(Tab.data, 'attrs', {selected: false });

      Tab.data.attrs.selected = true;
      this.$nextTick()
    },
    getName(Tab) {
      return Tab.children.find(t=>t.tag == "name") || {};
    },
    getContent(Tab) {
      
    }
  },
  mounted() {
    
  }
}
</script>