const { PDFDocument, rgb, degrees, StandardFonts } = PDFLib;
const pdfjsLib = window['pdfjs-dist/build/pdf'];
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

function downloadFile(data, filename, mimeType = 'application/pdf') {
    const blob = data instanceof Blob ? data : new Blob([data], { type: mimeType });
    const url = URL.createObjectURL(blob); 
    const link = document.createElement('a');
    link.href = url; 
    link.download = filename || 'document.pdf';
    document.body.appendChild(link); 
    link.click(); 
    document.body.removeChild(link); 
    URL.revokeObjectURL(url);
}

function printPdfBlob(data) {
    const blob = new Blob([data], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob); window.open(url, '_blank'); 
}

function toggleFullscreen(sectionId, btn) {
    const sec = document.getElementById(sectionId);
    sec.classList.toggle('fullscreen-mode');
    if(sec.classList.contains('fullscreen-mode')){ btn.innerHTML = '❐ Compact'; } 
    else { btn.innerHTML = '⛶ Expand'; if(sectionId === 'edit-section' && editJsDoc) renderPage(currPage); }
}

const mergeList = document.getElementById('merge-file-list');
const mergeBtn = document.getElementById('merge-btn');
let mergeFiles = []; new Sortable(mergeList, { animation: 150 });

document.getElementById('merge-upload').addEventListener('change', e => {
    mergeList.innerHTML = ''; mergeFiles = Array.from(e.target.files);
    mergeFiles.forEach((f, i) => {
        const li = document.createElement('li'); li.dataset.i = i;
        li.innerHTML = `<span style="display:flex; align-items:center; gap:8px; font-weight: bold; color: var(--text-primary);"><img src="../../assets/pdf.png" alt="PDF" style="width: 18px; height: 18px;">${f.name}</span><span style="color:#94a3b8">☰</span>`;
        li.style.cssText = "background:var(--surface-light); display:flex; justify-content:space-between; align-items:center; padding:10px; margin-bottom:5px; border-radius:4px; border-left:4px solid var(--accent-primary); cursor:grab;";
        mergeList.appendChild(li);
    });
    mergeBtn.disabled = mergeFiles.length < 2;
});

mergeBtn.addEventListener('click', async () => {
    const status = document.getElementById('merge-status');
    mergeBtn.disabled = true; status.innerText = "Merging..."; status.style.color = "#38bdf8";
    try {
        const pdf = await PDFDocument.create();
        for (let li of mergeList.children) {
            const src = await PDFDocument.load(await mergeFiles[li.dataset.i].arrayBuffer());
            (await pdf.copyPages(src, src.getPageIndices())).forEach(p => pdf.addPage(p));
        }
        const fName = document.getElementById('merge-filename').value || document.getElementById('merge-filename').placeholder;
        downloadFile(await pdf.save(), fName);
        status.innerText = "Merged Successfully!"; status.style.color = "#10b981";
    } catch(e) { status.innerText = "Error Merging."; status.style.color = "#ef4444"; } 
    mergeBtn.disabled = false;
});

const compUpload = document.getElementById('compress-upload');
const compBtn = document.getElementById('compress-btn');
let compBuffer = null;

compUpload.addEventListener('change', async e => {
    const queue = document.getElementById('compress-queue');
    queue.innerHTML = '';
    if (e.target.files.length === 1) { 
        const file = e.target.files[0];
        compBuffer = await file.arrayBuffer(); 
        compBtn.disabled = false; 
        queue.innerHTML = `<div class="file-item" style="border-left: 4px solid var(--accent-primary); display: flex; justify-content: space-between; align-items: center; background: var(--surface-light); padding: 10px; border-radius: 4px; margin-bottom: 10px;"><span style="display:flex; align-items:center; gap:8px; font-weight: bold; color: var(--text-primary);"><img src="../../assets/pdf.png" alt="PDF" style="width: 18px; height: 18px;">${file.name}</span><span style="color:var(--text-secondary); font-size: 12px;">${(file.size / 1048576).toFixed(2)} MB</span></div>`;
    }
});

compBtn.addEventListener('click', async () => {
    const status = document.getElementById('compress-status');
    compBtn.disabled = true; status.innerText = "Compressing..."; status.style.color = "#38bdf8";
    try {
        const quality = parseFloat(document.getElementById('compress-quality').value);
        const pdfJsDoc = await pdfjsLib.getDocument({ data: new Uint8Array(compBuffer) }).promise;
        const newPdf = await PDFDocument.create();
        for (let i = 1; i <= pdfJsDoc.numPages; i++) {
            const page = await pdfJsDoc.getPage(i);
            const viewport = page.getViewport({ scale: 1.5 }); 
            const canvas = document.createElement('canvas'); canvas.width = viewport.width; canvas.height = viewport.height;
            await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
            const jpgImage = await newPdf.embedJpg(canvas.toDataURL('image/jpeg', quality));
            const newPage = newPdf.addPage([viewport.width, viewport.height]);
            newPage.drawImage(jpgImage, { x: 0, y: 0, width: viewport.width, height: viewport.height });
        }
        const fName = document.getElementById('comp-filename').value || document.getElementById('comp-filename').placeholder;
        downloadFile(await newPdf.save(), fName);
        status.innerText = "Compressed Successfully!"; status.style.color = "#10b981";
    } catch (error) { status.innerText = "Error Compressing."; status.style.color = "#ef4444"; } 
    compBtn.disabled = false;
});

async function loadThumbs(file, grid, fileId = 0) {
    const buf = await file.arrayBuffer();
    const doc = await pdfjsLib.getDocument({data: new Uint8Array(buf.slice(0))}).promise;
    for(let i=1; i<=doc.numPages; i++) {
        const page = await doc.getPage(i);
        const cvs = document.createElement('canvas');
        const vp = page.getViewport({scale: 0.3}); cvs.width = vp.width; cvs.height = vp.height;
        await page.render({canvasContext: cvs.getContext('2d'), viewport: vp}).promise;
        const div = document.createElement('div'); div.className = 'thumbnail-item';
        div.dataset.fid = fileId; div.dataset.pid = i-1;
        div.innerHTML = `<button class="del-overlay-btn" style="display:flex;" onclick="this.parentElement.remove()">&times;</button><div class="page-label">Pg ${i}</div>`;
        div.insertBefore(cvs, div.children[1]); grid.appendChild(div);
    }
    return await PDFDocument.load(buf.slice(0));
}

// ==========================================
// UPDATED SPLIT TOOL LOGIC
// ==========================================
const splitSrc = document.getElementById('split-source-grid');
const splitBuckets = document.getElementById('split-buckets-container');
const btnSplitAll = document.getElementById('mode-split-all');
const btnSplitManual = document.getElementById('mode-split-manual');
const manualPanel = document.getElementById('manual-split-panel');
const splitBtn = document.getElementById('split-btn');

let splitDoc = null; 
let bCount = 0;
let splitMode = 'manual';

new Sortable(splitSrc, {group:'s', animation:150});

