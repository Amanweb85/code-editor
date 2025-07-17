const commonOptions = {
  theme: "dracula",
  lineNumbers: true,
  extraKeys: { "Ctrl-Space": "autocomplete" },
};

const htmlEditor = CodeMirror.fromTextArea(
  document.getElementById("html-editor"),
  {
    mode: "htmlmixed",
    ...commonOptions,
  }
);

const cssEditor = CodeMirror.fromTextArea(
  document.getElementById("css-editor"),
  {
    mode: "css",
    ...commonOptions,
  }
);

const jsEditor = CodeMirror.fromTextArea(document.getElementById("js-editor"), {
  mode: "javascript",
  ...commonOptions,
});

[htmlEditor, cssEditor, jsEditor].forEach((editor) => {
  editor.on("inputRead", function (cm, change) {
    if (change.text[0].match(/[\w.@]/)) {
      cm.showHint();
    }
  });
});

// using resizable panes/layouts
Split(["#html-pane", "#css-pane", "#js-pane", "#preview-pane"], {
  sizes: [25, 25, 25, 25],
  minSize: 150,
  gutterSize: 8,
});

// updating live prview on editor when user type something
function updatePreview() {
  const html = htmlEditor.getValue();
  const css = `<style>${cssEditor.getValue()}</style>`;
  const js = `<script>;${jsEditor.getValue()}<\/script>;`;
  document.getElementById("preview").srcdoc = html + css + js;
}

htmlEditor.on("change", updatePreview);
cssEditor.on("change", updatePreview);
jsEditor.on("change", updatePreview);

// save code to localStorage
function saveToLocal() {
  localStorage.setItem("htmlCode", htmlEditor.getValue());
  localStorage.setItem("cssCode", cssEditor.getValue());
  localStorage.setItem("jsCode", jsEditor.getValue());
  alert("Code saved!");
}

//loading code from localStorage in code editor
function loadFromLocal() {
  htmlEditor.setValue(
    localStorage.getItem("htmlCode") || "<h1>Hello World</h1>"
  );
  cssEditor.setValue(localStorage.getItem("cssCode") || "h1 { color: blue; }");
  jsEditor.setValue(localStorage.getItem("jsCode") || "console.log('Hello!');");
  updatePreview();
}

function resetEditors() {
  htmlEditor.setValue("<h1>Hello World</h1>");
  cssEditor.setValue("h1 { color: blue; }");
  jsEditor.setValue("console.log('Hello!');");
  updatePreview();
}

function toggleTheme() {
  document.body.classList.toggle("light");
  const theme = document.body.classList.contains("light")
    ? "default"
    : "dracula";
  htmlEditor.setOption("theme", theme);
  cssEditor.setOption("theme", theme);
  jsEditor.setOption("theme", theme);
}

// downloading code on system

function downloadCode() {
  const htmlContent = htmlEditor.getValue();
  const cssContent = cssEditor.getValue();
  const jsContent = jsEditor.getValue();

  // Create downloadable files
  saveFile("index.html", htmlContent);
  saveFile("style.css", cssContent);
  saveFile("script.js", jsContent);
}

function saveFile(filename, content) {
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

window.onload = loadFromLocal;
