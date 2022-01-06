const secondComponent = {
    data() {
        return {
            comments: [],
            username: "",
            comment: "",
        };
    },
    props: ["imageId"],
    mounted() {
        console.log("second component just mounted");
        console.log("this is second one:", this.imageId);
        fetch(`/comments/${this.imageId}`)
            .then((resp) => resp.json())
            .then((data) => {
                console.log("all comments in the selected image:", data);
                this.comments = data;
            });
    },
    methods: {
        addComment() {
            console.log("second component here the parent app should do sth");
            fetch("/comment", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },

                body: JSON.stringify({
                    username: this.username,
                    comment_text: this.comment,
                    image_id: this.imageId,
                }),
            })
                .then((res) => res.json())
                .then((result) => {
                    console.log("result: ", result);
                    console.log("Comments array 1: ", this.comments);
                    this.comments.unshift(result);
                    console.log("Comments array 2: ", this.comments);
                })
                .catch((err) => {
                    console.log("error uploading new comment: ", err);
                });
        },
    },
    template: `<div class="comment-container">
            <div class="comments-wrapper">
                <div v-for="comment in comments" class="comment">
                    {{comment.comment_text}} by {{comment.username}} ({{comment.created_at}})            
                </div>
            </div>
            <h3>Add a Comment!</h3>
            <form>
     <input v-model="comment" id ="comment" type="text" name="comment" placeholder="comment">
    <input v-model="username" id ="username" type="text" name="username" placeholder="username">
    <button @click.prevent="addComment">Submit</button>
     </form>
     </div>`,
};

export default secondComponent;
