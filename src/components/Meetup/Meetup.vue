<template>
    <v-container>
        <v-layout row wrap>
            <v-flex xs12>
                <v-card>
                    <v-card-title>
                        <h3 class="primary--text">{{meetup.title}}</h3>
                    </v-card-title>
                    <v-card-media
                        :src="meetup.imageUrl"
                        height="400px"
                    ></v-card-media>
                    <v-card-text>
                        <div class="info--text">{{meetup.date}} - {{meetup.time}}</div>
                        <div>Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis, culpa dolorum. Sit totam, nam at quibusdam dolores repellendus laborum aliquid consequatur architecto optio distinctio modi, nostrum ex impedit dignissimos necessitatibus?</div>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn class="primary">Register</v-btn>
                    </v-card-actions>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
export default {
    name: 'Meetup',
    props: ['id'],
    computed: {
        meetup(){
            return this.$store.getters.loadedMeetup(this.id)
        }
    },
    data(){
        return{
            
        }
    }
}
</script>
