const imagePHash = require("./hash").imagePHash;
const fs = require("fs");

// 创建一个处理单个图片的异步函数
async function processImage(i) {
  console.log("正在处理：" + i);
  try {
    // 恶魔房
    const { phash: phash1, colorFin: colorFin1 } = await imagePHash(
      `items/${i}.png`,
      false,
      "#3C3C3C"
    );
    // 一层地下室
    const { phash: phash2, colorFin: colorFin2 } = await imagePHash(
      `items/${i}.png`,
      false,
      "#8E5B55"
    );
    // 天使房
    const { phash: phash3, colorFin: colorFin3 } = await imagePHash(
      `items/${i}.png`,
      false,
      "#3A7699"
    );
    // 灰色
    const { phash: phash4, colorFin: colorFin4 } = await imagePHash(
      `items/${i}.png`,
      false,
      "#838280"
    );
    // 图鉴浅色
    const { phash: phash5, colorFin: colorFin5 } = await imagePHash(
      `items/${i}.png`,
      false,
      "#FDF5E6"
    );

    return {
      i,
      phash: [
        String(phash1),
        String(phash2),
        String(phash3),
        String(phash4),
        String(phash5),
      ],
      color: [colorFin1, colorFin2, colorFin3, colorFin4, colorFin5],
    };
  } catch (error) {
    console.error(`${i} ${error}`);
    return { i, error };
  }
}

// 总数
const TOTAL = 732;

// 主函数
const index = async () => {
  const dic = {};
  const promises = [];
  const groupSize = 10; // 每次处理的图片数量

  for (let i = 1; i <= TOTAL; i += groupSize) {
    const groupPromises = [];
    for (let j = i; j < i + groupSize && j <= TOTAL; j++) {
      groupPromises.push(processImage(j));
    }
    promises.push(Promise.all(groupPromises));
  }

  const groups = await Promise.all(promises);
  groups.forEach((group) => {
    group.forEach((result) => {
      if (!result.error) {
        dic[result.i] = { phash: result.phash, color: result.color };
      }
    });
  });

  fs.writeFileSync("hash.json", JSON.stringify(dic));
};

index();
