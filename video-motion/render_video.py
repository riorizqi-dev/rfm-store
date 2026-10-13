import os
import sys
import time
import subprocess
import playwright.sync_api

def render_commercial_video():
    work_dir = 'C:/Users/ADVAN/Documents/antigravity/rfm-store/video-motion'
    frames_dir = os.path.join(work_dir, 'frames')
    os.makedirs(frames_dir, exist_ok=True)

    total_frames = 720 # 24 seconds * 30 fps
    fps = 30
    html_path = 'file:///' + os.path.join(work_dir, 'index.html').replace('\\', '/')

    print(f"Starting frame generation: {total_frames} frames at {fps} FPS (1920x1080)...")
    start_time = time.time()

    with playwright.sync_api.sync_playwright() as p:
        browser = p.chromium.launch(channel='chrome', headless=True)
        page = browser.new_page(viewport={'width': 1920, 'height': 1080}, device_scale_factor=1)
        page.goto(html_path)

        for f in range(total_frames):
            page.evaluate(f'window.seekFrame({f})')
            frame_path = os.path.join(frames_dir, f'frame_{f:05d}.png')
            page.screenshot(path=frame_path)
            
            if (f + 1) % 60 == 0 or f == total_frames - 1:
                elapsed = time.time() - start_time
                percent = ((f + 1) / total_frames) * 100
                fps_render = (f + 1) / elapsed
                remaining = (total_frames - (f + 1)) / (fps_render if fps_render > 0 else 1)
                print(f"Rendered {f + 1}/{total_frames} frames ({percent:.1f}%) | Speed: {fps_render:.1f} fps | Est remaining: {remaining:.1f}s")

        browser.close()

    render_time = time.time() - start_time
    print(f"All {total_frames} frames generated in {render_time:.1f}s! Now encoding MP4 with FFmpeg...")

    audio_source = 'C:/Users/ADVAN/Documents/antigravity/calm-kepler/teh-hijau.mp3'
    output_video = os.path.join(work_dir, 'rfm_store_commercial.mp4')
    web_public_video = 'C:/Users/ADVAN/Documents/antigravity/rfm-store/public/rfm_store_commercial.mp4'

    cmd = [
        'ffmpeg',
        '-y',
        '-r', str(fps),
        '-i', os.path.join(frames_dir, 'frame_%05d.png'),
        '-ss', '00:00:00',
        '-t', '24',
        '-i', audio_source,
        '-af', 'afade=t=in:st=0:d=1,afade=t=out:st=21.5:d=2.5',
        '-c:v', 'libx264',
        '-preset', 'slow',
        '-crf', '18',
        '-pix_fmt', 'yuv420p',
        '-c:a', 'aac',
        '-b:a', '256k',
        '-shortest',
        output_video
    ]

    print("Running FFmpeg encoding...")
    subprocess.run(cmd, check=True)
    print(f"Video successfully encoded: {output_video}")

    # Copy to public folder for website use
    import shutil
    shutil.copy2(output_video, web_public_video)
    print(f"Video copied to web public assets: {web_public_video}")

if __name__ == '__main__':
    render_commercial_video()
