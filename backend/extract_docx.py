import zipfile
import xml.etree.ElementTree as ET
import os

docx_path = r"c:\Users\bheem\OneDrive\Desktop\Join Schooling\source code\all-files\JoinSchooling_Project_Report.docx"
out_path = r"c:\Users\bheem\OneDrive\Desktop\Join Schooling\source code\all-files\backend\docx_report_extracted.txt"

with zipfile.ZipFile(docx_path) as z:
    xml_content = z.read("word/document.xml")
    root = ET.fromstring(xml_content)
    paragraphs = []
    for node in root.iter():
        if node.tag.endswith("p"):
            text = "".join(node.itertext()).strip()
            if text:
                paragraphs.append(text)
    
    full_text = "\n\n".join(paragraphs)
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(full_text)

print(f"Extracted {len(paragraphs)} paragraphs, total {len(full_text)} characters.")
print("\n--- FIRST 2000 CHARACTERS ---")
print(full_text[:2000])