// Mode Switching Logic
btnSplitAll.addEventListener('click', () => {
    splitMode = 'all';
    btnSplitAll.style.cssText = "background: var(--accent-primary); color: black; border-color: var(--accent-primary); font-weight: bold;";
    btnSplitManual.style.cssText = "";
    manualPanel.style.display = 'none';
    splitBtn.innerText = 'Extract All Pages';
});

btnSplitManual.addEventListener('click', () => {
    splitMode = 'manual';
    btnSplitManual.style.cssText = "background: var(--accent-primary); color: black; border-color: var(--accent-primary); font-weight: bold;";
    btnSplitAll.style.cssText = "";
    manualPanel.style.display = 'block';
    splitBtn.innerText = 'Save All Outputs';
});

document.getElementById('add-bucket-btn').onclick = () => {
    bCount++;
    const b = document.createElement('div'); b.className = 'split-bucket';
    b.innerHTML = `<div class="bucket-header"><input placeholder="split_${bCount}.pdf" value="" style="flex-grow:1;"><button class="btn-secondary" style="padding: 4px 8px;" onclick="this.parentElement.parentElement.remove()">✕</button></div><div class="thumb-grid" style="min-height:100px;"></div>`;
    splitBuckets.appendChild(b);
    new Sortable(b.querySelector('.thumb-grid'), {group:'s', animation:150});
};

document.getElementById('split-upload').addEventListener('change', async e => {
    if(!e.target.files.length) return; document.getElementById('split-workspace').style.display = 'block';
    splitSrc.innerHTML=''; splitBuckets.innerHTML=''; bCount=0;
    document.getElementById('add-bucket-btn').click(); document.getElementById('add-bucket-btn').click();
    splitDoc = await loadThumbs(e.target.files[0], splitSrc);
});

// SMART ZIP IMPLEMENTATION
document.getElementById('split-btn').addEventListener('click', async () => {
    const status = document.getElementById('split-status'); 
    status.innerText = "Processing files..."; status.style.color = "#38bdf8";
    splitBtn.disabled = true;
    
    try {
        if (splitMode === 'all') {
            const totalPages = splitDoc.getPageCount();
            if (totalPages === 1) {
                // Only 1 page? Just download the PDF directly.
                const pdf = await PDFDocument.create();
                const [copiedPage] = await pdf.copyPages(splitDoc, [0]);
                pdf.addPage(copiedPage);
                downloadFile(await pdf.save(), `page_1.pdf`, "application/pdf");
                status.innerText = "Extracted 1 page successfully!"; 
            } else {
                // Multiple pages? Zip them!
                const zip = new JSZip(); 
                for (let i = 0; i < totalPages; i++) {
                    const pdf = await PDFDocument.create();
                    const [copiedPage] = await pdf.copyPages(splitDoc, [i]);
                    pdf.addPage(copiedPage);
                    zip.file(`page_${i + 1}.pdf`, await pdf.save()); 
                }
                status.innerText = "Zipping files...";
                const zipBlob = await zip.generateAsync({type: "blob"});
                downloadFile(zipBlob, "Split_All_Pages.zip", "application/zip");
                status.innerText = `Extracted ${totalPages} pages into a ZIP successfully!`; 
            }
        } else {
            // Manual Mode
            let validOutputs = [];
            for (let b of splitBuckets.querySelectorAll('.split-bucket')) {
                const items = Array.from(b.querySelectorAll('.thumbnail-item')); if(!items.length) continue;
                const pdf = await PDFDocument.create();
                (await pdf.copyPages(splitDoc, items.map(i=>parseInt(i.dataset.pid)))).forEach(p=>pdf.addPage(p));
                let fName = b.querySelector('input').value || b.querySelector('input').placeholder;
                if(!fName.endsWith('.pdf')) fName += '.pdf';
                validOutputs.push({ pdf, fName });
            }
            
            if(validOutputs.length === 0) {
                 status.innerText = "No pages found in any output group."; status.style.color = "#ef4444";
            } else if (validOutputs.length === 1) {
                 // Only 1 valid bucket? Just download the PDF directly.
                 downloadFile(await validOutputs[0].pdf.save(), validOutputs[0].fName, "application/pdf");
                 status.innerText = "Saved 1 output group successfully!";
            } else {
                 // Multiple buckets? Zip them!
                 const zip = new JSZip();
                 for (let out of validOutputs) {
                     zip.file(out.fName, await out.pdf.save());
                 }
                 status.innerText = "Zipping files...";
                 const zipBlob = await zip.generateAsync({type: "blob"});
                 downloadFile(zipBlob, "Manual_Split_Groups.zip", "application/zip");
                 status.innerText = `Saved ${validOutputs.length} output groups into a ZIP successfully!`;
            }
        }
        if(status.innerText.includes("successfully")) status.style.color = "#10b981";
    } catch(e) { 
        status.innerText = "Error Splitting."; status.style.color = "#ef4444"; console.error(e);
    }
    splitBtn.disabled = false;
});
// ==========================================


const orgGrid = document.getElementById('org-grid');
let orgDocs = {}; let fid = 0; new Sortable(orgGrid, {animation:150});

document.getElementById('organize-upload').addEventListener('change', async e => {
    orgGrid.style.display = 'grid'; document.getElementById('org-action-row').style.display = 'flex';
    for (let f of e.target.files) orgDocs[fid] = await loadThumbs(f, orgGrid, fid++);
});

document.getElementById('organize-btn').onclick = async () => {
    const status = document.getElementById('organize-status');
    status.innerText = "Exporting..."; status.style.color = "#38bdf8";
    try {
        const pdf = await PDFDocument.create();
        const req = {};
        Array.from(orgGrid.children).forEach(i => { if(!req[i.dataset.fid]) req[i.dataset.fid]=[]; req[i.dataset.fid].push(parseInt(i.dataset.pid)); });
        const cache = {};
        for(let id in req) {
            const cp = await pdf.copyPages(orgDocs[id], req[id]);
            req[id].forEach((pid, idx) => cache[`${id}_${pid}`] = cp[idx]);
        }
        Array.from(orgGrid.children).forEach(i => pdf.addPage(cache[`${i.dataset.fid}_${i.dataset.pid}`]));
        const fName = document.getElementById('org-filename').value || document.getElementById('org-filename').placeholder;
        downloadFile(await pdf.save(), fName);
        status.innerText = "Organized PDF Exported!"; status.style.color = "#10b981";
    } catch(e) { status.innerText = "Error Exporting."; status.style.color = "#ef4444"; }
};

const pdfToImgUpload = document.getElementById('pdf-to-img-upload');
const pdfToImgBtn = document.getElementById('pdf-to-img-btn');
let ptiFile = null;

