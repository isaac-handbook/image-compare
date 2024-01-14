const imageProcess = require("./phash").imageProcess;
const fs = require("fs");

// const LENGTH = 732;
const LENGTH = 732;

const index = async () => {
  // 遍历 items 文件夹下所有的图片，生成对应的 hash，然后存到 hash.json 中
  const dic = {};
  for (let i = 1; i <= LENGTH; i++) {
    try {
      dic[i] = [
        // 透明
        await imageProcess({
          filePath: `items/${i}.png`,
          needColorFin: true,
        }),

        // 灰色 7F7F7F
        ...(await generateListByColor(i, "#7F7F7F")),

        // 恶魔房 3C3C3C
        ...(await generateListByColor(i, "#3C3C3C")),

        // 一层地下室 8E5B55
        ...(await generateListByColor(i, "#8E5B55")),

        // 天使房 3A7699
        ...(await generateListByColor(i, "#3A7699")),

        // 子宫 C82B29
        ...(await generateListByColor(i, "#C82B29")),
      ];
      console.log(i + " ");
    } catch (error) {
      console.log(i + " " + error);
    }
  }

  // 去重，删除 dic 中所有 phash 值重复的项
  const hashSet = new Set();
  const newDic = {};
  for (let i = 1; i <= LENGTH; i++) {
    const itemId = String(i);
    newDic[itemId] = [];
    if (!dic[itemId]) {
      console.log(itemId + "居然没有");
      console.log(dic[itemId]);
      continue;
    }
    for (let j = 0; j < dic[itemId].length; j++) {
      if (!hashSet.has(dic[itemId][j].phash)) {
        hashSet.add(dic[itemId][j].phash);
        newDic[itemId].push(dic[itemId][j]);
      }
    }
  }

  fs.writeFileSync("hash.json", JSON.stringify(newDic));
};

const generateListByColor = async (i, bgColor) => {
  return [
    // 灰色 7F7F7F
    await imageProcess({
      filePath: `items/${i}.png`,
      bgColor,
      cut: 0,
    }),
    await imageProcess({
      filePath: `items/${i}.png`,
      bgColor,
      cut: 3,
    }),
    await imageProcess({
      filePath: `items/${i}.png`,
      bgColor,
      cut: 6,
    }),
  ];
};

index();
