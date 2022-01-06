import * as Vue from "./vue.js";
import firstComponent from "./firstComponent.js";

Vue.createApp({
    data() {
        return {
            images: [],
            title: "",
            description: "",
            username: "",
            file: null,
            imageSelected: "",
            showMoreBtn: false,
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
    components: {
        "first-component": firstComponent,
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
                    this.images.unshift(result.image);
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
        clickImage(clickedId) {
            console.log("user clicked on image with id:", clickedId);
            this.imageSelected = clickedId;
        },
        closeComponent() {
            console.log(
                "the component has emitted that it should be closed :D"
            );
            this.imageSelected = "";
        },

        moreImagesHandler: function () {
            console.log("user clicked on More button:", this.images);
            const offset = this.images[this.images.length - 1].id;
            fetch(`/getmoreimages/${offset}`)
                .then((resp) => resp.json())
                .then((data) => {
                    console.log("data after more button clicked:", data);
                    for (let i = 0; i < data.length; i++) {
                        this.images.push(data[i]);
                    }
                    if (
                        this.images[this.images.length - 1].id ===
                        data[data.length - 1].lowestId
                    ) {
                        this.showMoreBtn = false;
                    }
                })
                .catch(console.log("error in more button display"));
        },
    },
}).mount("#main");