pdfToImgUpload.addEventListener('change', e => {
    const queue = document.getElementById('pdf-to-img-queue');
    queue.innerHTML = '';
    if (e.target.files.length) { 
        ptiFile = e.target.files[0]; 
        pdfToImgBtn.disabled = false; 
        queue.innerHTML = `<div class="file-item" style="border-left: 4px solid var(--accent-primary); display: flex; justify-content: space-between; align-items: center; background: var(--surface-light); padding: 10px; border-radius: 4px; margin-bottom: 10px;"><span style="display:flex; align-items:center; gap:8px; font-weight: bold; color: var(--text-primary);"><img src="../../assets/pdf.png" alt="PDF" style="width: 18px; height: 18px;">${ptiFile.name}</span><span style="color:var(--text-secondary); font-size: 12px;">${(ptiFile.size / 1048576).toFixed(2)} MB</span></div>`;
    }
});

pdfToImgBtn.addEventListener('click', async () => {
    const status = document.getElementById('pdf-to-img-status');
    status.innerText = "Extracting Images..."; status.style.color = "#38bdf8"; 
    pdfToImgBtn.disabled = true;
    
    try {
        const format = document.getElementById('pdf-to-img-format').value;
        const ext = format === 'image/svg+xml' ? 'svg' : format.split('/')[1];
        const buf = await ptiFile.arrayBuffer();
        const doc = await pdfjsLib.getDocument({data: new Uint8Array(buf)}).promise;
        
        for (let i = 1; i <= doc.numPages; i++) {
            const page = await doc.getPage(i);
            const viewport = page.getViewport({scale: 2.0}); 
            const link = document.createElement('a');
            link.download = `page_${i}.${ext}`;

            if (format === 'image/svg+xml') {
                try {
                    const opList = await page.getOperatorList();
                    const svgGfx = new pdfjsLib.SVGGraphics(page.commonObjs, page.objs);
                    const svgElement = await svgGfx.getSVG(opList, viewport);
                    if (!svgElement.getAttribute('xmlns')) svgElement.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
                    const svgString = new XMLSerializer().serializeToString(svgElement);
                    const blob = new Blob([svgString], {type: 'image/svg+xml;charset=utf-8'});
                    link.href = URL.createObjectURL(blob);
                } catch (svgErr) {
                    const canvas = document.createElement('canvas');
                    const highResVp = page.getViewport({scale: 3.0}); 
                    canvas.width = highResVp.width; canvas.height = highResVp.height;
                    await page.render({canvasContext: canvas.getContext('2d'), viewport: highResVp}).promise;
                    const imgDataUrl = canvas.toDataURL('image/png');
                    const fallbackSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${viewport.width}" height="${viewport.height}" viewBox="0 0 ${highResVp.width} ${highResVp.height}"><image width="${highResVp.width}" height="${highResVp.height}" href="${imgDataUrl}" /></svg>`;
                    const blob = new Blob([fallbackSvg], {type: 'image/svg+xml;charset=utf-8'});
                    link.href = URL.createObjectURL(blob);
                }
            } else {
                const canvas = document.createElement('canvas');
                canvas.width = viewport.width; canvas.height = viewport.height;
                await page.render({canvasContext: canvas.getContext('2d'), viewport}).promise;
                link.href = canvas.toDataURL(format, 1.0);
            }
            
            document.body.appendChild(link);
            link.click(); document.body.removeChild(link);
            await new Promise(r => setTimeout(r, 400)); 
        }
        status.innerText = "All pages extracted!"; status.style.color = "#10b981";
    } catch(e) { status.innerText = "Error extracting images."; status.style.color = "#ef4444"; }
    pdfToImgBtn.disabled = false;
});

const imgToPdfUpload = document.getElementById('img-to-pdf-upload');
const imgToPdfList = document.getElementById('img-to-pdf-list');
const imgToPdfBtn = document.getElementById('img-to-pdf-btn');
let imgFiles = []; new Sortable(imgToPdfList, { animation: 150 });

imgToPdfUpload.addEventListener('change', e => {
    imgToPdfList.innerHTML = ''; imgFiles = Array.from(e.target.files);
    imgFiles.forEach((f, i) => {
        const li = document.createElement('li'); li.dataset.i = i;
        const imgThumbnailUrl = URL.createObjectURL(f);
        li.innerHTML = `<span style="display:flex; align-items:center; gap:8px; font-weight: bold; color: var(--text-primary);"><img src="${imgThumbnailUrl}" alt="Img" style="width: 24px; height: 24px; object-fit: cover; border-radius: 4px; border: 1px solid var(--border-color);">${f.name}</span><span style="color:#94a3b8">☰</span>`;
        li.style.cssText = "background:var(--surface-light); display:flex; justify-content:space-between; align-items:center; padding:10px; margin-bottom:5px; border-radius:4px; border-left:4px solid var(--accent-primary); cursor:grab;";
        imgToPdfList.appendChild(li);
    });
    imgToPdfBtn.disabled = imgFiles.length === 0;
});

imgToPdfBtn.addEventListener('click', async () => {
    const status = document.getElementById('img-to-pdf-status');
    status.innerText = "Converting to PDF..."; status.style.color = "#38bdf8"; imgToPdfBtn.disabled = true;
    try {
        const pdf = await PDFDocument.create();
        for (let li of imgToPdfList.children) {
            const file = imgFiles[li.dataset.i];
            const imageBytes = await file.arrayBuffer();
            let pdfImage;
            if (file.type === 'image/jpeg') {
                pdfImage = await pdf.embedJpg(imageBytes);
            } else if (file.type === 'image/png') {
                pdfImage = await pdf.embedPng(imageBytes);
            } else {
                pdfImage = await new Promise((resolve) => {
                    const img = new Image();
                    img.onload = async () => {
                        const canvas = document.createElement('canvas');
                        canvas.width = img.width; canvas.height = img.height;
                        canvas.getContext('2d').drawImage(img, 0, 0);
                        const pngDataUrl = canvas.toDataURL('image/png');
                        resolve(await pdf.embedPng(pngDataUrl));
                    };
                    img.src = URL.createObjectURL(file);
                });
            }
            const page = pdf.addPage([pdfImage.width, pdfImage.height]);
            page.drawImage(pdfImage, { x: 0, y: 0, width: pdfImage.width, height: pdfImage.height });
        }
        const fName = document.getElementById('img-to-pdf-filename').value || document.getElementById('img-to-pdf-filename').placeholder;
        downloadFile(await pdf.save(), fName);
        status.innerText = "Successfully Converted!"; status.style.color = "#10b981";
    } catch(e) { status.innerText = "Error converting images."; status.style.color = "#ef4444"; }
    imgToPdfBtn.disabled = false;
});

// ==========================================
// 7. THE PRO EDITOR & CROP TOOL
// ==========================================
const editContainer = document.getElementById('editor-canvas-container');
const editCanvas = document.getElementById('editor-canvas');
const overlayLayer = document.getElementById('overlay-layer');
const ctx = editCanvas.getContext('2d');

let originalPdfBytes = null; let editJsDoc = null;
let currPage = 1, cssScale = 1;
let activeTool = 'select'; let customImgData = null; 
let baseZIndex = 10; let pageRotations = {}; 
let currentViewport = null; let liveEdits = []; let selectedEdit = null;

