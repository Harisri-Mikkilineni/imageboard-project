import * as Vue from "./vue.js";

Vue.createApp({
    data() {
        return {
            images: [],
        };
    },
    //api call
    mounted() {
        fetch("/get-images")
            .then((resp) => resp.json())
            .then((data) => {
                this.images = data;
            });
    },
}).mount("#main");
