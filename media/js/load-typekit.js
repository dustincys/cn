(function(d) {
    var canvas = document.createElement("canvas");
    var context = canvas.getContext("2d");
    var text = "abcdefghijklmnopqrstuvwxyz0123456789";
    context.font = "72px monospace";
    var size = context.measureText(text).width;

    // Fonts to check
    var fonts = [' SourceHanSerif', ' monospace'];
    for (var i = 0; i < fonts.length; i++) {
        context.font = "72px '" + 'Source Han Serif' + fonts[i] + "', monospace";
        if (context.measureText(text).width != size) return;
    }

    // Dynamically add font from jsDelivr
    var style = document.createElement("style");
    style.innerHTML = `
    @font-face {
      font-family: 'Source Han Serif';
      src: url('https://cdn.jsdelivr.net/gh/adobe-fonts/source-han-serif/Subset/OTF/SourceHanSerifCN-Regular.otf') format('opentype');
      font-weight: normal;
      font-style: normal;
    }
    body { font-family: 'Source Han Serif', monospace; }
  `;
    document.head.appendChild(style);
})(document);