const tColorInput = document.getElementById('elem-text-color');
const bColorInput = document.getElementById('elem-border-color');
const fColorInput = document.getElementById('elem-fill-color');
const noFillInput = document.getElementById('elem-no-fill');
const sizeInput = document.getElementById('elem-size');
const boldBtn = document.getElementById('text-bold');
const italicBtn = document.getElementById('text-italic');
const rotateInput = document.getElementById('elem-rotate');
let clipboardEdit = null;

function setEditorTool(toolCategory, specificTool) {
    document.querySelectorAll('.tool-btn, .tool-select').forEach(el => el.classList.remove('active'));
    
    if (!selectedEdit || (selectedEdit && activeTool !== toolCategory)) {
        selectObject(null);
    }
    
    activeTool = toolCategory; document.body.dataset.activeTool = activeTool; 
    const tool = specificTool || toolCategory;
    
    const showFormatBar = (tool === 'text' || tool === 'rect' || tool === 'ellipse' || tool === 'line' || tool === 'highlight' || tool === 'formtext' || tool === 'checkbox' || tool === 'tick' || tool === 'cross') 
                          || (selectedEdit && selectedEdit.type !== 'image' && selectedEdit.type !== 'crop');
    
    document.getElementById('text-format-bar').style.display = showFormatBar ? 'flex' : 'none';
    
    const cropBar = document.getElementById('crop-format-bar');
    if(cropBar) cropBar.style.display = (tool === 'crop' || (selectedEdit && selectedEdit.type === 'crop')) ? 'flex' : 'none';

    if (!selectedEdit) {
        if (tool === 'highlight') { fColorInput.value = '#facc15'; noFillInput.checked = false; } 
        else if (tool === 'rect' || tool === 'ellipse' || tool === 'line') { bColorInput.value = '#000000'; noFillInput.checked = true; } 
        else if (tool === 'text' || tool === 'tick' || tool === 'cross' || tool === 'formtext' || tool === 'checkbox') { tColorInput.value = '#000000'; bColorInput.value = '#000000'; noFillInput.checked = true; }
    }
}

document.querySelectorAll('.tool-btn').forEach(btn => {
    btn.addEventListener('click', () => { setEditorTool(btn.dataset.tool, btn.dataset.subtool); btn.classList.add('active'); });
});

document.querySelectorAll('.tool-select').forEach(sel => {
    const trigger = () => { setEditorTool(sel.dataset.tool, sel.value); sel.classList.add('active'); };
    sel.addEventListener('change', trigger); sel.addEventListener('mousedown', trigger); 
});

document.getElementById('edit-image-upload').addEventListener('change', e => {
    if(!e.target.files.length) return;
    const reader = new FileReader();
    reader.onload = (event) => { customImgData = event.target.result; setEditorTool('image', 'image'); };
    reader.readAsDataURL(e.target.files[0]);
    e.target.value = ''; 
});

document.getElementById('crop-all-pages-check').addEventListener('change', (e) => {
    if (selectedEdit && selectedEdit.type === 'crop') selectedEdit.allPages = e.target.checked;
});

document.getElementById('edit-upload').addEventListener('change', async e => {
    if(!e.target.files.length) return;
    document.getElementById('editor-workspace').style.display = 'block';
    originalPdfBytes = await e.target.files[0].arrayBuffer();
    editJsDoc = await pdfjsLib.getDocument({data: new Uint8Array(originalPdfBytes.slice(0))}).promise;
    liveEdits = []; selectedEdit = null; pageRotations = {}; renderPage(1);
});

async function renderPage(num) {
    currPage = num;
    document.getElementById('edit-page-info').innerText = `Page ${num} of ${editJsDoc.numPages}`;
    const page = await editJsDoc.getPage(num);
    const rotation = pageRotations[currPage] || 0;
    const internalViewport = page.getViewport({scale: 2.0, rotation: rotation});
    editCanvas.width = internalViewport.width; editCanvas.height = internalViewport.height;
    await page.render({canvasContext: ctx, viewport: internalViewport}).promise;
    const containerWidth = editContainer.clientWidth;
    cssScale = containerWidth / internalViewport.width; 
    currentViewport = page.getViewport({scale: 1.0, rotation: rotation});
    overlayLayer.innerHTML = '';
    liveEdits.forEach(edit => { if(edit.pageNum === currPage) { overlayLayer.appendChild(edit.el); syncVisuals(edit); } });
}

window.addEventListener('resize', () => { if (document.getElementById('editor-workspace').style.display === 'block') renderPage(currPage); });
document.getElementById('prev-page').onclick = () => { if(currPage > 1) renderPage(currPage - 1); };
document.getElementById('next-page').onclick = () => { if(currPage < editJsDoc.numPages) renderPage(currPage + 1); };
document.getElementById('rotate-page-btn').onclick = () => { pageRotations[currPage] = ((pageRotations[currPage] || 0) + 90) % 360; renderPage(currPage); };

tColorInput.addEventListener('input', (e) => { if(selectedEdit) { selectedEdit.textColor = e.target.value; syncVisuals(selectedEdit); } });
bColorInput.addEventListener('input', (e) => { if(selectedEdit) { selectedEdit.borderColor = e.target.value; syncVisuals(selectedEdit); } });
fColorInput.addEventListener('input', (e) => { if(selectedEdit) { selectedEdit.fillColor = e.target.value; selectedEdit.noFill = false; noFillInput.checked = false; syncVisuals(selectedEdit); } });
noFillInput.addEventListener('change', (e) => { if(selectedEdit) { selectedEdit.noFill = e.target.checked; syncVisuals(selectedEdit); } });
sizeInput.addEventListener('input', (e) => { if(selectedEdit && (selectedEdit.type === 'text' || selectedEdit.type === 'tick' || selectedEdit.type === 'cross' || selectedEdit.type === 'formtext')) { selectedEdit.fontSize = parseInt(e.target.value) || 16; syncVisuals(selectedEdit); } });
boldBtn.addEventListener('click', () => {
    if(selectedEdit && selectedEdit.type === 'text') {
        selectedEdit.isBold = !selectedEdit.isBold;
        boldBtn.style.background = selectedEdit.isBold ? '#0ea5e9' : '#1e293b';
        boldBtn.style.color = selectedEdit.isBold ? 'black' : '#38bdf8';
        syncVisuals(selectedEdit);
    }
});
italicBtn.addEventListener('click', () => {
    if(selectedEdit && selectedEdit.type === 'text') {
        selectedEdit.isItalic = !selectedEdit.isItalic;
        italicBtn.style.background = selectedEdit.isItalic ? '#0ea5e9' : '#1e293b';
        italicBtn.style.color = selectedEdit.isItalic ? 'black' : '#38bdf8';
        syncVisuals(selectedEdit);
    }
});
rotateInput.addEventListener('input', (e) => {
    if(selectedEdit) { 
        selectedEdit.rotation = parseInt(e.target.value) || 0; 
        syncVisuals(selectedEdit); 
    } 
});

