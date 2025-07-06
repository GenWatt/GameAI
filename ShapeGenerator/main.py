import io
import os
import torch
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import StreamingResponse, JSONResponse
from diffusers import StableDiffusionPipeline, StableDiffusionImg2ImgPipeline
from PIL import Image

app = FastAPI()

# --- Configuration ---
MODEL_ID_TEXT_TO_IMAGE = "runwayml/stable-diffusion-v3-5-large"
MODEL_ID_IMAGE_TO_IMAGE = "runwayml/stable-diffusion-v1-5"
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

# --- Load pipelines only when needed to save memory ---
pipe_txt2img = None
pipe_img2img = None

def get_pipe_txt2img():
    global pipe_txt2img
    if pipe_txt2img is None:
        pipe_txt2img = StableDiffusionPipeline.from_pretrained(MODEL_ID_TEXT_TO_IMAGE).to(DEVICE)
        pipe_txt2img.enable_attention_slicing()
    return pipe_txt2img

def get_pipe_img2img():
    global pipe_img2img
    if pipe_img2img is None:
        pipe_img2img = StableDiffusionImg2ImgPipeline.from_pretrained(MODEL_ID_IMAGE_TO_IMAGE).to(DEVICE)
        pipe_img2img.enable_attention_slicing()
    return pipe_img2img

# --- Routes ---
@app.post("/generate/text-to-image")
async def generate_text_to_image(prompt: str):
    if not prompt:
        raise HTTPException(status_code=400, detail="`prompt` parameter is required.")

    try:
        pipe = get_pipe_txt2img()
        image = pipe(prompt).images[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Generation error: {e}")

    buffer = io.BytesIO()
    image.save(buffer, format="PNG")
    buffer.seek(0)
    return StreamingResponse(buffer, media_type="image/png")


@app.post("/generate/image-to-image")
async def generate_image_to_image(
    prompt: str,
    init_image: UploadFile = File(...),
    strength: float = 0.75,
    guidance_scale: float = 7.5
):
    try:
        input_bytes = await init_image.read()
        init_pil = Image.open(io.BytesIO(input_bytes)).convert("RGB")
        init_pil = init_pil.resize((768, 768)) if init_pil.size != (768, 768) else init_pil

        pipe = get_pipe_img2img()
        image = pipe(
            prompt=prompt,
            image=init_pil,
            strength=strength,
            guidance_scale=guidance_scale
        ).images[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Generation error: {e}")

    buffer = io.BytesIO()
    image.save(buffer, format="PNG")
    buffer.seek(0)
    return StreamingResponse(buffer, media_type="image/png")


if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, log_level="info")
