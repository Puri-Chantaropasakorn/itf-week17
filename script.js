"use strict";

/* =========================================================
   ข้อมูลเมนูอาหารใต้ 5 เมนู
   รูปภาพอ้างอิงจากโฟลเดอร์ img/ โดยตรง
   ========================================================= */

const foods = [
  {
    name: "หมูฮ้อง",
    image: "img/หมูฮ้อง.jpg",
    alt: "จานหมูฮ้อง หมูสามชั้นเคี่ยวสีน้ำตาลเข้มโรยผักชี",
    description:
      "หมูสามชั้นเคี่ยวกับพะโล้และเครื่องเทศแบบภูเก็ตจนนุ่มสีน้ำตาลเข้ม หอมพริกไทย กระเทียม และซีอิ๊ว กลมกล่อมแบบต้นตำรับ",
    price: 159,
    tags: ["ภูเก็ต", "เคี่ยวพะโล้"]
  },
  {
    name: "คั่วกลิ้ง",
    image: "img/คั่วกลิ้ง.jpg",
    alt: "จานคั่วกลิ้ง หมูสับผัดพริกแกงใต้จนแห้ง",
    description:
      "หมูสับผัดพริกแกงใต้กับขมิ้นจนแห้งหอมเครื่องเทศ เผ็ดร้อนปลายลิ้น เสิร์ฟคู่ผักสดและข้าวสวยร้อน ๆ",
    price: 89,
    tags: ["พริกแกงใต้", "เผ็ดร้อน"]
  },
  {
    name: "แกงส้ม",
    image: "img/แกงส้ม.jpg",
    alt: "ชามแกงส้มปลาแบบปักษ์ใต้ น้ำแกงสีเหลืองจากขมิ้น",
    description:
      "แกงส้มปักษ์ใต้ที่ใส่ขมิ้นลงในน้ำแกง รสเปรี้ยว เค็ม เผ็ด กลมกล่อม พร้อมปลาและผักตามฤดูกาล",
    price: 129,
    tags: ["ขมิ้น", "เปรี้ยวกลมกล่อม"]
  },
  {
    name: "แกงมัสมั่น",
    image: "img/แกงมัสมั่น.jpg",
    alt: "ชามแกงมัสมั่นไก่กะทิ หอมเครื่องเทศและถั่วลิสง",
    description:
      "แกงกะทิไก่หอมเครื่องเทศ อบเชย โป๊ยกั้ก และถั่วลิสง รสเข้มข้นมันนุ่ม ได้อิทธิพลวัฒนธรรมมุสลิมภาคใต้",
    price: 149,
    tags: ["กะทิ", "เครื่องเทศ"]
  },
  {
    name: "ขนมจีน",
    image: "img/ขนมจีน.jpg",
    alt: "จานขนมจีนเส้นขาวราดน้ำยาปักษ์ใต้และพริกแห้ง",
    description:
      "เส้นขนมจีนนุ่ม ๆ ราดน้ำยาปักษ์ใต้หอมขมิ้นกะทิ กินคู่ผักสดหลากชนิด เมนูเรียบง่ายที่ขาดไม่ได้ในภาคใต้",
    price: 79,
    tags: ["น้ำยาปักษ์ใต้", "ผักสด"]
  }
];

/* =========================================================
   อ้างอิงองค์ประกอบในหน้าเว็บ
   ========================================================= */

const foodCard = document.getElementById("foodCard");
const foodImageA = document.getElementById("foodImageA");
const foodImageB = document.getElementById("foodImageB");
const foodName = document.getElementById("foodName");
const foodKicker = document.getElementById("foodKicker");
const foodDescription = document.getElementById("foodDescription");
const foodPrice = document.getElementById("foodPrice");
const foodPriceValue = document.getElementById("foodPriceValue");
const foodTags = document.getElementById("foodTags");
const currentNumber = document.getElementById("currentNumber");
const menuCount = document.getElementById("menuCount");
const randomButton = document.getElementById("randomButton");
const liveStatus = document.getElementById("liveStatus");

const animatedTextElements = [
  foodKicker,
  foodName,
  foodDescription,
  foodPrice,
  foodTags
];
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let currentIndex = 0;
let activeImage = foodImageA;
let isShuffling = false;

