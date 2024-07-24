<template>
  <div>
    <h2>Image Downloader</h2>
    <div class="drop-area" @dragover.prevent="isDragging = true" @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop" :style="{ backgroundColor: isDragging ? 'transparent' : '#fff' }">
      Drag and drop file here
    </div>
    <input type="file" ref="fileInput" style="display:none;" @change="handleFileInput">
    <canvas ref="canvas" style="display:none;"></canvas>
    <div class="d-flex justify-center">
      <input type="checkbox" id="convertwebptopng" v-model="convertwebptopngVal">
      <label for="convertwebptopng"> Convert WEBP to PNG</label>
    </div>
    <div class="content">
      To use this, just drag and drop images onto the box above, then it will automatically download the image
    </div>
  </div>
</template>

<script lang="ts">
export default {
  data() {
    return {
      isDragging: false,
      convertwebptopngVal: true
    };
  },
  methods: {
    handleDrop(event: any) {
      this.isDragging = false;
      (this.$refs.fileInput as HTMLInputElement).files = event.dataTransfer.files;
      this.handleFile((this.$refs.fileInput as HTMLInputElement).files[0]);
    },
    handleFileInput(event: any) {
      this.handleFile(event.target.files[0]);
    },
    handleFile(file: any) {
      if (file.type === 'image/webp' || file.type === 'image/png' || file.type === 'image/jpeg') {
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new Image() as HTMLImageElement;
          img.onload = () => {
            const canvas = this.$refs.canvas;
            const ctx = (this.$refs.canvas as HTMLCanvasElement).getContext('2d');
            (canvas as HTMLCanvasElement).width = (img as HTMLImageElement).width;
            (canvas as HTMLCanvasElement).height = (img as HTMLImageElement).height;
            ctx.drawImage(img, 0, 0);
            (canvas as HTMLCanvasElement).toBlob((blob) => {
              const downloadLink = document.createElement('a');
              downloadLink.href = URL.createObjectURL(blob);
              downloadLink.download = this.convertwebptopngVal ? file.name.replace(/\.(webp)$/, '.png') : file.name;
              document.body.appendChild(downloadLink);
              downloadLink.click();
              document.body.removeChild(downloadLink);
              URL.revokeObjectURL(downloadLink.href);
            }, 'image/png', 0.8);
          };
          img.src = event.target.result as string;
        };
        reader.readAsDataURL(file);
      } else {
        console.log('File type is not supported');
      }
    }
  }
};
</script>

<style scoped>
* {
  user-select: none;
}

body {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  max-height: 100vh;
  max-width: 100vw;
  background: #f2f2f2;
  gap: 10px;
}

.drop-area {
  width: 200px;
  height: 200px;
  border: 2px dashed #ccc;
  text-align: center;
  line-height: 200px;
  margin: 20px auto;
  border-radius: 12px;
  background: #fff;
  color: #000;
  ;
}

.content {
  width: 400px;
  text-align: center;
}

.d-flex {
  display: flex;
}

.justify-center {
  justify-content: center;
}
</style>
