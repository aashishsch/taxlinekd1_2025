const templates = {
  "template1.jpg": {
    imageX: 198,
    imageY: 650,
    radius: 342.5,
    imageSize: 685,
    textX: 540,
    textY: 1465,
    fontSize: 75,
    fontColor: "#9e6f6d",
    fontFamily: "Arial"
  },
  "template2.jpg": {
    imageX: 198,
    imageY: 650,
    radius: 342.5,
    imageSize: 685,
    textX: 540,
    textY: 1465,
    fontSize: 75,
    fontColor: "#005acd",
    fontFamily: "Arial"
  }
};

let cropper;
const imageInput = document.getElementById("imageInput");
const imagePreview = document.getElementById("imagePreview");
const generateBtn = document.getElementById("generateBtn");
const downloadBtn = document.getElementById("downloadBtn");
const canvas = document.getElementById("finalCanvas");

// ✅ Format name: Preserve prefixes like CA, Dr., etc. + Proper Case for name
function formatNameProperCase(str) {
  const preserveCaps = ["CA", "CA.", "CMA", "CMA.", "CS", "CS.", "DR", "DR.", "MR", "MR.", "MS", "MS.", "ADV", "ADV."];
  return str
    .trim()
    .split(/\s+/)
    .map(word => {
      const cleaned = word.replace(/\./g, '').toUpperCase();
      if (preserveCaps.includes(cleaned) || preserveCaps.includes(word.toUpperCase())) {
        return word.toUpperCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
}

// 📤 STEP 1: Load and crop uploaded image
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

// 🖼️ STEP 2: Dynamically update template preview on dropdown change
document.getElementById("templateSelect").addEventListener("change", function () {
  const selectedTemplate = this.value;
  document.getElementById("templatePreview").src = selectedTemplate;
});

// 🧾 STEP 3: Generate final banner with image + name
generateBtn.addEventListener("click", () => {
  let name = document.getElementById("userName").value.trim();
  name = formatNameProperCase(name);

  const templateName = document.getElementById("templateSelect").value;
  const config = templates[templateName];

  if (!name || !cropper || !config) {
    alert("Please enter name, crop image, and select a template.");
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
    ctx.arc(
      config.imageX + config.radius,
      config.imageY + config.radius,
      config.radius,
      0,
      Math.PI * 2
    );
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

  template.src = templateName;
});

// 💾 STEP 4: Download with user name in file (toBlob-based)
downloadBtn.addEventListener("click", () => {
  const canvas = document.getElementById("finalCanvas");
  let name = document.getElementById("userName").value.trim();
  name = formatNameProperCase(name);

  const fileName = name ? name.replace(/\s+/g, "_") + "_banner.png" : "welcome-banner.png";

  canvas.toBlob(function (blob) {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, 'image/png');
});
