const { createCanvas, loadImage } = require("canvas");
const fs = require("fs");
const path = require("path");
const { getcolorFin } = require("./colorDis");
// const { dctTransform2 } = require("./dct");
const { dctTransform_fft } = require("./dct_fft");
const { dctTransform_fast } = require("./dct_fast");

// DCT函数
function dctTransform(matrix) {
  let N = matrix.length;
  let result = new Array(N).fill(0).map(() => new Array(N).fill(0));

  for (let u = 0; u < N; u++) {
    for (let v = 0; v < N; v++) {
      let sum = 0;
      for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++) {
          sum +=
            matrix[i][j] *
            Math.cos(((2 * i + 1) * u * Math.PI) / (2 * N)) *
            Math.cos(((2 * j + 1) * v * Math.PI) / (2 * N));
        }
      }
      sum *= ((u === 0 ? 1 : 2) * (v === 0 ? 1 : 2)) / (2 * N);
      result[u][v] = sum;
    }
  }
  return result;
}

// 计算感知哈希
function calculatePHash(dctLowFreq) {
  let sum = 0;
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      sum += dctLowFreq[i][j];
    }
  }
  let average = sum / 64;

  let hash = 0n;
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      hash <<= 1n;
      if (dctLowFreq[i][j] >= average) {
        hash |= 1n;
      }
    }
  }

  return hash;
}

// 图片转换为感知哈希
async function imageProcess({
  filePath,
  bgColor = null,
  cut = 0,
  needColorFin = false,
  grayStage = 3,
}) {
  const img = await loadImage(filePath);

  let size = 32;
  if (cut) {
    size += cut * 2;
  }

  const location = (size - 32) / 2;

  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext("2d");

  // 将图片中所有透明的区域填充
  if (bgColor) {
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, size, size);
  }

  // 缩小尺寸
  ctx.drawImage(img, 0, 0, size, size);

  // 简化色彩
  const imageData = ctx.getImageData(location, location, 32, 32).data;

  let grayMatrix = new Array(32).fill(0).map(() => new Array(32).fill(0));
  for (let i = 0; i < imageData.length; i += 4) {
    const gray = Math.floor(
      (imageData[i] + imageData[i + 1] + imageData[i + 2]) / grayStage
    );
    let row = Math.floor(i / 4 / 32);
    let col = (i / 4) % 32;
    grayMatrix[row][col] = gray;
  }

  // 将 grayMatrix 绘制成图片并存储
  const canvas2 = createCanvas(32, 32);
  const ctx2 = canvas2.getContext("2d");
  for (let i = 0; i < grayMatrix.length; i++) {
    for (let j = 0; j < grayMatrix[i].length; j++) {
      ctx2.fillStyle = `rgb(${grayMatrix[i][j]}, ${grayMatrix[i][j]}, ${grayMatrix[i][j]})`;
      ctx2.fillRect(j, i, 1, 1);
    }
  }
  const buffer2 = canvas2.toBuffer("image/png");
  fs.writeFileSync(
    path.join(__dirname, `process/gray_${filePath.replace(/\//g, "")}`),
    buffer2
  );

  // 计算DCT
  // let dctMatrix = dctTransform(grayMatrix);
  let dctMatrix = dctTransform_fast(grayMatrix);
  // let dctMatrix = dctTransform_fft(grayMatrix);

  // 缩小DCT
  let dctLowFreq = dctMatrix.slice(0, 8).map((row) => row.slice(0, 8));

  // 计算感知哈希
  let phash = calculatePHash(dctLowFreq);

  // 计算颜色分部指纹
  let colorFin = [];

  if (needColorFin) {
    colorFin = getcolorFin(imageData);
  }

  return { phash: String(phash), colorFin };
}

// 如果没有 process，则创建一个
if (!fs.existsSync(path.join(__dirname, "process"))) {
  fs.mkdirSync(path.join(__dirname, "process"));
}

module.exports = {
  imageProcess,
};

imageProcess({ filePath: `items/1.png`, bgColor: "#7F7F7F" }).then((res) => {
  console.log(res);
});
