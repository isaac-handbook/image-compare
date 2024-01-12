const imagePHash = require("./hash").imagePHash;

// 比较两个哈希值并计算汉明距离
function hammingDistance(hash1, hash2) {
  let difference = 0n;
  // hash1 = BigInt(String(hash1));
  // hash2 = BigInt(String(hash2));
  let xor = hash1 ^ hash2;
  while (xor) {
    difference += xor & 1n;
    xor >>= 1n;
  }
  return Number(difference); // 将BigInt转换为普通的数字
}

// 用余弦相似度计算两个哈希值的相似度
// function cosineSimilarity(hash1, hash2) {
//   let num = 0;
//   let sq1 = 0;
//   let sq2 = 0;
//   for (let i = 0; i < 64; i++) {
//     num += hash1[i] * hash2[i];
//     sq1 += hash1[i] * hash1[i];
//     sq2 += hash2[i] * hash2[i];
//   }
//   return num / (Math.sqrt(sq1) * Math.sqrt(sq2));
// }
function cosineSimilarity(hash1, hash2) {
  // hash1 hash2 是bigint，转成数组
  let sampleFingerprint = [];
  let targetFingerprint = [];
  while (hash1) {
    sampleFingerprint.unshift(Number(hash1 & 1n));
    hash1 >>= 1n;
  }
  while (hash2) {
    targetFingerprint.unshift(Number(hash2 & 1n));
    hash2 >>= 1n;
  }
  const length = sampleFingerprint.length;
  let innerProduct = 0;
  for (let i = 0; i < length; i++) {
    innerProduct += sampleFingerprint[i] * targetFingerprint[i];
  }
  let vecA = 0;
  let vecB = 0;
  for (let i = 0; i < length; i++) {
    vecA += sampleFingerprint[i] ** 2;
    vecB += targetFingerprint[i] ** 2;
  }
  const outerProduct = Math.sqrt(vecA) * Math.sqrt(vecB);
  return innerProduct / outerProduct;
}

// 计算两张图片的pHash并比较它们
async function compareImages(file1, file2) {
  const { phash: phash1 } = await imagePHash(file1);
  const { phash: phash2 } = await imagePHash(file2);

  const phashDistance = hammingDistance(phash1, phash2);
  const cosine = cosineSimilarity(phash1, phash2);

  return { phashDistance, cosine };
}

const prefix = "else/";

const p1 = "硫磺火.png";
const p2 = "狗头1.jpg";

compareImages(prefix + p1, prefix + p2).then((distance) => {
  console.log(`${p1} | ${p2}`);
  console.log(`汉明距离-汉明距离 = ${distance.phashDistance}`);
  console.log(`汉明距离-预先相似度 = ${distance.cosine}`);
});
