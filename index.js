let progress = 0;
const progressBar = document.getElementById('progressBar');
const loadingScreen = document.getElementById('loadingScreen');
const mainContainer = document.getElementById('mainContainer');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let savedCode = ""; //Store code
let offsetX, offsetY; //for drag
let isDragging = false; // Track dragging state


// Canvas particle animation
let particles = [];

function createParticle(x, y) {
    const particle = {
        x: x,
        y: y,
        size: Math.random() * 5 + 2,
        speedX: Math.random() * 2 - 1,
        speedY: Math.random() * 2 - 1,
        color: '#00ff90'
    };
    particles.push(particle);
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((particle, index) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();

        // Remove particles that move off-screen
        if (particle.x < 0 || particle.x > canvas.width || particle.y < 0 || particle.y > canvas.height) {
            particles.splice(index, 1);
        }
    });

    requestAnimationFrame(animateParticles);
}

// Handle mouse move for canvas particles
document.addEventListener('mousemove', (e) => {
    createParticle(e.x, e.y);
});

// Handle window resizing for canvas
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Simulate loading
function simulateLoading() {
    setInterval(() => {
        if (progress < 100) {
            progress++;
            progressBar.style.width = progress + '%';
        } else {
            loadingScreen.style.display = 'none';
            mainContainer.style.opacity = 1;
        }
    }, 10);
}

simulateLoading();

// Initialize Canvas Size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Handle HTML Input and Live Preview
const htmlInput = document.getElementById('htmlInput');
const htmlPreview = document.getElementById('htmlPreview');

htmlInput.addEventListener('input', function () {
    htmlPreview.srcdoc = htmlInput.value;
    savedCode = htmlInput.value; // Save the code
});
   // Restore saved code when page loads
   window.onload = function() {
        if (savedCode) {
            htmlInput.value = savedCode;
             htmlPreview.srcdoc = savedCode;
       }
   }

// Toggle Placeholder Visibility
function togglePlaceholder() {
    const editorSection = document.getElementById('editorSection');
    const previewSection = document.getElementById('previewSection');
    const toggleBtn = document.getElementById('toggleBtn');

    if (editorSection.style.display === 'none') {
        editorSection.style.display = 'block';
        previewSection.style.width = '48%';
        toggleBtn.innerText = 'Hide Placeholder';
    } else {
        editorSection.style.display = 'none';
        previewSection.style.width = '100%';
        toggleBtn.innerText = 'Show Placeholder';
    }
}

// Copy Code to Clipboard
function copyCode() {
    const textarea = document.getElementById('htmlInput');
    textarea.select();
    document.execCommand('copy');
    alert('Code Copied to Clipboard!');
}

// Minimize and Maximize Editor/Preview
function minimizeEditor(section) {
    const sectionElement = document.getElementById(section + 'Section');
    const minimizeButton = document.getElementById('minimize' + section.charAt(0).toUpperCase() + section.slice(1) + 'Btn');
    const maximizeButton = document.getElementById('maximize' + section.charAt(0).toUpperCase() + section.slice(1) + 'Btn');

    sectionElement.style.height = '40px';
    minimizeButton.style.display = 'none';
    maximizeButton.style.display = 'flex';
}

function maximizeEditor(section) {
    const sectionElement = document.getElementById(section + 'Section');
    const minimizeButton = document.getElementById('minimize' + section.charAt(0).toUpperCase() + section.slice(1) + 'Btn');
    const maximizeButton = document.getElementById('maximize' + section.charAt(0).toUpperCase() + section.slice(1) + 'Btn');

    sectionElement.style.height = 'auto';
    minimizeButton.style.display = 'flex';
    maximizeButton.style.display = 'none';
}

// Fullscreen for Editor
function fullscreenEditor() {
    const editorSection = document.getElementById('editorSection');
    editorSection.style.width = '100%';
    editorSection.style.height = '100vh';
    editorSection.style.position = 'absolute';
    editorSection.style.top = '0';
    editorSection.style.left = '0';
}

// Fullscreen for Preview
function fullscreenPreview() {
    const previewSection = document.getElementById('previewSection');
    previewSection.style.width = '100%';
    previewSection.style.height = '100vh';
    previewSection.style.position = 'absolute';
    previewSection.style.top = '0';
    previewSection.style.left = '0';
}

// Refresh Layout
function refreshLayout(section) {
    const sectionElement = document.getElementById(section + 'Section');
    const minimizeButton = document.getElementById('minimize' + section.charAt(0).toUpperCase() + section.slice(1) + 'Btn');
    const maximizeButton = document.getElementById('maximize' + section.charAt(0).toUpperCase() + section.slice(1) + 'Btn');

    sectionElement.style.width = '48%';
    sectionElement.style.height = 'auto';
    minimizeButton.style.display = 'flex';
    maximizeButton.style.display = 'none';
    sectionElement.style.position = 'relative';
    sectionElement.style.top = 'auto';
    sectionElement.style.left = 'auto';
}

// Drag functionality
function dragStart(e, section) {
  const sectionElement = document.getElementById(section + 'Section');
  offsetX = e.clientX - sectionElement.offsetLeft;
  offsetY = e.clientY - sectionElement.offsetTop;
  sectionElement.style.cursor = 'grabbing';
  isDragging = true;
  document.addEventListener('mousemove', (e) => dragMove(e, section));
  document.addEventListener('mouseup', () => dragEnd(section));
}

function dragMove(e, section) {
    if (!isDragging) return;
    const sectionElement = document.getElementById(section + 'Section');
    sectionElement.style.position = 'absolute';
    sectionElement.style.top = e.clientY - offsetY + 'px';
    sectionElement.style.left = e.clientX - offsetX + 'px';
  }


function dragEnd(section) {
    if (!isDragging) return;
    const sectionElement = document.getElementById(section + 'Section');
      sectionElement.style.cursor = 'grab';
      isDragging = false;
      document.removeEventListener('mousemove', (e) => dragMove(e, section));
  document.removeEventListener('mouseup', () => dragEnd(section));
}


// Add event listeners for dragging
const editorSection = document.getElementById('editorSection');
const previewSection = document.getElementById('previewSection');

editorSection.addEventListener('mousedown', (e) => dragStart(e, 'editor'));
previewSection.addEventListener('mousedown', (e) => dragStart(e, 'preview'));

animateParticles();
