import * as Vue from "./vue.js";

Vue.createApp({
    data() {
        return {
            images: [],
            title: "",
            description: "",
            username: "",
            file: null,
        };
    },
    //api call
    mounted() {
        fetch("/images")
            .then((resp) => resp.json())
            .then((data) => {
                this.images = data;
            });
    },
    methods: {
        clickHandler: function () {
            //console.log("this:", this);
            const fd = new FormData();
            fd.append("title", this.title);
            fd.append("description", this.description);
            fd.append("username", this.username);
            fd.append("file", this.file);
            fetch("/upload", {
                method: "POST",
                body: fd,
            })
                .then((res) => res.json())
                .then((result) => {
                    console.log("result: ", result);
                    //here
                })
                .catch((err) => {
                    console.log("error uploading new image: ", err);
                });
        },
        fileSelectHandler: function (e) {
            // console.log("File selected:", e);
            this.file = e.target.files[0];
            //now submit these values to server
        },
    },
}).mount("#main");
