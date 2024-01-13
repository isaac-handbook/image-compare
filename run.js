const imagePHash = require("./hash").imagePHash;
const fs = require("fs");

const index = async () => {
  // 遍历 items 文件夹下所有的图片，生成对应的 hash，然后存到 hash.json 中
  const dic = {};
  for (let i = 1; i <= 732; i++) {
    try {
      // // 图鉴深色
      // const { phash: phash2, colorFin: colorFin2 } = await imagePHash(
      //   `items/${i}.png`,
      //   false,
      //   "#2c2925"
      // );
      // 恶魔房
      // const { phash: phash1, colorFin: colorFin1 } = await imagePHash(
      //   `items/${i}.png`,
      //   false,
      //   "#3C3C3C"
      // );
      // // 一层地下室
      // const { phash: phash2, colorFin: colorFin2 } = await imagePHash(
      //   `items/${i}.png`,
      //   false,
      //   "#8E5B55"
      // );
      // // 天使房
      // const { phash: phash3, colorFin: colorFin3 } = await imagePHash(
      //   `items/${i}.png`,
      //   false,
      //   "#3A7699"
      // );
      // // 灰色
      // const { phash: phash4, colorFin: colorFin4 } = await imagePHash(
      //   `items/${i}.png`,
      //   false,
      //   "#838280"
      // );
      // // 图鉴浅色
      // const { phash: phash5, colorFin: colorFin5 } = await imagePHash(
      //   `items/${i}.png`,
      //   false,
      //   "#FDF5E6"
      // );
      // // 子宫
      // const { phash: phash6, colorFin: colorFin6 } = await imagePHash(
      //   `items/${i}.png`,
      //   false,
      //   "#C82B29"
      // );
      // 中性灰
      const { phash: phash7, colorFin: colorFin7 } = await imagePHash(
        `items/${i}.png`,
        false,
        "#7F7F7F"
      );

      dic[i] = {
        phash: [
          // String(phash1),
          // String(phash2),
          // String(phash3),
          // String(phash4),
          // String(phash5),
          // String(phash6),
          String(phash7),
        ],
        color: [
          // colorFin1,
          // colorFin2,
          // colorFin3,
          // colorFin4,
          // colorFin5,
          // colorFin6,
          colorFin7,
        ],
      };
      console.log(i + " ");
    } catch (error) {
      console.log(i + " " + error);
    }
  }
  // console.log(dic);
  fs.writeFileSync("hash.json", JSON.stringify(dic));
};

index();
