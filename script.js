
const templates = {
  "template1.jpg": {
    imageX: 198,
    imageY: 650,
    radius: 342.5,
    imageSize: 685,
    textX: 540,
    textY: 1465,
    fontSize: 75,
    fontColor: "#ff873d",
    fontFamily: "Arial"
  },
  "template2.jpg": {
    imageX: 340,
    imageY: 760,
    radius: 200,
    imageSize: 400,
    textX: 540,
    textY: 1380,
    fontSize: 48,
    fontColor: "#000000",
    fontFamily: "Arial"
  }
};

let cropper;
const imageInput = document.getElementById("imageInput");
const imagePreview = document.getElementById("imagePreview");
const generateBtn = document.getElementById("generateBtn");
const downloadBtn = document.getElementById("downloadBtn");
const canvas = document.getElementById("finalCanvas");

imageInput.addEventListener("change", function () {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function () {
      imagePreview.src = reader.result;
      if (cropper) cropper.destroy();
      cropper = new Cropper(imagePreview, {
        aspectRatio: 1,
        viewMode: 1,
        background: false,
      });
    };
    reader.readAsDataURL(file);
  }
});

generateBtn.addEventListener("click", () => {
  const name = document.getElementById("userName").value.trim();
  const templateName = document.getElementById("templateSelect").value;
  const config = templates[templateName];

  if (!name || !cropper || !config) {
    alert("Please enter name, crop image and select a template.");
    return;
  }

  const croppedCanvas = cropper.getCroppedCanvas({
    width: config.imageSize,
    height: config.imageSize
  });

  const profileImg = new Image();
  profileImg.src = croppedCanvas.toDataURL();

  const template = new Image();
  template.onload = () => {
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(template, 0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.beginPath();
    ctx.arc(config.imageX + config.radius, config.imageY + config.radius, config.radius, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(profileImg, config.imageX, config.imageY, config.imageSize, config.imageSize);
    ctx.restore();

    ctx.font = `bold ${config.fontSize}px ${config.fontFamily}`;
    ctx.fillStyle = config.fontColor;
    ctx.textAlign = "center";
    ctx.fillText(name, config.textX, config.textY);

    canvas.style.display = "block";
    downloadBtn.style.display = "inline-block";
  };
  template.src = templatePreview;
});

downloadBtn.addEventListener("click", () => {
  const canvas = document.getElementById("finalCanvas");
  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = "welcome-banner.png";
  link.click();
});
// ✅ Place it after both buttons
document.getElementById("templateSelect").addEventListener("change", function () {
  const selectedTemplate = this.value;
  document.getElementById("templatePreview").src = selectedTemplate;
});
