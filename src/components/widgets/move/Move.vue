<template>
  <v-card>
    <v-card-text>
      <v-container>
        <v-row align="center" justify="left">
          <!-- Sol taraftaki yön butonları -->
           <v-row>
            <v-col cols="auto" class="d-flex flex-column align-center" style="gap: 10px;">
            <app-btn-toolhead-move color="primary" icon="$up" />
            <div class="d-flex" style="gap: 10px;">
              <app-btn-toolhead-move color="primary" icon="$left" />
              <app-btn-toolhead-move color="primary" icon="$home" />
              <app-btn-toolhead-move color="primary" icon="$right" />
            </div>
            <app-btn-toolhead-move color="primary" icon="$down" />
          </v-col>

          <!-- Ortadaki dikey butonlar -->
          <v-col cols="auto" class="d-flex flex-column align-center" style="gap: 10px;">
            <app-btn-toolhead-move color="primary" icon="$up" />
            <app-btn-toolhead-move color="primary" icon="$home" />
            <app-btn-toolhead-move color="primary" icon="$down" />
          </v-col>

          <!-- Sağ taraftaki butonlar -->
          <v-col cols="auto" class="d-flex flex-column align-center" style="gap: 10px;">
            <app-btn-toolhead-move color="primary" icon="$home">
              ALl
            </app-btn-toolhead-move>
            <app-btn-toolhead-move color="primary" icon="$home" >
              X
            </app-btn-toolhead-move>
            <app-btn-toolhead-move color="primary" icon="$home" >
              Y
            </app-btn-toolhead-move>
          </v-col>
           </v-row>


          <v-row>
            <v-col cols="auto" class="d-flex flex-column" style="gap: 5px;">
            <!-- X, Y, Z Pozisyonları Yatayda -->
            <div class="d-flex justify-space-between">
              <div class="text-center">
                <v-text-field
                  v-model="newPosition.y"
                  :label="'X: ' + livePosition[0].toFixed(2)"
                  type="number"
                  outlined
                  dense
                  class="small-input"
                />
              </div>

              <div class="text-center">
                <v-text-field
                  v-model="newPosition.y"
                  :label="'Y: ' + livePosition[1].toFixed(2)"
                  type="number"
                  outlined
                  dense
                  class="small-input"
                />
              </div>

              <div class="text-center">
                <v-text-field
                  v-model="newPosition.y"
                  :label="'Z: ' + livePosition[2].toFixed(2)"
                  type="number"
                  outlined
                  dense
                  class="small-input"
                />
              </div>
            </div>

            <!-- Extrude Length ve Speed -->
            <div class="d-flex justify-space-between">
              <div class="text-center">
                <v-text-field
                  v-model="newExtrudeLength"
                  label="Extrude Length"
                  type="number"
                  step="0.01"
                  outlined
                  dense
                  class="small-input"
                />
              </div>

              <div class="text-center">

                <v-text-field
                  v-model="newExtrudeSpeed"
                  label="Extrude Speed"
                  type="number"
                  step="0.01"
                  outlined
                  dense
                  class="small-input"
                />
              </div>
            </div>
          </v-col>
          </v-row>
          <!-- X, Y, Z pozisyonları ve inputları sağ üst köşede -->
          <v-row>
            <v-col cols="auto" class="d-flex flex-column" style="gap: 11px;">
              <div class="d-flex justify-space-between">
                <v-btn>RETRACT<v-icon>$absolutePositioning</v-icon> </v-btn>
                <v-btn>EXTRUDE<v-icon>$chevronDown</v-icon> </v-btn>
              </div>
              <v-btn>RETRACT <v-icon>$chevronUp</v-icon> </v-btn>

              <v-btn>EXTRUDE  <v-icon>$chevronDown</v-icon> </v-btn>
            </v-col>
          </v-row>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import StateMixin from '@/mixins/state'
import BrowserMixin from '@/mixins/browser'

@Component({})
export default class Calibre extends Mixins(StateMixin, BrowserMixin) {
  newPosition = {
    x: 0,
    y: 0,
    z: 0,
  }

  newExtrudeLength = 0
  newExtrudeSpeed = 0

  get livePosition (): [number, number, number, number] {
    return this.$store.state.printer.printer.motion_report?.live_position ?? [0, 0, 0, 0]
  }
}
</script>

<style scoped>
.axis-position {
  margin: 10px 0;  /* Pozisyon metinleri arasındaki boşluk */
}

.text-center {
  text-align: center;
}

.d-flex {
  display: flex;
}

.justify-space-between {
  justify-content: space-between;
}

.small-input {
  max-width: 100px; /* Genişliği sınırladık */
  width: 100%; /* Yatayda tam genişlik */
}

.text-center {
  text-align: center;
}
</style>
