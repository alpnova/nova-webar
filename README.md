# Nova WebAR Project

This project aims to bring the Nova hologram experience to the web using WebAR (WebXR API) and three.js.

## Current Status (v2)

- Basic HTML, CSS, and JavaScript structure.
- three.js scene setup.
- WebXR AR session initialization with a custom 'Start AR' button. The default `ARButton` from three.js is used for session management but hidden, and our custom button triggers it.
- Hit-testing enabled to find surfaces in the real world. A white ring reticle indicates detected surfaces.
- A semi-transparent green cube can be placed on a detected surface by tapping the screen while in AR mode. Tapping again moves the cube.
- Basic error handling for AR support and session requests.

## Next Steps

1.  **Test Basic AR**: Deploy this initial version to Netlify (or test locally with HTTPS) and test on an iPhone to ensure the AR session starts, camera works, the reticle appears, and the cube can be placed and moved.
2.  **Replicate Nova Particle System**: 
    *   Translate the particle generation logic from `NovaHologramController.cs` (Unity C#) or the existing `Nova_ar_version.html` (JavaScript/three.js) to this new WebXR structure.
    *   Implement particle animation and eye movement logic using `three.js` (e.g., `THREE.Points` and custom shaders if needed).
3.  **Replace Cube with Nova**: Once the Nova particle system is working in `three.js`, replace the placeholder cube with the Nova hologram.
4.  **Refinements**: Adjust appearance, performance, and interactions. Ensure transparent background for the AR view.

## How to Run Locally (Optional - for development)

1.  You'll need a local HTTPS server because WebXR requires a secure context.
    *   One way is to use Node.js and the `http-server` package with SSL:
        ```bash
        # Install http-server globally if you haven't already
        # npm install -g http-server
        
        # Navigate to your project directory (e.g., nova_webar)
        cd /Users/novadev/Desktop/verbessert_hologramm/nova_webar

        # Generate a self-signed certificate (e.g., using mkcert or openssl)
        # Example using openssl (run this in the nova_webar directory):
        # openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem
        # (You'll be asked for some info, you can just press Enter for most)

        # Start the server
        http-server -S -C cert.pem -o
        ```
    *   Then access via `https://<your-local-ip>:8080` on your iPhone (e.g., `https://192.168.1.10:8080`). You might need to trust the self-signed certificate on your iPhone.
2.  For easier and more reliable testing on an iPhone, deploying to Netlify (which provides HTTPS automatically) is highly recommended.

## Deployment to Netlify

1.  Ensure you have a Git repository (e.g., on GitHub, GitLab) for your `verbessert_hologramm` project, or at least for the `nova_webar` subdirectory.
2.  Commit these new files (`index.html`, `script.js`, `README.md`) to your repository.
3.  Go to [Netlify](https://www.netlify.com/) and sign up/log in.
4.  Click on "Add new site" -> "Import an existing project".
5.  Connect to your Git provider.
6.  Select your repository.
7.  Configure the build settings:
    *   **Branch to deploy**: Your main branch (e.g., `main`, `master`).
    *   **Base directory**: If your `nova_webar` folder is not the root of the repository, specify it here (e.g., `nova_webar/`). If `index.html` is in `nova_webar` and `nova_webar` is what you want to deploy, this might be empty or `nova_webar` depending on your repo structure.
    *   **Build command**: Leave empty (it's a static site).
    *   **Publish directory**: If your `index.html` is directly in the `Base directory` (e.g. `nova_webar/index.html`), this should be the same as `Base directory` or just `/` or `.` relative to the base. If you set Base directory to `nova_webar`, then Publish directory can be `.` or empty.
8.  Click "Deploy site". Netlify will give you a live HTTPS URL.
