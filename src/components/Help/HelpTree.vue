<template>
    <v-treeview :items="treeItems"
                open-all
                open-on-click
                class="transparent"
    >

        <template v-slot:prepend="{ item, open }">
            <v-icon v-if="item.children">
                {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
            </v-icon>
            <v-icon v-else>
                mdi-comment-question-outline
            </v-icon>
        </template>

        <template v-slot:label="{ item }">
            <v-card-text v-on:click.self="onHelpClick(item)">
                {{ item.name }}
            </v-card-text>
        </template>
    </v-treeview>
</template>

<script>
    import {helpItems} from "./helpTreeItems";
    import {eventBus} from "../../eventBus";

    export default {
        name: "HelpTree",
        data: () => {
            return {
                treeItems: helpItems
            }
        },
        methods: {
            onHelpClick(item) {
                if (!item.children) {
                    eventBus.$emit('help-open', item);
                }
            }
        }
    }
</script>

<style scoped>

</style>
