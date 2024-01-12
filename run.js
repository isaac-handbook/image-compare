const imagePHash = require("./hash").imagePHash;
const fs = require("fs");

const index = async () => {
  // 遍历 items 文件夹下所有的图片，生成对应的 hash，然后存到 hash.json 中
  const dic = {};
  for (let i = 1; i <= 732; i++) {
    try {
      // 地下室棕色
      const { phash: phash1 } = await imagePHash(
        `items/${i}.png`,
        false,
        "#663E37"
      );
      // 恶魔房
      const { phash: phash2 } = await imagePHash(
        `items/${i}.png`,
        false,
        "#141414"
      );
      // 较白
      const { phash: phash3 } = await imagePHash(
        `items/${i}.png`,
        false,
        "#C1ACA0"
      );

      dic[i] = [String(phash1), String(phash2), String(phash3)];
      console.log(i + " " + dic[i]);
    } catch (error) {
      console.log(i + " " + error);
    }
  }
  // console.log(dic);
  fs.writeFileSync("hash.json", JSON.stringify(dic));
};

index();
