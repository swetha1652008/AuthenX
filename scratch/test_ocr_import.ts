import { createWorker } from 'tesseract.js';
import * as pdfjsLib from 'pdfjs-dist';

console.log('Tesseract createWorker type:', typeof createWorker);
console.log('PDFJS getDocument type:', typeof pdfjsLib.getDocument);
