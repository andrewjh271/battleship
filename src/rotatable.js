/* eslint-disable no-param-reassign */
const rotateButton = document.querySelector('.rotate');
rotateButton.addEventListener('click', rotate);

let currentStagedImage;

function rotate() {
  if (!currentStagedImage) return;
  const rotation = Number(currentStagedImage.style.transform.match(/\d+(?=deg)/)) % 360;
  currentStagedImage.style.transform = `rotate(${rotation + 90}deg)`;
}

function setStagedImage(current) {
  currentStagedImage = current;
}

function adjustForRotation(draggedImage, newImage) {
  const rotation = Number(draggedImage.style.transform.match(/\d+(?=deg)/)) % 360;
  if (!rotation) return;
  switch (rotation) {
    case 90:
      newImage.style.transform = `translateX(${newImage.style.height}) rotate(${rotation}deg)`;
      break;
    case 180:
      newImage.style.transform = `translateY(100%) translateX(100%) rotate(${rotation}deg)`;
      break;
    default: // 270
      newImage.style.transform = `translateY(${newImage.style.width}) rotate(${rotation}deg)`;
  }
  if (rotation !== 180) {
    [draggedImage.spanY, draggedImage.spanX] = [draggedImage.spanX, draggedImage.spanY];
  }
}

function resetRotationAdjustment(image) {
  const rotation = Number(image.style.transform.match(/\d+(?=deg)/));
  const { height, width } = image.style;
  if (rotation === 90) {
    image.style.transform = image.style.transform.replace(/\d+px/, height); // replace translateX value
  } else if (rotation === 270) {
    image.style.transform = image.style.transform.replace(/\d+px/, width); // replace translateY value
  }
}

export { rotate, setStagedImage, adjustForRotation, resetRotationAdjustment };
