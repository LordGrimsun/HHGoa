// ---------------------------------------------------- //
// Space Brotherss Pass Generator - App Logic           //
// ---------------------------------------------------- //

document.addEventListener('DOMContentLoaded', () => {
  // Navigation & View Elements
  const views = {
    landing: document.getElementById('landing-view'),
    customize: document.getElementById('customize-view'),
    success: document.getElementById('success-view')
  };
  
  const startBtn = document.getElementById('start-btn');
  const logoBrandBtn = document.getElementById('logo-brand-btn');
  const navCreateBtn = document.getElementById('nav-create-btn');
  const createAnotherBtn = document.getElementById('create-another-btn');
  
  // Customizer Input Elements
  const inputName = document.getElementById('input-name');
  const inputRole = document.getElementById('input-role');
  const fileInput = document.getElementById('file-input');
  const photoDropzone = document.getElementById('photo-dropzone');
  
  // Cropper Preview Elements
  const cropPreviewCard = document.getElementById('crop-preview-card');
  const cropPreviewImg = document.getElementById('crop-preview-img');
  const cropCircleContainer = document.getElementById('crop-circle-container');
  const zoomSlider = document.getElementById('zoom-slider');
  const resetCropBtn = document.getElementById('reset-crop-btn');
  const removePhotoBtn = document.getElementById('remove-photo-btn');
  
  // Card Preview elements
  const passCardElement = document.getElementById('pass-card-element');
  const cardPhotoImg = document.getElementById('card-photo-img');
  const cardPhotoPlaceholder = document.getElementById('card-photo-placeholder');
  const cardNameText = document.getElementById('card-name-text');
  const cardRoleText = document.getElementById('card-role-text');
  const cardQrImg = document.getElementById('card-qr-img');
  const cardIdText = document.getElementById('card-id-text');
  
  // Generate & Success Screen elements
  const generateBtn = document.getElementById('generate-btn');
  const exportedCardMount = document.getElementById('exported-card-mount');
  const downloadPassBtn = document.getElementById('download-pass-btn');
  const shareXBtn = document.getElementById('share-x-btn');
  
  // Hype Page Navigation
  const navHypeBtn = document.getElementById('nav-hype-btn');
  if (navHypeBtn) {
    navHypeBtn.addEventListener('click', () => {
      window.open('https://sunny-game-pi.vercel.app/', '_blank');
    });
  }

  // State Variables
  let activePhotoUrl = null;
  let croppedData = { x: 0, y: 0, zoom: 1 };
  let isDragging = false;
  let dragStart = { x: 0, y: 0 };
  let imagePos = { x: 0, y: 0 };
  let builderId = '';
  let cardExportUrl = null;

  // ---------------------------------------------------- //
  // VIEW NAVIGATION ROUTING                              //
  // ---------------------------------------------------- //
  function showView(viewId) {
    Object.keys(views).forEach(key => {
      if (key === viewId) {
        views[key].classList.add('active');
      } else {
        views[key].classList.remove('active');
      }
    });
    // Scroll view to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  startBtn.addEventListener('click', () => showView('customize'));
  logoBrandBtn.addEventListener('click', () => showView('landing'));
  navCreateBtn.addEventListener('click', () => showView('customize'));
  createAnotherBtn.addEventListener('click', () => {
    resetCustomizer();
    showView('customize');
  });

  // ---------------------------------------------------- //
  // FORM SYNCS & TEXT AUTO-SCALINGS                      //
  // ---------------------------------------------------- //
  function autoScaleText(el, baseSize, maxLen) {
    const textLen = el.textContent.length;
    if (textLen > maxLen) {
      const factor = maxLen / textLen;
      el.style.fontSize = `calc(${baseSize} * ${factor})`;
    } else {
      el.style.fontSize = baseSize;
    }
  }

  inputName.addEventListener('input', () => {
    const val = inputName.value.trim().toUpperCase();
    cardNameText.textContent = val || 'AYUSH';
    autoScaleText(cardNameText, 'clamp(10px, 4.2cqi, 26px)', 12);
  });

  inputRole.addEventListener('input', () => {
    const val = inputRole.value.trim().toUpperCase();
    cardRoleText.textContent = val || 'BUILDER';
    autoScaleText(cardRoleText, 'clamp(8px, 3.4cqi, 20px)', 16);
  });

  // Initialize placeholder texts
  cardNameText.textContent = 'AYUSH';
  cardRoleText.textContent = 'BUILDER';

  // ---------------------------------------------------- //
  // PHOTO UPLOADER DRAG-AND-DROP                         //
  // ---------------------------------------------------- //
  photoDropzone.addEventListener('click', () => fileInput.click());
  
  photoDropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    photoDropzone.style.background = 'var(--color-cream)';
  });

  photoDropzone.addEventListener('dragleave', () => {
    photoDropzone.style.background = '#ffffff';
  });

  photoDropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    photoDropzone.style.background = '#ffffff';
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUploadedFile(e.dataTransfer.files[0]);
    }
  });

  fileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      handleUploadedFile(e.target.files[0]);
    }
  });

  function handleUploadedFile(file) {
    if (file.size > 10 * 1024 * 1024) {
      alert("File is too large! Please upload a photo smaller than 10MB.");
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      activePhotoUrl = event.target.result;
      
      // Update cropper preview image
      cropPreviewImg.src = activePhotoUrl;
      cropPreviewImg.style.transform = 'translate(0px, 0px) scale(1)';
      
      // Update card preview image
      cardPhotoImg.src = activePhotoUrl;
      cardPhotoImg.style.display = 'block';
      cardPhotoImg.style.transform = 'translate(0px, 0px) scale(1)';
      cardPhotoPlaceholder.style.display = 'none';
      
      // Toggle customizer panels
      photoDropzone.style.display = 'none';
      cropPreviewCard.style.display = 'block';
      
      // Reset values
      imagePos = { x: 0, y: 0 };
      zoomSlider.value = 1;
      croppedData = { x: 0, y: 0, zoom: 1 };
      
      // Position center on load
      cropPreviewImg.onload = () => {
        centerImage();
      };
    };
    reader.readAsDataURL(file);
  }

  function centerImage() {
    const parentW = cropCircleContainer.clientWidth;
    const parentH = cropCircleContainer.clientHeight;
    const imgW = cropPreviewImg.naturalWidth;
    const imgH = cropPreviewImg.naturalHeight;
    
    // Calculate aspect ratio scaling
    const scaleWidth = parentW / imgW;
    const scaleHeight = parentH / imgH;
    const initialScale = Math.max(scaleWidth, scaleHeight);
    
    // Resize image elements in the DOM to fit
    cropPreviewImg.style.width = `${imgW * initialScale}px`;
    cropPreviewImg.style.height = `${imgH * initialScale}px`;
    
    cardPhotoImg.style.width = '100%';
    cardPhotoImg.style.height = '100%';
    
    // Centering calculation
    const leftMargin = (parentW - imgW * initialScale) / 2;
    const topMargin = (parentH - imgH * initialScale) / 2;
    
    imagePos = { x: leftMargin, y: topMargin };
    applyTransformations();
  }

  // ---------------------------------------------------- //
  // PHOTO DRAG-AND-ZOOM COORDINATE MATH                  //
  // ---------------------------------------------------- //
  function applyTransformations() {
    const transformStr = `translate(${imagePos.x}px, ${imagePos.y}px) scale(${zoomSlider.value})`;
    cropPreviewImg.style.transform = transformStr;
    
    // Apply exact same transformation to the preview card frame image
    // Card frame circle is smaller, so we scale positioning relative to layout width
    const parentW = cropCircleContainer.clientWidth;
    const cardFrameW = cardPhotoImg.parentElement.clientWidth;
    const relativeRatio = cardFrameW / parentW;
    
    const cardX = imagePos.x * relativeRatio;
    const cardY = imagePos.y * relativeRatio;
    
    cardPhotoImg.style.transform = `translate(${cardX}px, ${cardY}px) scale(${zoomSlider.value})`;
    
    croppedData = {
      x: imagePos.x,
      y: imagePos.y,
      zoom: parseFloat(zoomSlider.value)
    };
  }

  zoomSlider.addEventListener('input', applyTransformations);

  // Dragging event listeners for cropping
  cropCircleContainer.addEventListener('pointerdown', (e) => {
    if (!activePhotoUrl) return;
    isDragging = true;
    cropCircleContainer.style.cursor = 'grabbing';
    dragStart = { x: e.clientX - imagePos.x, y: e.clientY - imagePos.y };
    cropCircleContainer.setPointerCapture(e.pointerId);
  });

  cropCircleContainer.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    imagePos.x = e.clientX - dragStart.x;
    imagePos.y = e.clientY - dragStart.y;
    applyTransformations();
  });

  function stopDragging(e) {
    if (!isDragging) return;
    isDragging = false;
    cropCircleContainer.style.cursor = 'grab';
    if (e && e.pointerId) {
      cropCircleContainer.releasePointerCapture(e.pointerId);
    }
  }

  cropCircleContainer.addEventListener('pointerup', stopDragging);
  cropCircleContainer.addEventListener('pointercancel', stopDragging);

  resetCropBtn.addEventListener('click', () => {
    if (!activePhotoUrl) return;
    centerImage();
    zoomSlider.value = 1;
    applyTransformations();
  });

  removePhotoBtn.addEventListener('click', () => {
    resetPhotoUpload();
  });

  function resetPhotoUpload() {
    activePhotoUrl = null;
    cropPreviewImg.src = '';
    cardPhotoImg.src = '';
    cardPhotoImg.style.display = 'none';
    cardPhotoPlaceholder.style.display = 'flex';
    
    photoDropzone.style.display = 'block';
    cropPreviewCard.style.display = 'none';
    fileInput.value = '';
  }

  function resetCustomizer() {
    inputName.value = '';
    inputRole.value = '';
    cardNameText.textContent = 'AYUSH';
    cardRoleText.textContent = 'BUILDER';
    resetPhotoUpload();
  }

  // ---------------------------------------------------- //
  // BUILDER ID & QR CODE GENERATOR                       //
  // ---------------------------------------------------- //
  function generateBuilderId() {
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `#SB-GOA-2026-${rand}`;
  }

  // ---------------------------------------------------- //
  // GENERATING PASS WITH HTML2CANVAS                     //
  // ---------------------------------------------------- //
  generateBtn.addEventListener('click', () => {
    // Validation
    const nameVal = inputName.value.trim();
    const roleVal = inputRole.value.trim();
    
    if (!nameVal) {
      alert("Please enter your name.");
      inputName.focus();
      return;
    }
    
    if (!roleVal) {
      alert("Please enter your stack/role.");
      inputRole.focus();
      return;
    }
    
    if (!activePhotoUrl) {
      alert("Please upload your photo to generate the pass card.");
      return;
    }
    
    // Assign Builder ID
    builderId = generateBuilderId();
    cardIdText.textContent = builderId;
    
    // Update QR Code image source dynamically based on Builder ID details
    const qrData = encodeURIComponent(`https://hh-goa-one-theta.vercel.app/verify/${builderId}`);
    cardQrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${qrData}`;
    
    // Create a slight delay to allow QR code image to fetch/load
    generateBtn.textContent = 'Generating Pass...';
    generateBtn.disabled = true;
    
    setTimeout(() => {
      // Capture the card element using html2canvas
      html2canvas(passCardElement, {
        scale: 2, // High resolution output rendering
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: false
      }).then((canvas) => {
        cardExportUrl = canvas.toDataURL('image/jpeg', 0.95);
        
        // Render to Success Screen mount
        exportedCardMount.innerHTML = '';
        const exportImg = document.createElement('img');
        exportImg.src = cardExportUrl;
        exportImg.alt = "Your Builder Pass";
        exportedCardMount.appendChild(exportImg);
        
        // Pre-fill Twitter sharing href link details
        const shareText = encodeURIComponent(`Just generated my builder pass for Space Brotherss 2026! 🚀 Join us in Goa this October! Get yours here:`);
        const shareUrl = encodeURIComponent('https://hh-goa-one-theta.vercel.app/');
        shareXBtn.href = `https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`;
        
        // Switch view to success
        showView('success');
        
        // Reset generator button
        generateBtn.textContent = 'Generate Pass →';
        generateBtn.disabled = false;
      }).catch(err => {
        console.error("Pass generation failed:", err);
        alert("Something went wrong while exporting the pass. Please try again.");
        generateBtn.textContent = 'Generate Pass →';
        generateBtn.disabled = false;
      });
    }, 1200);
  });

  // Download pass function
  downloadPassBtn.addEventListener('click', () => {
    if (!cardExportUrl) return;
    
    const link = document.createElement('a');
    link.href = cardExportUrl;
    link.download = `Space_Brotherss_Pass_${builderId.replace('#', '')}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
});
