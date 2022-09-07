import { boot } from "quasar/wrappers";
import Plugin from "@quasar/quasar-ui-qmediaplayer/src/QMediaPlayer.js";

export default boot(({ app }) => {
  app.use(Plugin);
});
