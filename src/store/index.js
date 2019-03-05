import Vue from 'vue'
import Vuex from 'vuex'
import * as firebase from 'firebase'



Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
        loadedMeetups: [
            
        ],
        user: null,
        loading: false,
        error: null
    },
    mutations: {
        createMeetup(state, payload) {
            state.loadedMeetups.push(payload)
        },
        setUser(state, payload){
            state.user = payload
        },
        setLoading(state, payload){
            state.loading = payload
        },
        setError(state, payload){
            state.error = payload
        },
        clearError(state){
            state.error = null
        },
        setLoadedMeetups(state, payload){
            state.loadedMeetups = payload
        }
    },
    actions: {
        loadMeetups({commit}){
            commit('setLoading', true)
            const meetups = []
            firebase.firestore().collection('meetups').onSnapshot((snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    console.log(change.doc.data())
                    if(change.type == 'added'){
                        let doc = change.doc
                        meetups.push({
                            id: doc.id,
                            title: doc.data().title,
                            description: doc.data().description,
                            imageUrl: doc.data().imageUrl,
                            date: doc.data().date,
                            time: doc.data().time,
                            location: doc.data().location,
                            creatorId: doc.data().creatorId
                        })
                    }
                })
                commit('setLoadedMeetups', meetups)
                commit('setLoading', false)
            })
        },
        createMeetup({commit, getters}, payload){
            const meetup = {
                title: payload.title,
                location: payload.location,
                imageUrl: payload.imageUrl,
                description: payload.description,
                date: payload.date,
                time: payload.time,
                creatorId: getters.user.id
            }
            let imageUrl
            let key
            firebase.firestore().collection('meetups').add(meetup)
            .then((data) => {
                console.log(data.id)
                key = data.id
                
                return key
            }).then(key => {
                const filename = payload.image.name
                const ext = filename.slice(file.lastIndexOf('.'))
                return firebase.storage().ref('meetups/' + key + '.' + ext).put()
            }).then(fileData => {
                imageUrl = fileData.getMetadata.downloadURLs[0]
                return firebase.database().ref('meetups').child(key).update({imageUrl: imageUrl})
            }).then(() => {
                commit('createMeetup', {
                    ...meetup,
                    imageUrl: imageUrl,
                    id: key
                })
            })
            .catch((error) => {
                console.log(error)
            })
            // Reach out to firebase and store it
            
        },
        signUserUp({commit}, payload){
            commit('setLoading', true)
            commit('clearError')
            firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
            .then(user => {
                commit('setLoading', false)
                const newUser = {
                    id: user.uid,
                    registereredMeetups: []
                }
                commit('setUser', newUser)
            }).catch(error => {
                commit('setLoading', false)
                commit('setError', error.message)
                console.log(error)
            })
        },
        signUserIn ({commit}, payload) {
            commit('setLoading', true)
            commit('clearError')
            firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
              .then(user => {
                  commit('setLoading', false)
                  const newUser = {
                    id: user.uid,
                    registeredMeetups: []
                  }
                  commit('setUser', newUser)
                }
              )
              .catch(error => {
                commit('setLoading', false)
                commit('setError', error.message)
                  console.log(error)
                })
        },
        autoSignIn({commit}, payload){
            commit('setUser', {id: payload.uid, registeredMeetups: []})
        },
        logout({commit}){
            firebase.auth().signOut()
            commit('setUser', null)
        },
        clearError({commit}) {
            commit('clearError')
        }
    },
    getters: {
        loadedMeetups(state){
            return state.loadedMeetups.sort((meetupA, meetupB) => {
                return meetupA.date > meetupB.date
            })
        },
        featuredMeetups(state, getters){
            return getters.loadedMeetups.slice(0, 5)
        },
        loadedMeetup(state){
            return (meetupId) => {
                return state.loadedMeetups.find((meetup) => {
                    return meetup.id === meetupId
                })
            }
        },
        user(state){
            return state.user
        },
        loading(state){
            return state.loading
        },
        error(state){
            return state.error
        }
    }
})