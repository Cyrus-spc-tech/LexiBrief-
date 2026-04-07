# LexiBrief-

A comprehensive Python-based NLP toolkit for legal document analysis and summarization with extractive, abstractive, and hybrid methods.

## 🚀 Features

* Legal Text Processing
* Extractive Summarization
* Abstractive Summarization
* Hybrid Approaches
* Evaluation Framework

> #### Collab Link:
> https://colab.research.google.com/drive/1QrR3fJJ1dy9JoUBi9lKXSBsEoqYyMFSw?usp=sharing






# Pipeline
> ### Input Documents → Text Extraction → Preprocessing → Summarization → Evaluation → Output

===============================================================

| Phase | Component | Description | Technology | File Location |
|-------|-----------|-------------|------------|---------------|
| **1. Input** | Document Upload | Accept legal documents in various formats | HTML5 File API | [Frontend/index.html](cci:7://file:///d:/REPO/LexiBrief-/Frontend/index.html:0:0-0:0) |
| | File Validation | Check file type, size, format | JavaScript | [Frontend/script.js](cci:7://file:///d:/REPO/LexiBrief-/Frontend/script.js:0:0-0:0) |
| **2. Extraction** | PDF Parsing | Extract text from PDF documents | PyPDF2, PDFPlumber | [Backend/lds.ipynb](cci:7://file:///d:/REPO/LexiBrief-/Backend/lds.ipynb:0:0-0:0) |
| | Text Encoding | Convert to UTF-8 format | Python | [Backend/cleaned_lds.ipynb](cci:7://file:///d:/REPO/LexiBrief-/Backend/cleaned_lds.ipynb:0:0-0:0) |
| **3. Preprocessing** | Text Cleaning | Remove noise, citations, page numbers | Regex, spaCy | [Backend/cleaned_lds.ipynb](cci:7://file:///d:/REPO/LexiBrief-/Backend/cleaned_lds.ipynb:0:0-0:0) |
| | Sentence Segmentation | Split text into meaningful sentences | spaCy NLP | [Backend/cleaned_lds.ipynb](cci:7://file:///d:/REPO/LexiBrief-/Backend/cleaned_lds.ipynb:0:0-0:0) |
| | Legal Term Processing | Preserve legal terminology | Custom Dictionary | [Backend/cleaned_lds.ipynb](cci:7://file:///d:/REPO/LexiBrief-/Backend/cleaned_lds.ipynb:0:0-0:0) |
| **4. Summarization** | Extractive Method | TF-IDF based sentence ranking | scikit-learn | [Backend/lds.ipynb](cci:7://file:///d:/REPO/LexiBrief-/Backend/lds.ipynb:0:0-0:0) |
| | Abstractive Method | Neural text generation | BART-Large-CNN | [Backend/lds.ipynb](cci:7://file:///d:/REPO/LexiBrief-/Backend/lds.ipynb:0:0-0:0) |
| | Hybrid Method | Combined approach | Custom Pipeline | [Backend/cleaned_lds.ipynb](cci:7://file:///d:/REPO/LexiBrief-/Backend/cleaned_lds.ipynb:0:0-0:0) |
| **5. Evaluation** | ROUGE Scoring | Measure summary quality | rouge-score | [Backend/cleaned_lds.ipynb](cci:7://file:///d:/REPO/LexiBrief-/Backend/cleaned_lds.ipynb:0:0-0:0) |
| | Compression Analysis | Calculate text reduction ratio | Python | [Backend/cleaned_lds.ipynb](cci:7://file:///d:/REPO/LexiBrief-/Backend/cleaned_lds.ipynb:0:0-0:0) |
| | Word Overlap | Check legal term preservation | Counter | [Backend/cleaned_lds.ipynb](cci:7://file:///d:/REPO/LexiBrief-/Backend/cleaned_lds.ipynb:0:0-0:0) |
| **6. Output** | Report Generation | Create structured results | JSON, Python | [Backend/output/](cci:9://file:///d:/REPO/LexiBrief-/Backend/output:0:0-0:0) |
| | Visualization | Generate charts and graphs | matplotlib, seaborn | [Backend/output/](cci:9://file:///d:/REPO/LexiBrief-/Backend/output:0:0-0:0) |
| | Web Display | Show results in browser | HTML, CSS, JS | [Frontend/](cci:9://file:///d:/REPO/LexiBrief-/Frontend:0:0-0:0) |

### Data Flow Table

| Step | Input Source | Processing | Output Destination | Data Format |
|------|--------------|------------|-------------------|-------------|
| 1 | User Upload | File Validation | Backend Processing | PDF/TXT |
| 2 | Raw Files | Text Extraction | Preprocessing | String |
| 3 | Extracted Text | Cleaning & Segmentation | Summarization | Sentences |
| 4 | Clean Sentences | AI Summarization | Evaluation | Summaries |
| 5 | Generated Summaries | Quality Metrics | Output Generation | Scores + Text |
| 6 | Evaluated Results | Formatting | User Interface | JSON/HTML |

