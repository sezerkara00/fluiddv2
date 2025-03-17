<template>
    <v-card>
        <v-card-text>
            <v-container>
                <v-row align="center" justify="center" class="mb-4">
                    <!-- Tool Buttons -->
                    <v-col cols="auto" v-for="button in butonlar" :key="button.value">
                        <v-btn @click="handleDecrement(button)">
                            -0.1
                        </v-btn>
                        <v-btn
                            color="primary"
                            class="mx-1"
                        >
                            {{ button.text }} {{ button.currentValue }}
                        </v-btn>
                        <v-btn @click="handleIncrement(button)">
                            +0.1
                        </v-btn>
                    </v-col>
                </v-row>
                <v-row align="center" justify="center" class="mb-4">
                    <v-col cols="auto">
                        <v-btn
                            @click="handleStart"
                        >
                            start
                        </v-btn>
                    </v-col>
                </v-row>
            </v-container>
        </v-card-text>
    </v-card>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

interface ButtonData {
    text: string
    value: string
    currentValue: number
}
@Component
export default class ZeManuell extends Vue {
    private butonlar: ButtonData[] = [
        { text: 'Kala0', value: 'k0', currentValue: 10.020 },
        { text: 'Kala1', value: 'k1', currentValue: 11.020 },
        { text: 'Kala2', value: 'k2', currentValue: 12.020 },
        { text: 'Kala3', value: 'k3', currentValue: 13.020 }
    ]
    created() {
        const savedValues = localStorage.getItem('butonlarData')
        if (savedValues) {
            this.butonlar = JSON.parse(savedValues) as ButtonData[]
        }
    }
    saveToStorage() {
        localStorage.setItem('butonlarData', JSON.stringify(this.butonlar))
    }


    handleStart() {
        for (const button of this.butonlar) {
            console.log(button.text, button.value, button.currentValue)
        }
    }

    handleDecrement(button: ButtonData) {
        button.currentValue = +(button.currentValue - 0.1).toFixed(3)
        this.saveToStorage()
    }

    handleIncrement(button: ButtonData) {
        button.currentValue = +(button.currentValue + 0.1).toFixed(3)
        this.saveToStorage()
    }

}
</script>

