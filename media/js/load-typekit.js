(function(d) {
    // Base font detection
    var canvas = document.createElement("canvas");
    var context = canvas.getContext("2d");
    var text = "abcdefghijklmnopqrstuvwxyz0123456789";
    context.font = "72px monospace";
    var baseWidth = context.measureText(text).width;

    // Possible variants
    var variants = ['SC', 'CN', 'TC', 'TW'];
    var neededVariant = null;

    for (var i = 0; i < variants.length; i++) {
        context.font = "72px 'Source Han Serif" + variants[i] + "', monospace";
        if (context.measureText(text).width != baseWidth) {
            // Font is already present
            return;
        }
        // Pick the first variant for loading
        if (!neededVariant) neededVariant = variants[i];
    }

    // Fallback to regular if none detected
    if ((neededVariant === null) or (neededVariant === '')) neededVariant = 'SC';

    // Add wf-loading class
    var h = d.documentElement;
    h.className += " wf-loading";

    // Timeout fallback
    var timeout = setTimeout(function() {
        h.className = h.className.replace(/\bwf-loading\b/g,"") + " wf-inactive";
        document.body.style.fontFamily = "monospace"; // fallback
    }, 3000);

    // Map variants to jsDelivr URLs
    var variantUrls = {
        "SC": "https://cdn.jsdelivr.net/gh/adobe-fonts/source-han-serif@release/OTF/SimplifiedChinese/SourceHanSerifSC-SemiBold.otf",
        "CN": "https://cdn.jsdelivr.net/gh/adobe-fonts/source-han-serif@release/OTF/SimplifiedChinese/SourceHanSerifSC-SemiBold.otf",
        "TC": "https://cdn.jsdelivr.net/gh/adobe-fonts/source-han-serif@release/OTF/TraditionalChinese/SourceHanSerifTC-SemiBold.otf",
        "TW": "https://cdn.jsdelivr.net/gh/adobe-fonts/source-han-serif@release/OTF/TraditionalChineseHK/SourceHanSerifHC-SemiBold.otf",
    };

    var fontFamilyName = neededVariant ? "Source Han Serif " + neededVariant : "Source Han Serif";
    var fontUrl = variantUrls[neededVariant];
    console.log("fontUrl:");
    console.log(fontUrl);


    // Add @font-face dynamically
    var style = document.createElement("style");
    style.innerHTML = `
    @font-face {
      font-family: '${fontFamilyName}';
      src: url('${fontUrl}') format('opentype');
      font-weight: normal;
      font-style: normal;
    }
  `;
    d.head.appendChild(style);

    // Load only the needed font
    var font = new FontFace(fontFamilyName, `url(${fontUrl})`);
    font.load().then(function(loadedFont) {
        document.fonts.add(loadedFont);
        clearTimeout(timeout);
        h.className = h.className.replace(/\bwf-loading\b/g,"") + " wf-active";
        document.body.style.fontFamily = `'${fontFamilyName}', monospace`;
    }).catch(function() {
        clearTimeout(timeout);
        h.className = h.className.replace(/\bwf-loading\b/g,"") + " wf-inactive";
        document.body.style.fontFamily = "monospace"; // fallback
    });
})(document);
