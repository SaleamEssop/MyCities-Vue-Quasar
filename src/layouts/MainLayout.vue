<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="containerWidth">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="arrow_back"
          text-color="white"
          @click="$router.back()"
        />
        <q-toolbar-title class="text-white">{{
          route.meta.title
        }}</q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref, watch } from "vue";
import { useRoute } from "vue-router";

const linksList = [
  {
    title: "Docs",
    caption: "quasar.dev",
    icon: "school",
    link: "https://quasar.dev",
  },
  {
    title: "Github",
    caption: "github.com/quasarframework",
    icon: "code",
    link: "https://github.com/quasarframework",
  },
  {
    title: "Discord Chat Channel",
    caption: "chat.quasar.dev",
    icon: "chat",
    link: "https://chat.quasar.dev",
  },
  {
    title: "Forum",
    caption: "forum.quasar.dev",
    icon: "record_voice_over",
    link: "https://forum.quasar.dev",
  },
  {
    title: "Twitter",
    caption: "@quasarframework",
    icon: "rss_feed",
    link: "https://twitter.quasar.dev",
  },
  {
    title: "Facebook",
    caption: "@QuasarFramework",
    icon: "public",
    link: "https://facebook.quasar.dev",
  },
  {
    title: "Quasar Awesome",
    caption: "Community Quasar projects",
    icon: "favorite",
    link: "https://awesome.quasar.dev",
  },
];

export default defineComponent({
  name: "MainLayout",
  setup() {
    // const router = useRouter();
    const route = useRoute();
    //const leftDrawerOpen = ref(false);
    // You can watch the property for triggering some other action on change
    return {
      route,
      essentialLinks: linksList,
      //leftDrawerOpen,
      openSetting() {
        //router.push({ name: 'Setting' });
        //leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
});
</script>

<style scoped>
@media only screen and (min-width: 480px) {
  .containerWidth {
    width: 480px !important;
    margin: auto;
    justify-content: center;
    display: flex;
  }
}
</style>
