<template>
    <v-app id="app">
        <navigation-component class="navigation"></navigation-component>
        <router-view>
        </router-view>
        <v-fade-transition>
            <Stuck class="stuck" v-if="stuck"></Stuck>
        </v-fade-transition>
    </v-app>
</template>

<script>
    import Navigation from '@/components/Navigation.vue';
    import Stuck from "./components/Stuck";
    import {eventBus} from "./eventBus";

    const SCROLL_PITS = [innerHeight, innerHeight * 2, innerHeight * 3, innerHeight * 4]
    export default {
        components: {
            Stuck,
            'navigation-component': Navigation,
        },
        data: () => {
            return {
                stuck: true,
                scroll: true,
                pit: 0,
            }
        },
        methods: {
          scrollOn() {
              this.scroll = true;
              eventBus.$emit('scroll-enabled');
          },
            scrollOff() {
              this.scroll = false;
              eventBus.$emit('scroll-disabled');
            }
        },
        mounted() {
            eventBus.$on('main-loaded', () => {
                this.stuck = false;
            })

            eventBus.$on('change-mind-authorize', (update) => {
                if( update ) {
                    this.stuck = true;
                    this.$router.go();
                }
            })

            eventBus.$on('wants-scroll', item => {
                this.scrollOn();
                this.$smoother.scrollTo(item, true);
                setTimeout(() => {
                    let newPit = 0;
                    SCROLL_PITS.forEach(pit => {
                        if(window.scrollY >= pit) {
                            newPit = pit;
                        }
                    });
                    if (newPit === this.pit || newPit === 0)
                        return;

                    this.scrollOff();
                    this.pit = newPit;
                    console.log('pit changed' + this.pit)
                });
                }, 1500);

            eventBus.$on('scroll-lock', () => {
                this.scroll = false;
                let newPit = 0;
                SCROLL_PITS.forEach(pit => {
                    if(window.scrollY >= pit) {
                        newPit = pit;
                    }
                });
                if (newPit === this.pit || newPit === 0)
                    return;

                this.pit = newPit;
                console.log('pit changed' + this.pit)
                if ( ( this.pit + innerHeight / 2 ) > window.scrollY || window.scrollY >= ( this.pit - innerHeight / 2 ) ) {
                    console.log(window.scrollY)

                    scrollTo(0, this.pit);
                }
            })

            eventBus.$on('scroll-unlock', () => {
                this.scroll = true;
            })

            window.addEventListener('scroll', () => {
                if( this.scroll ) {
                    return;
                }

                if (this.pit > window.scrollY || window.scrollY >= ( this.pit - innerHeight ) ) {
                    scrollTo(0, this.pit);
                }
            });
        }
    }
</script>

<style lang="scss">
    .slide-fade-enter-active {
        transition: all 5s cubic-bezier(0.75, 0, 1, 0.75);
    }

    .slide-fade-leave-active {
        transition: all 2s cubic-bezier(0.75, 0, 1, 0.75);
    }

    :root {
        --index: calc(1vw + 1vh)
    }

    .stuck {
        position: fixed;
        height: 100vh;
        width: 100vw;
        z-index: 1000;
    }

    .navigation {
        position: fixed;
        left: 0;
        top: 0;
        min-width: 5vw;
        height: 100vh;
        z-index: 100;
    }

    #app {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: #2c3e50;
        --index: calc(1vw + 1vh);

    }
</style>
