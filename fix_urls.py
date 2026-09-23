import os
import glob

# Path to the frontend directory
frontend_dir = os.path.join("c:\\Project\\crm_project\\frontend", "src")

# Find all jsx files
jsx_files = glob.glob(os.path.join(frontend_dir, "**/*.jsx"), recursive=True)

for file_path in jsx_files:
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Replace the exact string
    new_content = content.replace(
        "'http://127.0.0.1:5000/api",
        "import.meta.env.VITE_API_URL + '/api"
    )
    
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(new_content)

print(f"Updated {len(jsx_files)} files.")
