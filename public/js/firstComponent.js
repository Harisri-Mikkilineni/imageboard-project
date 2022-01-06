const firstComponent = {
    data() {
        return {
            imageSelected: "",
            title: "",
            description: "",
            username: "",
        };
    },
    props: ["id"],

    mounted() {
        console.log("first component just mounted");
        console.log("this:", this.id);
        fetch(`/selectedimage/${this.id}`)
            .then((resp) => resp.json())
            .then((data) => {
                console.log("data in the component:", data);
                this.imageSelected = data;
            });
    },
    methods: {
        notifyParent() {
            console.log("first component here the parent app should do sth");
            // to notify the parent that it should do sth we emit
            this.$emit("close");
        },
    },
    template: `<div class="image_pop_up">
    
    
    <img :src="imageSelected.url" :alt="imageSelected.title"/>
    <p>{{imageSelected.title}}</p> 
    <p>{{imageSelected.description}}</p> 
    <h3>Uploaded by {{imageSelected.username}}, on {{imageSelected.created_at}}</h3>
    <button @click="notifyParent">X</button>
    </div>`,
};

export default firstComponent;
