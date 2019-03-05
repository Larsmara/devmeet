<template>
    <v-container>
        <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
                <h2>Create a new Meetup</h2>
            </v-flex>
        </v-layout>
        <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
                <form @submit.prevent="onCreateMeetup">
                    <v-layout row >
                        <v-text-field name="title" label="Title" id="title" v-model="title" required></v-text-field>
                    </v-layout>
                    <v-layout row>
                        <v-text-field name="location" label="Location" id="location" v-model="location" required></v-text-field>
                    </v-layout>
                    <v-layout row >
                        <v-btn raised class="primary" @click="onPickFile">Upload Image</v-btn>
                        <input type="file" style="display: none" ref="fileInput" accept="image/*" @change="onFilePicked">
                    </v-layout>
                    <v-layout row  v-if="imageUrl">
                        <img :src="imageUrl" height="150">
                    </v-layout>
                    <v-layout row >
                        <v-text-field name="description" label="Description" id="description" v-model="description" multi-line required></v-text-field>
                    </v-layout>
                    <v-layout row>
                        <v-flex >
                        <h4>Choose a Data & Time</h4>
                        </v-flex>
                    </v-layout>
                    <v-layout row class="mb-2">
                        <v-flex xs12 >
                        <v-date-picker v-model="date"></v-date-picker>
                        <p>{{ date }}</p>
                        </v-flex>
                        <v-flex xs12 >
                        <v-time-picker v-model="time" format="24hr"></v-time-picker>
                        <p>{{ time }}</p>
                        </v-flex>
                    </v-layout>
                    <v-layout row >
                        <v-btn class="primary" :disabled="!formIsValid" type="submit">Create Meetup</v-btn>
                    </v-layout>
                </form>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
export default {
    name: 'CreateMeetup',
    data(){
        return{
            title: null,
            location: null,
            imageUrl: null,
            description: null,
            date: null,
            time: null,
            image: null
        }
    },
    computed: {
        formIsValid(){
            return this.title !== '' && this.location !== '' && this.description !== '' && this.imageUrl !== '' && this.date !== null && this.time !== null
        }
    },
    methods: {
        onCreateMeetup(){
            if(!this.formIsValid){
                return 
            }
            if(!this.image){
                return
            }
            const meetupData = {
                title: this.title,
                location: this.location,
                image: this.image,
                description: this.description,
                date: this.date,
                time: this.time,
            }
            this.$store.dispatch('createMeetup', meetupData)
            this.$router.push('/meetups')
        },
        onPickFile(){
            this.$refs.fileInput.click();
        },
        onFilePicked(event){
            const files = event.target.files
            let filename = files[0].name
            if (filename.lastIndexOf('.') <= 0) {
            return alert('Please add a valid file!')
            }
            const fileReader = new FileReader()
            fileReader.addEventListener('load', () => {
            this.imageUrl = fileReader.result
            })
            fileReader.readAsDataURL(files[0])
            this.image = files[0]
        }
    }
}
</script>

<style>
    .dato{
        display: inline;
    }
</style>