function syncVisuals(edit) {
    edit.el.style.left = `${edit.vpX * 2.0 * cssScale}px`;
    let adjustedScreenY = edit.vpY;
    if(edit.type === 'text' || edit.type === 'tick' || edit.type === 'cross') { adjustedScreenY = edit.vpY - edit.fontSize; } 
    edit.el.style.top = `${adjustedScreenY * 2.0 * cssScale}px`;
    
    if(edit.vpW && edit.type !== 'text' && edit.type !== 'tick' && edit.type !== 'cross') edit.el.style.width = `${edit.vpW * 2.0 * cssScale}px`;
    if(edit.vpH && edit.type !== 'text' && edit.type !== 'tick' && edit.type !== 'cross') edit.el.style.height = `${edit.vpH * 2.0 * cssScale}px`;
    
    if(edit.type === 'text' || edit.type === 'tick' || edit.type === 'cross') {
        edit.el.style.color = edit.textColor || '#000000'; 
        edit.el.style.fontSize = `${edit.fontSize * 2.0 * cssScale}px`;
        edit.el.style.fontWeight = edit.isBold ? 'bold' : 'normal';
        edit.el.style.fontStyle = edit.isItalic ? 'italic' : 'normal'; 
    } else if (edit.type === 'formtext') {
        edit.el.style.color = edit.textColor || '#000000'; 
        edit.el.style.backgroundColor = edit.noFill ? 'transparent' : (edit.fillColor || '#ffffff');
    } else if (edit.type === 'crop') {
        edit.el.style.borderColor = '#38bdf8';
        edit.el.style.borderWidth = '2px';
        edit.el.style.borderStyle = 'dashed';
        edit.el.style.backgroundColor = 'rgba(56, 189, 248, 0.1)';
    } else {
        edit.el.style.borderColor = edit.borderColor || '#ef4444';
        if(edit.type === 'highlight') {
            edit.el.style.backgroundColor = edit.fillColor || '#facc15';
        } else if(edit.type === 'rect' || edit.type === 'ellipse') {
            edit.el.style.backgroundColor = edit.noFill ? 'transparent' : (edit.fillColor || '#ffffff');
        }
    }
    edit.el.style.transform = `rotate(${edit.rotation || 0}deg)`;
}

function selectObject(edit) {
    liveEdits.forEach(e => e.el.classList.remove('selected'));
    selectedEdit = edit;
    if(edit) {
        edit.el.classList.add('selected');
        tColorInput.value = edit.textColor || '#000000';
        bColorInput.value = edit.borderColor || '#ef4444';
        fColorInput.value = edit.fillColor || '#ffffff';
        noFillInput.checked = !!edit.noFill;
        sizeInput.value = edit.fontSize || 16;
        if(edit.type === 'text') {
            boldBtn.style.background = edit.isBold ? '#0ea5e9' : '#1e293b';
            boldBtn.style.color = edit.isBold ? 'black' : '#38bdf8';
            italicBtn.style.background = edit.isItalic ? '#0ea5e9' : '#1e293b'; 
            italicBtn.style.color = edit.isItalic ? 'black' : '#38bdf8';        
        }
        rotateInput.value = edit.rotation || 0;
        if(edit.type === 'crop') {
            document.getElementById('crop-all-pages-check').checked = !!edit.allPages;
            document.getElementById('crop-format-bar').style.display = 'flex'; 
            document.getElementById('text-format-bar').style.display = 'none';
        } else if (edit.type !== 'image') {
            document.getElementById('text-format-bar').style.display = 'flex'; 
            const cropBar = document.getElementById('crop-format-bar');
            if(cropBar) cropBar.style.display = 'none';
        }
    } else {
        if (activeTool === 'select') {
            document.getElementById('text-format-bar').style.display = 'none';
            const cropBar = document.getElementById('crop-format-bar');
            if(cropBar) cropBar.style.display = 'none';
        }
    }
}

