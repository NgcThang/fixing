// frontend/plugins/highcharts.client.js
import * as HighchartsNS from 'highcharts'
import * as ExportingModNS from 'highcharts/modules/exporting'
import * as H3DModNS       from 'highcharts/highcharts-3d'
import * as VarPieModNS    from 'highcharts/modules/variable-pie'
import * as HeatmapModNS   from 'highcharts/modules/heatmap'

// normalize CommonJS vs ESM:
const Highcharts       = HighchartsNS.default       || HighchartsNS
const ExportingModule  = ExportingModNS.default     || ExportingModNS
const Highcharts3D     = H3DModNS.default           || H3DModNS
const VariablePie      = VarPieModNS.default        || VarPieModNS
const Heatmap          = HeatmapModNS.default       || HeatmapModNS

// register modules on the single Highcharts namespace
ExportingModule(Highcharts)
Highcharts3D(Highcharts)
VariablePie(Highcharts)
Heatmap(Highcharts)

// Provide it to your app so every component can `useNuxtApp().$highcharts`
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide('highcharts', Highcharts)
})
