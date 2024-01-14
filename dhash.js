const { createCanvas, loadImage } = require("canvas");

async function dHash(imagePath, size = 8) {
  const bitsLength = size ** 2;
  const canvas = createCanvas(size + 1, size);
  const context = canvas.getContext("2d");

  // 加载图片
  const image = await loadImage(imagePath);

  // 绘制图片到 canvas 上并转换为灰度图
  context.drawImage(image, 0, 0, size + 1, size);
  const imgData = context.getImageData(0, 0, size + 1, size).data;

  const result = new Array(bitsLength).fill(false);

  for (let i = 0; i < size; i++) {
    const startPos = i * size;
    for (let j = 0; j < size; j++) {
      const pos = (i * (size + 1) + j) * 4;
      const nextPos = pos + 4;
      // 比较当前像素与右侧像素的亮度
      if (getGrayScale(imgData, pos) > getGrayScale(imgData, nextPos)) {
        result[startPos + j] = true;
      }
    }
  }

  return result;
}

function getGrayScale(imgData, pos) {
  const r = imgData[pos];
  const g = imgData[pos + 1];
  const b = imgData[pos + 2];
  // 使用标准的灰度转换公式
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

// 使用示例
dHash("items/1.png")
  .then((hash) => {
    console.log(hash);
  })
  .catch((err) => {
    console.error(err);
  });