overlayLayer.addEventListener('pointerdown', e => {
    if(activeTool === 'select') { if(e.target === overlayLayer) selectObject(null); return; }
    if(e.target !== overlayLayer) return; 
    
    const rect = overlayLayer.getBoundingClientRect();
    const clickX = e.clientX - rect.left; const clickY = e.clientY - rect.top;
    const vpX = clickX / (2.0 * cssScale); const vpY = clickY / (2.0 * cssScale);

    const el = document.createElement('div');
    el.className = 'live-overlay'; el.style.pointerEvents = 'auto'; 
    baseZIndex++; el.style.zIndex = baseZIndex;

    let type = activeTool;
    if(type === 'shape') type = document.getElementById('shape-selector').value;
    if(type === 'form') type = document.getElementById('form-selector').value;
    
    let newEdit = { 
        pageNum: currPage, type: type, el: el, vpX: vpX, vpY: vpY, zIndex: baseZIndex, 
        textColor: tColorInput.value, borderColor: bColorInput.value, fillColor: fColorInput.value, noFill: noFillInput.checked,
        fontSize: parseInt(sizeInput.value) || 16, isBold: false 
    };
    
    let vpW = 0, vpH = 0;

    if (type === 'text') { el.classList.add('overlay-text'); el.contentEditable = true; el.innerText = "Type text"; } 
    else if (type === 'tick') { el.classList.add('overlay-text'); el.innerText = "✓"; } 
    else if (type === 'cross') { el.classList.add('overlay-text'); el.innerText = "✖"; } 
    else if (type === 'formtext') { el.classList.add('overlay-formtext'); el.innerText = "Text Box"; vpW = 120; vpH = 20; } 
    else if (type === 'checkbox') { el.classList.add('overlay-checkbox'); vpW = 16; vpH = 16; } 
    else if (type === 'rect') { el.classList.add('overlay-rect'); vpW = 80; vpH = 50; } 
    else if (type === 'ellipse') { el.classList.add('overlay-ellipse'); vpW = 60; vpH = 60; } 
    else if (type === 'line') { el.classList.add('overlay-line'); vpW = 100; vpH = 5; } 
    else if (type === 'highlight') { el.classList.add('overlay-highlight'); vpW = 120; vpH = 15; newEdit.noFill = false; newEdit.fillColor = fColorInput.value || '#facc15'; } 
    else if (type === 'crop') { 
        el.classList.add('overlay-crop'); vpW = 200; vpH = 200; 
        newEdit.allPages = document.getElementById('crop-all-pages-check').checked; 
    } 
    else if (type === 'image' && customImgData) { 
        el.classList.add('overlay-img'); 
        el.style.backgroundImage = `url(${customImgData})`; 
        el.style.backgroundSize = '100% 100%';
        vpW = 100; vpH = 100; newEdit.imgData = customImgData; 
        
        const img = new Image();
        img.onload = () => {
            const ratio = img.width / img.height;
            newEdit.vpH = newEdit.vpW / ratio;
            syncVisuals(newEdit);
        };
        img.src = customImgData;
    }

    if(vpW && vpH) { newEdit.vpW = vpW; newEdit.vpH = vpH; }

    overlayLayer.appendChild(el);
    const delBtn = document.createElement('button'); delBtn.className = 'del-overlay-btn'; delBtn.innerHTML = '&times;'; el.appendChild(delBtn);

    const handleClasses = type === 'crop' ? ['nw','n','ne','e','se','s','sw','w'] : ['se'];
    handleClasses.forEach(pos => {
        const resizer = document.createElement('div');
        resizer.className = type === 'crop' ? `resize-handle-${pos}` : 'resize-handle';
        el.appendChild(resizer);

        resizer.addEventListener('pointerdown', (ev) => {
            if(activeTool !== 'select') return;
            ev.preventDefault(); ev.stopPropagation();
            let isResizing = true; let startY = ev.clientY; let startX = ev.clientX;
            let initW = newEdit.vpW || 0; let initH = newEdit.vpH || 0; 
            let initX = newEdit.vpX; let initY = newEdit.vpY;
            let initSize = newEdit.fontSize;

            const onMove = (mv) => {
                if(!isResizing) return;
                const dy = (mv.clientY - startY) / (2.0 * cssScale);
                const dx = (mv.clientX - startX) / (2.0 * cssScale);
                
                if(type === 'text' || type === 'tick' || type === 'cross') {
                    newEdit.fontSize = Math.max(8, initSize + dy);
                } else if (type === 'image') {
                    const ratio = initW / initH;
                    const delta = Math.max(dx, dy); 
                    newEdit.vpW = Math.max(10, initW + delta);
                    newEdit.vpH = newEdit.vpW / ratio;
                } else if (type === 'crop') {
                    let newW = initW, newH = initH, newX = initX, newY = initY;
                    
                    if (pos.includes('e')) { newW = Math.max(10, initW + dx); }
                    if (pos.includes('s')) { newH = Math.max(10, initH + dy); }
                    if (pos.includes('w')) { 
                        let deltaX = dx;
                        if (initW - deltaX < 10) deltaX = initW - 10;
                        newW = initW - deltaX;
                        newX = initX + deltaX;
                    }
                    if (pos.includes('n')) {
                        let deltaY = dy;
                        if (initH - deltaY < 10) deltaY = initH - 10;
                        newH = initH - deltaY;
                        newY = initY + deltaY;
                    }
                    newEdit.vpW = newW; newEdit.vpH = newH;
                    newEdit.vpX = newX; newEdit.vpY = newY;
                } else {
                    newEdit.vpW = Math.max(10, initW + dx);
                    if(type !== 'line') newEdit.vpH = Math.max(10, initH + dy);
                }
                syncVisuals(newEdit);
            };
            const onUp = () => { isResizing = false; document.removeEventListener('pointermove', onMove); document.removeEventListener('pointerup', onUp); };
            document.addEventListener('pointermove', onMove); document.addEventListener('pointerup', onUp);
        });
    });

    if(type === 'text' || type === 'rect' || type === 'image') {
        const rotHandle = document.createElement('div');
        rotHandle.className = 'rotate-handle';
        el.appendChild(rotHandle);
        
        rotHandle.addEventListener('pointerdown', (ev) => {
            if(activeTool !== 'select') return;
            ev.preventDefault(); ev.stopPropagation();
            let isRotating = true;
            
            const rect = el.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const onMove = (mv) => {
                if(!isRotating) return;
                let angle = Math.atan2(mv.clientY - centerY, mv.clientX - centerX) * (180 / Math.PI);
                newEdit.rotation = Math.round(angle + 90);
                syncVisuals(newEdit);
                if(selectedEdit === newEdit) rotateInput.value = newEdit.rotation;
            };
            const onUp = () => { isRotating = false; document.removeEventListener('pointermove', onMove); document.removeEventListener('pointerup', onUp); };
            document.addEventListener('pointermove', onMove); document.addEventListener('pointerup', onUp);
        });
    }
    liveEdits.push(newEdit);
    syncVisuals(newEdit);
    
    el.addEventListener('pointerdown', (ev) => {
        if(activeTool !== 'select' || ev.target.className.includes('resize-handle') || ev.target === delBtn) return;
        ev.preventDefault(); ev.stopPropagation();
        selectObject(newEdit);
        let isDragging = true; let startX = ev.clientX; let startY = ev.clientY;
        let initVpX = newEdit.vpX; let initVpY = newEdit.vpY;

        const onMove = (mv) => {
            if(!isDragging) return;
            const dxScreen = (mv.clientX - startX) / (2.0 * cssScale);
            const dyScreen = (mv.clientY - startY) / (2.0 * cssScale);
            newEdit.vpX = initVpX + dxScreen;
            newEdit.vpY = initVpY + dyScreen;
            syncVisuals(newEdit);
        };
        const onUp = () => { isDragging = false; document.removeEventListener('pointermove', onMove); document.removeEventListener('pointerup', onUp); };
        document.addEventListener('pointermove', onMove); document.addEventListener('pointerup', onUp);
    });

    delBtn.onclick = () => { el.remove(); liveEdits = liveEdits.filter(item => item !== newEdit); selectedEdit = null; };
    
    selectObject(newEdit);
    if(type === 'text') { setTimeout(() => el.focus(), 50); }
    
    el.addEventListener('dblclick', (ev) => {
        if(newEdit.type === 'text' || newEdit.type === 'formtext') {
            ev.stopPropagation();
            document.querySelectorAll('.tool-btn, .tool-select').forEach(b => b.classList.remove('active'));
            document.querySelector('.tool-btn[data-tool="text"]').classList.add('active');
            setEditorTool('text', newEdit.type);
            selectObject(newEdit);
            setTimeout(() => { el.focus(); }, 50);
        }
    });
    
    activeTool = 'select';
    document.body.dataset.activeTool = 'select';
    document.querySelectorAll('.tool-btn, .tool-select').forEach(b => b.classList.remove('active'));
    document.querySelector('.tool-btn[data-tool="select"]').classList.add('active');
    
    document.getElementById('text-format-bar').style.display = 'flex';
}); 

