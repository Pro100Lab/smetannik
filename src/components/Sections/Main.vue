<template>
    <div>
        <v-card class="home__intro elevation-0 transparent">
            <v-card-title class="home__intro-title">
                Знакомьтесь: SMETANNIK
            </v-card-title>
            <v-card-subtitle class="home__intro-subtitle">
                - сервис по распознаванию смет
            </v-card-subtitle>
        </v-card>

        <v-card class="home__benefits elevation-0 transparent">
            <v-card-title class="home__benefits-title text-break" data-speed="1.15">
                Распознаем смету в 3 простых шага:
            </v-card-title>
            <v-card-text class="home__benefits-subtitle" data-speed="1.1">
                1. Выберите необходимые шаблоны<br/>
                2. Загрузите смету<br/>
                3. Получите ключевые работы
            </v-card-text>
            <v-card-actions class="d-flex flex-row justify-end">
                <v-btn class="elevation-0" block v-on:click="letsGo">
                    Приступить →
                </v-btn>
            </v-card-actions>
        </v-card>

        <v-card
                class="home__card-info home__interactive home__interactive-position home__interactive-grid elevation-0 transparent"
                data-speed="1.2">
            <div class="d-flex flex-row justify-center mr-16">
            <v-img class="interactive__excel rotate-left"
                   :src="require('../../assets/estimates/empty.png')"
                   data-speed="1.7"
                   contain
            >
            </v-img>

            <v-img class="interactive__excel middle"
                   :src="require('../../assets/estimates/empty.png')"
                   data-speed="1.2"
                   contain
                   style="transform: scale(0.8)"
            >
            </v-img>

            <v-img class="interactive__excel rotate-right"
                   :src="require('../../assets/estimates/empty.png')"
                   data-speed="1.3"
                   contain
            >

            </v-img>
            </div>
        </v-card>
    </div>
</template>

<script>
    import {eventBus} from "../../eventBus";

    export default {
        name: "Main",
        data: () => {
            return {
                user: null
            }
        },
        methods: {
          letsGo() {
              if (this.user.isAuthorized) {
                  eventBus.$emit('wants-scroll','.section__recognize')
              } else {
                  eventBus.$emit('wants-login');
              }
          }
        },
        mounted() {
            this.user = this.$user;
        },
        watch: {
            $user() {
                this.user = this.$user;
            }
        }
    }
</script>

<style scoped>
    .home__intro {
        position: absolute;
        top: 10vh;
        left: 40vw;
        width: 30vw;
        max-height: 30vh;
    }

    .home__intro-title {
        overflow-wrap: break-word;
        font-size: calc(var(--index) * 1.2);
        z-index: 2;
    }

    .home__intro-subtitle {
        font-size: calc(var(--index) * .8);
        margin-top: calc(var(--index) * .2);
        text-align: end;
    }

    .home__benefits {
        display: flex;
        flex-direction: column;
        position: relative;
        top: 60vh;
        width: 25vw;

        max-height: 40vh;
    }

    .home__benefits-title {
        font-size: calc(var(--index) * 1.1);
        font-weight: 500;
        letter-spacing: calc(var(--index) * .01);
    }

    .home__benefits-subtitle {
        font-size: calc(var(--index) * .8);
        font-weight: 100;
        line-height: calc(var(--index) * 1.3);
        margin-bottom: 10px;
    }

    .home__card-info {
        will-change: transform;
    }

    .home__interactive-grid {
        background-image: url("../../assets/grid.png");
        background-position: bottom;
        background-size: 100% auto
    }

    .home__interactive-position {
        position: absolute;

        width: 40vw;
        height: 50vh;

        top: 15vh;
        left: 35vw;
    }

    .home__interactive {
        display: flex;
        flex-direction: row;
        justify-content: center;
        perspective: 800px;
    }

    .interactive__excel {
        position: relative;
        min-width: 7vw;
        max-width: 15vw;
        z-index: 3;
        will-change: transform;
    }

    .middle {
        top: 2vh;
        left: -2vw;
    }

    .rotate-left {
        transform: rotateY(60deg) rotateZ(-25deg);
        transform-origin: left center;
        top: 15vh;
        left: 5vw;
    }

    .rotate-right {
        transform: rotateY(-60deg) rotateZ(25deg);
        transform-origin: right center;
        top: 14vh;
        right: 9vw;
    }
</style>