/* =========================================================
   ระบบโหลดรูปภาพล่วงหน้า
   ========================================================= */

const imageCache = new Map();

function loadImage(src) {
  if (!imageCache.has(src)) {
    const promise = new Promise((resolve) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => resolve(null);
      image.src = src;
    });

    imageCache.set(src, promise);
  }

  return imageCache.get(src);
}

foods.forEach((food) => loadImage(food.image));

/* =========================================================
   ฟังก์ชันช่วยเหลือ
   ========================================================= */

function formatNumber(number) {
  return String(number).padStart(2, "0");
}

function wait(milliseconds) {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

function getNextIndex() {
  if (foods.length < 2) {
    return 0;
  }

  // เลือกเมนูอื่นเสมอ เพื่อให้เห็นการเปลี่ยนแปลงชัดเจน
  const offset = 1 + Math.floor(Math.random() * (foods.length - 1));
  return (currentIndex + offset) % foods.length;
}

function crossfadeImage(nextDish) {
  const currentImage = activeImage;
  const nextImage = activeImage === foodImageA ? foodImageB : foodImageA;

  nextImage.src = nextDish.image;
  nextImage.alt = nextDish.alt;
  nextImage.removeAttribute("aria-hidden");
  nextImage.classList.remove("is-active");

  currentImage.classList.remove("is-active");
  currentImage.setAttribute("aria-hidden", "true");

  // บังคับให้เบราว์เซอร์รับสถานะ opacity เริ่มต้นก่อนเริ่ม crossfade
  void nextImage.offsetWidth;
  nextImage.classList.add("is-active");

  activeImage = nextImage;
}

function updateTags(tags) {
  const tagElements = tags.map((tag) => {
    const item = document.createElement("li");
    item.className = "tag";
    item.textContent = tag;
    return item;
  });

  foodTags.replaceChildren(...tagElements);
}

function replayTextAnimation() {
  animatedTextElements.forEach((element) => {
    element.classList.remove("is-revealing");
  });

  // รีเซ็ต animation ให้เล่นใหม่ทุกครั้งที่กดสุ่ม
  void foodCard.offsetWidth;

  animatedTextElements.forEach((element) => {
    element.classList.add("is-revealing");
  });
}

function renderFood(index) {
  const dish = foods[index];

  crossfadeImage(dish);
  foodName.textContent = dish.name;
  foodDescription.textContent = dish.description;
  foodPriceValue.textContent = `฿${dish.price.toLocaleString("en-US")}`;
  updateTags(dish.tags);

  currentNumber.textContent = formatNumber(index + 1);
  menuCount.setAttribute(
    "aria-label",
    `เมนูที่ ${index + 1} จาก ${foods.length}`
  );

  replayTextAnimation();
  liveStatus.textContent = `สุ่มได้เมนู ${dish.name} ราคา ${dish.price} บาท`;
}

/* =========================================================
   การทำงานของปุ่มสุ่มอาหาร
   ========================================================= */

async function shuffleFood() {
  if (isShuffling) {
    return;
  }

  isShuffling = true;
  foodCard.classList.add("is-shuffling");
  randomButton.setAttribute("aria-busy", "true");
  randomButton.setAttribute("aria-disabled", "true");

  const nextIndex = getNextIndex();
  const nextDish = foods[nextIndex];
  const shuffleDelay = prefersReducedMotion ? 0 : 520;

  try {
    // รอทั้งจังหวะ animation และการเตรียมรูปภาพให้พร้อมก่อนแสดงผล
    await Promise.all([wait(shuffleDelay), loadImage(nextDish.image)]);

    currentIndex = nextIndex;
    renderFood(currentIndex);
  } finally {
    foodCard.classList.remove("is-shuffling");
    randomButton.removeAttribute("aria-busy");
    randomButton.removeAttribute("aria-disabled");
    isShuffling = false;
  }
}

randomButton.addEventListener("click", shuffleFood);

// เตรียมข้อความเริ่มต้นให้ตรงกับข้อมูลใน JavaScript
menuCount.setAttribute("aria-label", `เมนูที่ 1 จาก ${foods.length}`);
document.querySelector(".menu-total").textContent = formatNumber(foods.length);