document.addEventListener('keydown', (e) => {
    const isTyping = e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.contentEditable === "true";
    
    if((e.key === 'Delete' || e.key === 'Backspace') && selectedEdit && !isTyping) {
        selectedEdit.el.remove(); liveEdits = liveEdits.filter(item => item !== selectedEdit); selectObject(null);
    }

    if ((e.ctrlKey || e.metaKey) && e.key === 'c' && selectedEdit && !isTyping) {
        clipboardEdit = { ...selectedEdit }; 
        if (selectedEdit.type === 'text' || selectedEdit.type === 'formtext') {
            let clone = selectedEdit.el.cloneNode(true);
            let del = clone.querySelector('.del-overlay-btn'); if(del) del.remove();
            clipboardEdit.savedText = clone.innerText;
        }
        clipboardEdit.el = null; 
    }

    if ((e.ctrlKey || e.metaKey) && e.key === 'x' && selectedEdit && !isTyping) {
        clipboardEdit = { ...selectedEdit }; 
        if (selectedEdit.type === 'text' || selectedEdit.type === 'formtext') {
            let clone = selectedEdit.el.cloneNode(true);
            let del = clone.querySelector('.del-overlay-btn'); if(del) del.remove();
            clipboardEdit.savedText = clone.innerText;
        }
        clipboardEdit.el = null; 
        selectedEdit.el.remove(); liveEdits = liveEdits.filter(item => item !== selectedEdit); selectObject(null);
    }

    if ((e.ctrlKey || e.metaKey) && e.key === 'v' && clipboardEdit && !isTyping) {
        if (clipboardEdit.type === 'crop') return;

        const el = document.createElement('div');
        el.className = 'live-overlay'; el.style.pointerEvents = 'auto'; 
        baseZIndex++; el.style.zIndex = baseZIndex;

        let newEdit = { 
            ...clipboardEdit, el: el, 
            vpX: clipboardEdit.vpX + 20, vpY: clipboardEdit.vpY + 20, 
            zIndex: baseZIndex, pageNum: currPage 
        };

        if (newEdit.type === 'text') { 
            el.classList.add('overlay-text'); el.contentEditable = true; 
            el.innerText = clipboardEdit.savedText || "Type text"; 
            el.style.fontStyle = newEdit.isItalic ? 'italic' : 'normal'; 
        } 
        else if (newEdit.type === 'tick') { el.classList.add('overlay-text'); el.innerText = "✓"; } 
        else if (newEdit.type === 'cross') { el.classList.add('overlay-text'); el.innerText = "✖"; } 
        else if (newEdit.type === 'formtext') { 
            el.classList.add('overlay-formtext'); 
            el.innerText = clipboardEdit.savedText || "Text Box"; 
        } 
        else if (newEdit.type === 'checkbox') { el.classList.add('overlay-checkbox'); } 
        else if (newEdit.type === 'rect') { el.classList.add('overlay-rect'); } 
        else if (newEdit.type === 'ellipse') { el.classList.add('overlay-ellipse'); } 
        else if (newEdit.type === 'line') { el.classList.add('overlay-line'); } 
        else if (newEdit.type === 'highlight') { el.classList.add('overlay-highlight'); } 
        else if (newEdit.type === 'image' && newEdit.imgData) { 
            el.classList.add('overlay-img');
            el.style.backgroundImage = `url(${newEdit.imgData})`; 
            el.style.backgroundSize = '100% 100%';
        }

        overlayLayer.appendChild(el);
        const delBtn = document.createElement('button'); delBtn.className = 'del-overlay-btn'; delBtn.innerHTML = '&times;'; el.appendChild(delBtn);
        delBtn.onclick = () => { el.remove(); liveEdits = liveEdits.filter(item => item !== newEdit); selectObject(null); };

        const handleClasses = ['se'];
        handleClasses.forEach(pos => {
            const resizer = document.createElement('div');
            resizer.className = 'resize-handle';
            el.appendChild(resizer);

            resizer.addEventListener('pointerdown', (ev) => {
                if(activeTool !== 'select') return;
                ev.preventDefault(); ev.stopPropagation();
                let isResizing = true; let startY = ev.clientY; let startX = ev.clientX;
                let initW = newEdit.vpW || 0; let initH = newEdit.vpH || 0; 
                let initSize = newEdit.fontSize;

                const onMove = (mv) => {
                    if(!isResizing) return;
                    const dy = (mv.clientY - startY) / (2.0 * cssScale);
                    const dx = (mv.clientX - startX) / (2.0 * cssScale);
                    
                    if(newEdit.type === 'text' || newEdit.type === 'tick' || newEdit.type === 'cross') {
                        newEdit.fontSize = Math.max(8, initSize + dy);
                    } else if (newEdit.type === 'image') {
                        const ratio = initW / initH;
                        const delta = Math.max(dx, dy); 
                        newEdit.vpW = Math.max(10, initW + delta);
                        newEdit.vpH = newEdit.vpW / ratio;
                    } else {
                        newEdit.vpW = Math.max(10, initW + dx);
                        if(newEdit.type !== 'line') newEdit.vpH = Math.max(10, initH + dy);
                    }
                    syncVisuals(newEdit);
                };
                const onUp = () => { isResizing = false; document.removeEventListener('pointermove', onMove); document.removeEventListener('pointerup', onUp); };
                document.addEventListener('pointermove', onMove); document.addEventListener('pointerup', onUp);
            });
        });

        if(newEdit.type === 'text' || newEdit.type === 'rect' || newEdit.type === 'image') {
            const rotHandle = document.createElement('div');
            rotHandle.className = 'rotate-handle';
            el.appendChild(rotHandle);
            
            rotHandle.addEventListener('pointerdown', (ev) => {
                if(activeTool !== 'select') return;
                ev.preventDefault(); ev.stopPropagation();
                let isRotating = true;
                const rect = el.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;

                const onMove = (mv) => {
                    if(!isRotating) return;
                    let angle = Math.atan2(mv.clientY - centerY, mv.clientX - centerX) * (180 / Math.PI);
                    newEdit.rotation = Math.round(angle + 90);
                    syncVisuals(newEdit);
                    if(selectedEdit === newEdit) rotateInput.value = newEdit.rotation;
                };
                const onUp = () => { isRotating = false; document.removeEventListener('pointermove', onMove); document.removeEventListener('pointerup', onUp); };
                document.addEventListener('pointermove', onMove); document.addEventListener('pointerup', onUp);
            });
        }

        el.addEventListener('pointerdown', (ev) => {
            if(activeTool !== 'select' || ev.target.className.includes('resize-handle') || ev.target.className === 'rotate-handle' || ev.target === delBtn) return;
            ev.preventDefault(); ev.stopPropagation();
            selectObject(newEdit);
            let isDragging = true; let startX = ev.clientX; let startY = ev.clientY;
            let initVpX = newEdit.vpX; let initVpY = newEdit.vpY;

            const onMove = (mv) => {
                if(!isDragging) return;
                newEdit.vpX = initVpX + (mv.clientX - startX) / (2.0 * cssScale);
                newEdit.vpY = initVpY + (mv.clientY - startY) / (2.0 * cssScale);
                syncVisuals(newEdit);
            };
            const onUp = () => { isDragging = false; document.removeEventListener('pointermove', onMove); document.removeEventListener('pointerup', onUp); };
            document.addEventListener('pointermove', onMove); document.addEventListener('pointerup', onUp);
        });

        el.addEventListener('dblclick', (ev) => {
            if(newEdit.type === 'text' || newEdit.type === 'formtext') {
                ev.stopPropagation();
                document.querySelectorAll('.tool-btn, .tool-select').forEach(b => b.classList.remove('active'));
                document.querySelector('.tool-btn[data-tool="text"]').classList.add('active');
                setEditorTool('text', newEdit.type);
                selectObject(newEdit);
                setTimeout(() => { el.focus(); }, 50);
            }
        });

        liveEdits.push(newEdit);
        syncVisuals(newEdit);
        
        activeTool = 'select'; document.body.dataset.activeTool = 'select';
        document.querySelectorAll('.tool-btn, .tool-select').forEach(b => b.classList.remove('active'));
        document.querySelector('.tool-btn[data-tool="select"]').classList.add('active');
        selectObject(newEdit);
        document.getElementById('text-format-bar').style.display = 'flex';
    }
});

