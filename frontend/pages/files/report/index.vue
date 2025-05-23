<template>
  <section class="section">
    <div class="container">
      <div v-if="isLoading" class="has-text-centered my-6">
        <p>Đang tải báo cáo...</p>
      </div>

      <div v-else>
        <!-- Original Reports -->
        <h2 class="title">📈 Báo cáo gốc ban đầu</h2>
        <div id="chart-browser" class="chart-container"></div>
        <div id="chart-platform" class="chart-container"></div>
        <div id="chart-region" class="chart-container"></div>
        <div id="chart-created" class="chart-container"></div>

        <!-- Pie Chart Variants -->
        <h2 class="title">🍊 Pie Chart Variants</h2>
        <div id="chart-basic-pie" class="chart-container"></div>
        <div id="chart-donut-pie" class="chart-container"></div>
        <div id="chart-semi-pie" class="chart-container"></div>

        <!-- Column / Bar Charts -->
        <h2 class="title">🏋️ Column / Bar Charts</h2>
        <div id="chart-column-basic" class="chart-container"></div>
        <div id="chart-column-stacked" class="chart-container"></div>
        <div id="chart-bar-horizontal" class="chart-container"></div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useHead, useRoute, navigateTo, useRuntimeConfig } from '#app'

// 1️⃣ Inject Highcharts + modules via CDN
useHead({
  script: [
    { src: 'https://code.highcharts.com/highcharts.js',            defer: true },
    { src: 'https://code.highcharts.com/highcharts-3d.js',         defer: true },
    { src: 'https://code.highcharts.com/modules/variable-pie.js',  defer: true },
    { src: 'https://code.highcharts.com/modules/heatmap.js',       defer: true }
  ]
})

const isLoading = ref(true)
const route     = useRoute()
const { public: { apiBase } } = useRuntimeConfig()

// Poll until Highcharts.chart exists
async function createChart(containerId, options) {
  while (!(window.Highcharts && typeof window.Highcharts.chart === 'function')) {
    await new Promise(r => setTimeout(r, 50))
  }
  window.Highcharts.chart(containerId, options)
}

onMounted(async () => {
  if (process.server) return

  // 2️⃣ file_id guard
  const fileId = route.query.file_id
  if (!fileId) {
    alert('Thiếu file_id (ví dụ ?file_id=1). Quay về danh sách.')
    return navigateTo('/files')
  }

  try {
    // 3️⃣ fetch prebuilt report payload
    const res  = await fetch(`${apiBase}/api/report/token?file_id=${fileId}`)
    const data = await res.json()
    if (!res.ok || data.error) {
      throw new Error(data.error || 'Lỗi từ server')
    }

    // ——————————————————————————————————————
    // ✂️ **MOVED** spinner toggle **before** any createChart() calls:
    isLoading.value = false
    // ——————————————————————————————————————

    // 4️⃣ render all charts:

    await createChart('chart-browser', {
      chart: { type: 'pie' },
      title: { text: '🥧 Trình duyệt phổ biến' },
      series: [{
        name: 'Count',
        colorByPoint: true,
        data: data.browsers.map(([n,y]) => ({ name: n, y }))
      }]
    })

    await createChart('chart-platform', {
      chart: { type: 'column' },
      title: { text: '📊 Nền tảng sử dụng' },
      xAxis: { type: 'category' },
      yAxis: { title: { text: 'Count' } },
      series: [{ name: 'Platform', data: data.platforms }]
    })

    await createChart('chart-region', {
      chart: { type: 'pie', options3d: { enabled: true, alpha: 45 } },
      title: { text: '🥧 Khu vực truy cập (3D)' },
      plotOptions: { pie: { innerSize: 50, depth: 45 } },
      series: [{ name: 'Count', data: data.regions.map(([n,y]) => ({ name: n, y })) }]
    })

    await createChart('chart-created', {
      chart: { type: 'line' },
      title: { text: '📈 Token tạo theo ngày' },
      xAxis: { categories: data.created_per_day.map(([d]) => d) },
      yAxis: { title: { text: 'Count' } },
      series: [{ name: 'Tokens', data: data.created_per_day.map(([_,c]) => c) }]
    })

    // Pie variants
    await createChart('chart-basic-pie', {
      chart: { type: 'pie' },
      title: { text: '🥧 Basic Pie' },
      series: [{ data: data.browsers.map(([n,y]) => ({ name: n, y })) }]
    })

    await createChart('chart-donut-pie', {
      chart: { type: 'pie' },
      title: { text: '🍩 Donut Pie' },
      plotOptions: { pie: { innerSize: '50%' } },
      series: [{ data: data.platforms }]
    })

    await createChart('chart-semi-pie', {
      chart: { type: 'pie' },
      title: { text: '🥟 Semi-circle Pie' },
      plotOptions: {
        pie: {
          startAngle: -90,
          endAngle: 90,
          center: ['50%','75%'],
          size: '110%'
        }
      },
      series: [{ data: data.regions.map(([n,y]) => ({ name: n, y })) }]
    })

    // Column / Bar Charts
    await createChart('chart-column-basic', {
      chart: { type: 'column' },
      title: { text: '📦 Column Chart' },
      xAxis: { type: 'category' },
      yAxis: { title: { text: 'Count' } },
      series: [{ data: data.platforms }]
    })

    await createChart('chart-column-stacked', {
      chart: { type: 'column' },
      title: { text: '🧱 Stacked Column' },
      xAxis: { type: 'category' },
      yAxis: { min: 0, title: { text: 'Total' }, stackLabels: { enabled: true } },
      plotOptions: { column: { stacking: 'normal' } },
      series: [
        { name: 'Mobile',  data: data.regions.map(([n,y]) => [n, Math.floor(y*0.6)]) },
        { name: 'Desktop', data: data.regions.map(([n,y]) => [n, Math.floor(y*0.4)]) }
      ]
    })

    await createChart('chart-bar-horizontal', {
      chart: { type: 'bar' },
      title: { text: '📊 Bar Chart' },
      xAxis: { type: 'category' },
      yAxis: { title: { text: 'Count' } },
      series: [{ data: data.regions.slice(0,10) }]
    })

  }
  catch (err) {
    console.error('Chart error:', err)
    alert('Lỗi chart: ' + err.message)
  }
})
</script>

<style>
.chart-container {
  margin: 40px 0;
  height: 400px;
}
</style>
