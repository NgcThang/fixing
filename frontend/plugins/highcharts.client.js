// frontend/plugins/highcharts.client.js
import Highcharts       from 'highcharts/highcharts.js'
import ExportingModule  from 'highcharts/modules/exporting.js'
import Highcharts3D     from 'highcharts/highcharts-3d.js'
import VariablePie      from 'highcharts/modules/variable-pie.js'
import Heatmap          from 'highcharts/modules/heatmap.js'

// Register modules on the single Highcharts instance
ExportingModule(Highcharts)
Highcharts3D(Highcharts)
VariablePie(Highcharts)
Heatmap(Highcharts)

// Provide it app-wide via Nuxt’s plugin system
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide('highcharts', Highcharts)
})