function hexToRgb(hex) { const r = parseInt(hex.slice(1, 3), 16)/255; const g = parseInt(hex.slice(3, 5), 16)/255; const b = parseInt(hex.slice(5, 7), 16)/255; return rgb(r, g, b); }

async function generateEditedPdfBytes() {
    const tempDoc = await PDFDocument.load(originalPdfBytes.slice(0));
    const pages = tempDoc.getPages(); const form = tempDoc.getForm() || tempDoc.addForm();
    for(let pNum in pageRotations) { if(pageRotations[pNum]) { const targetPage = pages[parseInt(pNum) - 1]; targetPage.setRotation(degrees(targetPage.getRotation().angle + pageRotations[pNum])); } }
    
    const sortedEdits = [...liveEdits].sort((a,b) => a.zIndex - b.zIndex);
    for (let edit of sortedEdits) {
        try {
            const page = pages[edit.pageNum - 1];
            const tRgb = hexToRgb(edit.textColor || '#000000'); const bRgb = hexToRgb(edit.borderColor || '#000000'); let fRgb;
            if (!edit.noFill && edit.fillColor) fRgb = hexToRgb(edit.fillColor);

            const [pdfL, pdfT] = currentViewport.convertToPdfPoint(edit.vpX, edit.vpY);
            const [pdfR, pdfB] = currentViewport.convertToPdfPoint(edit.vpX + (edit.vpW||0), edit.vpY + (edit.vpH||0));
            const w = Math.abs(pdfR - pdfL); const h = Math.abs(pdfT - pdfB);
            const x = Math.min(pdfL, pdfR); const y = Math.min(pdfT, pdfB); 
            const [txtX, txtBaselineY] = currentViewport.convertToPdfPoint(edit.vpX, edit.vpY + (edit.fontSize || 16));

            if (edit.type === 'text') {
                let clone = edit.el.cloneNode(true);
                let del = clone.querySelector('.del-overlay-btn'); if(del) del.remove();
                let text = clone.innerText || " "; text = text.replace(/[^\x00-\x7F]/g, ""); 
                if (text.trim().length > 0) { 
                    let fontToUse = StandardFonts.Helvetica;
                    if (edit.isBold && edit.isItalic) fontToUse = StandardFonts.HelveticaBoldOblique;
                    else if (edit.isBold) fontToUse = StandardFonts.HelveticaBold;
                    else if (edit.isItalic) fontToUse = StandardFonts.HelveticaOblique;
                    const pdfFont = await tempDoc.embedFont(fontToUse);

                    page.drawText(text, { 
                        x: txtX, y: txtBaselineY, 
                        size: edit.fontSize || 16, 
                        color: tRgb, 
                        rotate: degrees(-(edit.rotation || 0)),
                        font: pdfFont 
                    }); 
                }
            }
            else if (edit.type === 'tick') { page.drawLine({ start: {x: x + w*0.1, y: y + h*0.6}, end: {x: x + w*0.4, y: y + h*0.1}, thickness: 2, color: tRgb }); page.drawLine({ start: {x: x + w*0.4, y: y + h*0.1}, end: {x: x + w*0.9, y: y + h*0.9}, thickness: 2, color: tRgb }); }
            else if (edit.type === 'cross') { page.drawLine({ start: {x: x + w*0.2, y: y + h*0.2}, end: {x: x + w*0.8, y: y + h*0.8}, thickness: 2, color: tRgb }); page.drawLine({ start: {x: x + w*0.2, y: y + h*0.8}, end: {x: x + w*0.8, y: y + h*0.2}, thickness: 2, color: tRgb }); }
            else if (edit.type === 'rect') { page.drawRectangle({ x: x, y: y, width: w, height: h, borderColor: bRgb, borderWidth: 2, color: fRgb, rotate: degrees(-(edit.rotation || 0)) }); }
            else if (edit.type === 'ellipse') { page.drawEllipse({ x: x + w/2, y: y + h/2, xScale: w/2, yScale: h/2, borderColor: bRgb, borderWidth: 2, color: fRgb }); }
            else if (edit.type === 'line') { page.drawLine({ start: {x: pdfL, y: pdfT}, end: {x: pdfR, y: pdfB}, thickness: 3, color: bRgb }); }
            else if (edit.type === 'highlight') { page.drawRectangle({ x: x, y: y, width: w, height: h, color: hexToRgb(edit.fillColor || '#facc15'), opacity: 0.4 }); }
            else if (edit.type === 'formtext') { const tf = form.createTextField(`tf_${Date.now()}`); const opts = { x: x, y: y, width: w, height: h, textColor: tRgb, borderWidth: 0 }; if(fRgb) opts.backgroundColor = fRgb; tf.addToPage(page, opts); }
            else if (edit.type === 'checkbox') { const cb = form.createCheckBox(`cb_${Date.now()}`); cb.addToPage(page, { x: x, y: y, width: w, height: h }); }
            else if (edit.type === 'image' && edit.imgData) { let img = edit.imgData.includes('image/png') ? await tempDoc.embedPng(edit.imgData) : await tempDoc.embedJpg(edit.imgData); if(img) page.drawImage(img, { x: x, y: y, width: w, height: h, rotate: degrees(-(edit.rotation || 0)) }); }
            else if (edit.type === 'crop') {
                const targetPages = edit.allPages ? pages : [page];
                targetPages.forEach(p => p.setCropBox(x, y, w, h));
            }
        } catch(err) { console.warn("Internal draw error:", err); }
    }
    return await tempDoc.save();
}

document.getElementById('save-edit-btn').addEventListener('click', async () => {
    const status = document.getElementById('edit-status'); 
    status.innerText = "Baking edits..."; status.style.color = "#38bdf8";
    try {
        selectObject(null); 
        const finalBytes = await generateEditedPdfBytes();
        const fName = document.getElementById('edit-filename').value || document.getElementById('edit-filename').placeholder;
        downloadFile(finalBytes, fName);
        status.innerText = "Saved successfully!"; status.style.color = "#10b981";
    } catch(e) { status.innerText = "Error saving PDF: " + e.message; status.style.color = "#ef4444"; console.error(e); }
});

document.getElementById('preview-print-btn').addEventListener('click', async () => {
    const status = document.getElementById('edit-status'); 
    status.innerText = "Generating Preview..."; status.style.color = "#38bdf8";
    try {
        selectObject(null); 
        const finalBytes = await generateEditedPdfBytes();
        printPdfBlob(finalBytes);
        status.innerText = "Opened in new tab!"; status.style.color = "#10b981";
    } catch(e) { status.innerText = "Error generating preview: " + e.message; status.style.color = "#ef4444"; console.error(e); }
});