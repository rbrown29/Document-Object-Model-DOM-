
var checkDocumentWCAG = function () {

    function isTransparent(color) {
        if (color == 'transparent' || color == 'rgba(0, 0, 0, 0)') {
            return true;
        } else {
            return false;
        }
    }

    function colorValues(color){
        var values;
        var valueString;
        var valueArray;

        if (color.indexOf("rgb(") == 0) {
            valueString = color.substring(4, color.length - 5);
        } else if (color.indexOf("rgba(") == 0) {
            valueString = color.substring(5, color.length - 6);
        } else {
            valueString = "0, 0, 0, 0";
        }
        valueArray = valueString.split(",");
        values = valueArray.map(function (element) {
            return parseFloat(element);
        
        });
        return values;
    } 

    function componentValue(component) {
        if (component <= 0.03928) {
            return component / 12.92;
        } else {
            return Math.pow((component + 0.055) / 1.055, 2.4);
        }
    }

    function luminance (color) {
        var r = color[0] / 255;
        var g = color[1] / 255;
        var b = color[2] / 255;

        return 0.2126 * componentValue(r) + 0.7152 * componentValue(g) + 0.0722 * componentValue(b);
    }

    function isBold(weightString) {
        var weight;
        if (weightString == "bold") {
            return true;
        }
        if (weightString == "normal") {
            return false;
        }

        try {
            weight = parseFloat(weightString);
            if (weight >= 700) {
                return true;
            } else {
                return false;
            }
        }
        catch (error) {
            return false;
        }
    }

    function addNote(tag, noteText, scaleSize) {
        var note;
        var img;
        var div;

        note = document.createElement("div");
        note.className = "wcag_note";

        img = document.createElement("img");
        img.className = "wcag_note_img";
        img.src = "https://localhost/CIS233W/lab4/wcag/warning.svg";
        img.alt = noteText;
        img.style.width = scaleSize + "px";
        img.style.height = scaleSize + "px";

        div = document.createElement("div");
        div.className = "wcag_note_div";
        div.innerHTML = noteText;

        note.appendChild(img);
        note.appendChild(div);
        tag.parentNode.insertBefore(note, tag.nextSibling);

        if (tag.style) {
            tag.style.verticalAlign = "middle";
        }

        img.addEventListener("mouseover", function() {
            div.style.display = "block";
        });

        img.addEventListener("mouseout", function() {
            div.style.display = "none";
        });



    }

    function checkContrast(tag, text, fore, back, sizeString, weight) {
        var foreColor = colorValues(fore);
        var backColor = colorValues(back);
        var L1 = luminance(foreColor);
        var L2 = luminance(backColor);
        var temp;
        var contrastRatio;
        var size = parseFloat(sizeString);
        var trimmed = text.trim();
        var bounds;
        var noteText;
        var scaleSize;

        if (trimmed == "") {
            return;
        }

        if (tag.getBoundingClientRect != undefined) {
        bounds = tag.getBoundingClientRect();
        } else {
            bounds = tag.parentNode.getBoundingClientRect();
        }
        if (bounds.right - bounds.left < 2) {
            return;
        }
        if (bounds.bottom - bounds.top < 2) {
            return;
        }
        if (bounds.right < 0) {
            return;
        }
        if (bounds.bottom < 0) {
            return;
        }

        if (L1 < L2) {
            temp = L1;
            L1 = L2;
            L2 = temp;
        }

        contrastRatio = (L1 + 0.05) / (L2 + 0.05);

        if (contrastRatio > 4.5) {
            return;
        }

        if (size >= 18 && contrastRatio >= 3.0) {
            return;
        }

        if (size >= 14 && contrastRatio >= 3.0 && isBold(weight)) {
            return;
        }

        scaleSize = 0.75 * size;
        noteText = "Forecolor:&nbsp; <div class='wcag_note_color' style='background-color: " + fore + ";";
        noteText += "width:" + scaleSize + "px;";
        noteText += "height:" + scaleSize + "px; '></div><br>";
        noteText += "Backcolor:&nbsp; <div class='wcag_note_color' style='background-color: " + back + ";";
        noteText += "width:" + scaleSize + "px;";
        noteText += "height:" + scaleSize + "px; '></div><br>";
        noteText += "contrast:&nbsp;" + contrastRatio.toFixed(1) + "<br>"; 
        noteText +=  "size:&nbsp;" + size.toFixed(1) + "<br>";
        noteText += "weight:&nbsp;" + (isBold(weight) ? "Bold" : "Normal") + "<br>";
        addNote(tag, noteText, scaleSize);
    }

    function checkColors(tag, fore, back, size, weight) {
        var children;
        var i;
        var style;
        var color;

        if (fore === undefined) {
            fore = 'rgba(0, 0, 0, 0)';
        }
        if (back === undefined) {
            back = 'rgba(255, 255, 255, 255)';
        }

        if (tag.nodeType == Node.TEXT_NODE) {
            checkContrast(tag, tag.nodeValue, fore, back, size, weight);
        }

        if (tag.nodeType == Node.ELEMENT_NODE) {
            style = document.defaultView.getComputedStyle(tag);
            color = style.color;
            if (!isTransparent(color)) {
                fore = color;
            }
            if (!isTransparent(color)) {
                back = color;
            }
            size = style.fontSize;
            weight = style.fontWeight;
        }
        if (tag.nodeType == Node.ELEMENT_NODE && tag.label !== undefined) {
            checkContrast(tag, tag.label, fore, back, size, weight);
        }
        children = tag.childNodes;

        for (i = 0; i < children.length; i++) {
            checkColors(children[i], fore, back, size, weight);
        }
    }

    function removeNotes() {
        var notes = document.getElementsByClassName("wcag_note");
        var note;
        while (notes.length > 0) {
            note = notes[0];
            note.parentNode.removeChild(note);
        }
    }

    function checkImages () {
        var images = document.getElementsByTagName("img");
        var i;

        for (i = 0; i < images.length; i++) {
            if (images[i].alt === undefined || images[i].alt.trim() == "") {
                addNote(images[i], "Image is missing alt text", 18);
            }
        }
    }

    return function checkDocument() {
        removeNotes();
        checkImages();
        checkColors(document);
    }
}();

checkDocumentWCAG();


