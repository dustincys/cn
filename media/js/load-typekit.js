(function(d) {
  // Detect if font is already installed
  var canvas = document.createElement("canvas");
  var context = canvas.getContext("2d");
  var text = "abcdefghijklmnopqrstuvwxyz0123456789";
  context.font = "72px monospace";
  var baseWidth = context.measureText(text).width;

  var fonts = [' SC', ' CN', ' TC', ' TW', ''];
  for (var i = 0; i < fonts.length; i++) {
    context.font = "72px '" + 'Source Han Serif' + fonts[i] + "', monospace";
    if (context.measureText(text).width != baseWidth) return; // Font already present
  }

  // Add wf-loading class
  var h = d.documentElement;
  h.className += " wf-loading";

  // Timeout fallback
  var t = setTimeout(function(){
    h.className = h.className.replace(/\bwf-loading\b/g,"") + " wf-inactive";
  }, 3000);

  // Load font via jsDelivr
  var style = document.createElement("style");
  style.innerHTML = `
    @font-face {
      font-family: 'Source Han Serif';
      src: url('https://cdn.jsdelivr.net/gh/adobe-fonts/source-han-serif/Subset/OTF/SourceHanSerifCN-Regular.otf') format('opentype');
      font-weight: normal;
      font-style: normal;
    }
  `;
  d.head.appendChild(style);

  // Wait until font is loaded
  var font = new FontFace('Source Han Serif', 'url(https://cdn.jsdelivr.net/gh/adobe-fonts/source-han-serif/Subset/OTF/SourceHanSerifCN-Regular.otf)');
  font.load().then(function(loadedFont) {
    document.fonts.add(loadedFont);
    clearTimeout(t);
    h.className = h.className.replace(/\bwf-loading\b/g,"") + " wf-active";
  }).catch(function(){
    clearTimeout(t);
    h.className = h.className.replace(/\bwf-loading\b/g,"") + " wf-inactive";
  });

})(document);
