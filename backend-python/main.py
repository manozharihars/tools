from fastapi import FastAPI, UploadFile, File, BackgroundTasks, HTTPException, Form
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pdf2docx import Converter
import uuid
import os
import shutil

app = FastAPI(title="CloudToolbox Python PDF Parser")

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

TEMP_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "temp_conversions")
os.makedirs(TEMP_DIR, exist_ok=True)

def cleanup_files(*filepaths: str):
    """
    Background worker task to delete files from disk once response pipelines finish.
    """
    for filepath in filepaths:
        if os.path.exists(filepath):
            try:
                os.remove(filepath)
                print(f"Lifecycle Manager: Securely purged resource: {os.path.basename(filepath)}")
            except Exception as e:
                print(f"Lifecycle Manager: Error purging stale resource {filepath}: {str(e)}")

@app.post("/convert/pdf-to-docx")
async def convert_pdf_to_docx(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    task_id = str(uuid.uuid4())
    pdf_path = os.path.join(TEMP_DIR, f"{task_id}.pdf")
    docx_path = os.path.join(TEMP_DIR, f"{task_id}.docx")

    # Ingest the incoming file stream
    try:
        with open(pdf_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save file: {str(e)}")

    try:
        # pdf2docx analyzes structural geometry in-memory
        cv = Converter(pdf_path)
        cv.convert(docx_path, start=0, end=None)
        cv.close()
    except Exception as e:
        # Ensure cleanup of source pdf if conversion crashed
        if os.path.exists(pdf_path):
            os.remove(pdf_path)
        raise HTTPException(status_code=500, detail=f"Geometry conversion failed: {str(e)}")

    # Clean up the original PDF file right after conversion
    if os.path.exists(pdf_path):
        os.remove(pdf_path)

    # Queue background task to delete the exported DOCX file after download completes
    background_tasks.add_task(cleanup_files, docx_path)

    base_name = file.filename
    if base_name.lower().endswith(".pdf"):
        base_name = base_name[:-4]
    download_filename = f"{base_name}.docx"

    return FileResponse(
        path=docx_path,
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        filename=download_filename
    )

@app.post("/pdf/protect")
async def protect_pdf(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    user_password: str = Form(...),
    owner_password: str = Form("")
):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    task_id = str(uuid.uuid4())
    input_path = os.path.join(TEMP_DIR, f"{task_id}_input.pdf")
    output_path = os.path.join(TEMP_DIR, f"{task_id}_protected.pdf")

    # Ingest incoming file stream
    try:
        with open(input_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save file: {str(e)}")

    try:
        import fitz
        doc = fitz.open(input_path)
        doc.save(
            output_path,
            encryption=fitz.PDF_ENCRYPT_AES_128,
            user_pw=user_password,
            owner_pw=owner_password or "owner-key-toolbox"
        )
        doc.close()
    except Exception as e:
        if os.path.exists(input_path):
            os.remove(input_path)
        raise HTTPException(status_code=500, detail=f"Encryption failed: {str(e)}")

    # Cleanup raw input PDF immediately
    if os.path.exists(input_path):
        os.remove(input_path)

    # Queue background task to delete output file after response completes
    background_tasks.add_task(cleanup_files, output_path)

    base_name = file.filename
    if base_name.lower().endswith(".pdf"):
        base_name = base_name[:-4]
    download_filename = f"{base_name}_protected.pdf"

    return FileResponse(
        path=output_path,
        media_type="application/pdf",
        filename=download_filename
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
