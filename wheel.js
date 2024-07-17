const prizes = [
  { text: "10% Off", color: "hsl(197 30% 43%)" },
  { text: "Free goodie", color: "hsl(173 58% 39%)" },
  { text: "No Money for delivery", color: "hsl(43 74% 66%)" },
  { text: "Half Offer Price", color: "hsl(27 87% 67%)" },
  { text: "70% OFF", color: "hsl(12 76% 61%)" },
  { text: "Free Watch", color: "hsl(350 60% 52%)" },
  { text: "40% OFF", color: "hsl(91 43% 54%)" },
  { text: "Better luck next time", color: "hsl(140 36% 74%)" }
];

const spinner = document.getElementById("spinner");
const spinButton = document.getElementById("spinButton");
const popup = document.getElementById("popup");
const offerText = document.getElementById("offerText");
const closePopup = document.getElementById("closePopup");

const prizeSlice = 360 / prizes.length;
const prizeOffset = Math.floor(180 / prizes.length);
let rotation = 0;
let currentSlice = 0;
let spinning = false;

prizes.forEach(({ text, color }, i) => {
  const rotation = (prizeSlice * i) - prizeOffset;
  const prizeElement = document.createElement("li");
  prizeElement.classList.add("prize");
  prizeElement.style.setProperty("--rotate", `${rotation}deg`);
  prizeElement.style.backgroundColor = color;
  prizeElement.innerHTML = `<span class="text">${text}</span>`;
  spinner.appendChild(prizeElement);
});

spinButton.addEventListener("click", () => {
  if (spinning) return;

  spinning = true;
  rotation = Math.floor(Math.random() * 360 + 360 * 5);
  spinner.style.transition = "transform 4s cubic-bezier(0.3, 1, 0.2, 1)";
  spinner.style.transform = `rotate(${rotation}deg)`;
});

spinner.addEventListener("transitionend", () => {
  spinner.style.transition = "none";
  const normalizedRotation = rotation % 360;
  spinner.style.transform = `rotate(${normalizedRotation}deg)`;
  spinning = false;

  const selectedPrizeIndex = Math.floor(normalizedRotation / prizeSlice);
  const selectedPrize = prizes[prizes.length - 1 - selectedPrizeIndex];
  offerText.textContent = `You won: ${selectedPrize.text}`;
  popup.style.display = "flex";
});

closePopup.addEventListener("click", () => {
  popup.style.display = "none";
});
