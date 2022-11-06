<template>
    <v-card v-if="blocks && blocks.length > 0" class="overflow-y-auto overflow-x-hidden">
        <v-card-title>
            {{name}}
        </v-card-title>
        <v-divider></v-divider>
        <v-card v-for="block of blocks" :key="block.id" class="transparent elevation-0">
            <v-card-title v-html="block.title">
            </v-card-title>
            <v-card-subtitle v-html="block.text">
            </v-card-subtitle>
            <v-row v-if="block.images">
                <v-col v-for="image of block.images" :key="image">
                    <v-img contain :src="image"></v-img>
                </v-col>
            </v-row>
        </v-card>
    </v-card>
</template>

<script>
    import {eventBus} from "../../eventBus";
    import {helpTexts} from "./helpTreeItems";

    export default {
        name: "HelpView",
        data: () => {
            return {
                blocks: [],
                name: null
            }
        },
        mounted() {
            eventBus.$on('help-open', item => {
                this.blocks = helpTexts[item.id]
                this.name = item.name
            })
        }
    }
</script>

<style scoped>

</style>
