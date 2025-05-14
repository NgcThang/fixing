import Highcharts      from 'highcharts/highcharts.js'
import Exporting       from 'highcharts/modules/exporting.js'
import Highcharts3D    from 'highcharts/highcharts-3d.js'
import VariablePie     from 'highcharts/modules/variable-pie.js'
import Heatmap         from 'highcharts/modules/heatmap.js'

// register modules
Exporting(Highcharts)
Highcharts3D(Highcharts)
VariablePie(Highcharts)
Heatmap(Highcharts)

export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.provide('highcharts', Highcharts)
})
