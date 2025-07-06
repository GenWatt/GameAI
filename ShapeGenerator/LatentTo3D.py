import torch
import numpy as np
import os
from shap_e.models.download import load_model

class LatentTo3D:
    def __init__(self):
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        print("Loading transmitter model...")
        self.xm = load_model('transmitter', device=self.device)
        print("✓ Ready to convert!")
    
    def pt_to_obj(self, pt_file, obj_file):
        """Convert .pt latent to .obj mesh"""
        try:
            # Load latent
            latent = torch.load(pt_file, map_location=self.device)
            print(f"Converting {pt_file} to {obj_file}...")
            
            # Decode to mesh
            with torch.no_grad():
                mesh = self.xm.renderer.render_views(
                    latent[None],
                    n=1,
                    return_type='tri_mesh'
                )[0]
                
                vertices = mesh.verts.cpu().numpy()
                faces = mesh.faces.cpu().numpy()
            
            # Save as OBJ
            with open(obj_file, 'w') as f:
                # Write vertices
                for v in vertices:
                    f.write(f"v {v[0]:.6f} {v[1]:.6f} {v[2]:.6f}\n")
                
                # Write faces (OBJ uses 1-based indexing)
                for face in faces:
                    f.write(f"f {face[0]+1} {face[1]+1} {face[2]+1}\n")
            
            print(f"✓ Created mesh: {obj_file}")
            return True
            
        except Exception as e:
            print(f"✗ Mesh conversion failed: {e}")
            return False
    
    def pt_to_ply(self, pt_file, ply_file):
        """Convert .pt latent to .ply point cloud"""
        try:
            # Load latent
            latent = torch.load(pt_file, map_location=self.device)
            print(f"Converting {pt_file} to {ply_file}...")
            
            # Decode to point cloud
            with torch.no_grad():
                pc = self.xm.renderer.render_views(
                    latent[None],
                    n=1,
                    return_type='point_cloud'
                )[0]
                
                points = pc.coords.cpu().numpy()
                colors = pc.channels.cpu().numpy() if hasattr(pc, 'channels') else None
            
            # Save as PLY
            with open(ply_file, 'w') as f:
                f.write("ply\n")
                f.write("format ascii 1.0\n")
                f.write(f"element vertex {len(points)}\n")
                f.write("property float x\n")
                f.write("property float y\n")
                f.write("property float z\n")
                
                if colors is not None:
                    f.write("property uchar red\n")
                    f.write("property uchar green\n")
                    f.write("property uchar blue\n")
                
                f.write("end_header\n")
                
                for i, point in enumerate(points):
                    if colors is not None and i < len(colors):
                        color = (colors[i] * 255).astype(int)
                        f.write(f"{point[0]:.6f} {point[1]:.6f} {point[2]:.6f} {color[0]} {color[1]} {color[2]}\n")
                    else:
                        f.write(f"{point[0]:.6f} {point[1]:.6f} {point[2]:.6f}\n")
            
            print(f"✓ Created point cloud: {ply_file}")
            return True
            
        except Exception as e:
            print(f"✗ Point cloud conversion failed: {e}")
            return False
    
    def convert_all_in_folder(self, folder_path="output"):
        """Convert all .pt files in folder"""
        pt_files = [f for f in os.listdir(folder_path) if f.endswith('.pt')]
        
        if not pt_files:
            print(f"No .pt files found in {folder_path}")
            return
        
        print(f"Found {len(pt_files)} .pt files to convert:")
        
        for pt_file in pt_files:
            pt_path = os.path.join(folder_path, pt_file)
            base_name = pt_file[:-3]  # Remove .pt extension
            
            obj_path = os.path.join(folder_path, f"{base_name}.obj")
            ply_path = os.path.join(folder_path, f"{base_name}.ply")
            
            print(f"\n--- Converting {pt_file} ---")
            
            # Try mesh first
            if self.pt_to_obj(pt_path, obj_path):
                print(f"✓ Mesh saved: {base_name}.obj")
            
            # Also try point cloud
            if self.pt_to_ply(pt_path, ply_path):
                print(f"✓ Point cloud saved: {base_name}.ply")

