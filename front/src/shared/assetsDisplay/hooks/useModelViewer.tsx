import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { useThreeJSColors } from '@/lib/colors';;
import { useRef, useState, useEffect } from 'react';
import type { ModelViewerProps } from '../components/ModelViewer';

export const useModelViewer = ({ url }: ModelViewerProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const controlsRef = useRef<OrbitControls | null>(null);
    const animationRef = useRef<number | null>(null);

    const themeColors = useThreeJSColors();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [fileExists, setFileExists] = useState<boolean | null>(null);

    const checkFileExists = async (url: string): Promise<boolean> => {
        try {
            const response = await fetch(url, { method: 'HEAD' });
            console.log('File check response:', response.status, response.ok);
            return response.ok;
        } catch (error) {
            console.error('Error checking file existence:', error);
            return false;
        }
    };

    const getFileExtension = (url: string): string => {
        return url.split('.').pop()?.toLowerCase() || '';
    };

    const initThreeJS = () => {
        if (!containerRef.current) {
            console.error('Container not ready');
            return false;
        }

        const container = containerRef.current;
        const width = container.clientWidth;
        const height = container.clientHeight;

        console.log('Container dimensions:', width, height);

        if (width === 0 || height === 0) {
            console.error('Container has no dimensions');
            return false;
        }

        container.innerHTML = '';

        // Scene
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(themeColors.background); // Light gray background
        sceneRef.current = scene;

        // Camera
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.set(5, 5, 5);
        camera.lookAt(0, 0, 0);
        cameraRef.current = camera;

        // Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(10, 10, 10);
        scene.add(directionalLight);

        // Controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controlsRef.current = controls;

        console.log('Three.js initialized successfully');
        return true;
    };

    // Animation loop
    const animate = () => {
        if (!rendererRef.current || !sceneRef.current || !cameraRef.current) {
            return;
        }

        animationRef.current = requestAnimationFrame(animate);

        if (controlsRef.current) {
            controlsRef.current.update();
        }

        rendererRef.current.render(sceneRef.current, cameraRef.current);
    };

    // Load model
    const loadModel = async () => {
        console.log('Starting loadModel function');

        if (!sceneRef.current || !cameraRef.current) {
            console.error('Three.js not initialized');
            setError('Three.js not initialized');
            setLoading(false);
            return;
        }

        const extension = getFileExtension(url);
        console.log(`Loading ${extension.toUpperCase()} model:`, url);

        try {
            if (extension === 'fbx') {
                console.log('Creating FBX loader...');
                const loader = new FBXLoader();

                loader.load(
                    url,
                    (fbx) => {
                        console.log('FBX loaded successfully:', fbx);

                        // Remove any existing models
                        const existingModels = sceneRef.current!.children.filter(child => child.userData.isModel);
                        existingModels.forEach(model => sceneRef.current!.remove(model));

                        // Mark as model
                        fbx.userData.isModel = true;

                        // Scale and center the FBX model
                        fbx.scale.set(0.01, 0.01, 0.01);

                        // Center the model
                        const box = new THREE.Box3().setFromObject(fbx);
                        const center = box.getCenter(new THREE.Vector3());
                        fbx.position.x = -center.x;
                        fbx.position.y = -center.y;
                        fbx.position.z = -center.z;

                        sceneRef.current!.add(fbx);
                        setLoading(false);
                        console.log('FBX model added to scene successfully');
                    },
                    (progress) => {
                        if (progress.total > 0) {
                            const percent = (progress.loaded / progress.total) * 100;
                            console.log('Loading progress:', percent.toFixed(1) + '%');
                        }
                    },
                    (error) => {
                        console.error('Error loading FBX:', error);
                        setError('Failed to load FBX model.');
                        setLoading(false);
                    }
                );
            } else if (extension === 'glb' || extension === 'gltf') {
                console.log('Creating GLB/GLTF loader...');
                const loader = new GLTFLoader();

                loader.load(
                    url,
                    (gltf) => {
                        console.log('GLB/GLTF loaded successfully:', gltf);

                        const model = gltf.scene;
                        const existingModels = sceneRef.current!.children.filter(child => child.userData.isModel);
                        existingModels.forEach(model => sceneRef.current!.remove(model));


                        model.userData.isModel = true;

                        // Center the model
                        const box = new THREE.Box3().setFromObject(model);
                        const center = box.getCenter(new THREE.Vector3());
                        const size = box.getSize(new THREE.Vector3());

                        model.position.x = -center.x;
                        model.position.y = -center.y;
                        model.position.z = -center.z;

                        // Scale to fit
                        const maxDim = Math.max(size.x, size.y, size.z);
                        if (maxDim > 10) {
                            const scale = 5 / maxDim;
                            model.scale.set(scale, scale, scale);
                        }

                        sceneRef.current!.add(model);
                        setLoading(false);
                    },
                    () => {
                        setError('Failed to load GLB/GLTF model.');
                        setLoading(false);
                    }
                );
            } else {
                const errorMsg = `Unsupported file format: ${extension}`;
                setError(errorMsg);
                setLoading(false);
            }
        } catch (error) {
            setError('Error loading model: ' + (error as Error).message);
            setLoading(false);
        }
    };

    useEffect(() => {
        const initAndLoad = async () => {
            setLoading(true);
            setError(null);
            setFileExists(null);

            // await new Promise(resolve => setTimeout(resolve, 100));

            const exists = await checkFileExists(url);
            setFileExists(exists);

            if (!exists) {
                setError(`File not found: ${url}`);
                setLoading(false);
                return;
            }

            const initialized = initThreeJS();
            if (!initialized) {
                setError('Failed to initialize 3D viewer');
                setLoading(false);
                return;
            }

            animate();

            await loadModel();
        };

        initAndLoad();

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }

            if (controlsRef.current) {
                controlsRef.current.dispose();
            }

            if (rendererRef.current && containerRef.current) {
                try {
                    if (containerRef.current.contains(rendererRef.current.domElement)) {
                        containerRef.current.removeChild(rendererRef.current.domElement);
                    }
                } catch (e) {
                    console.log('Cleanup error:', e);
                }
                rendererRef.current.dispose();
            }
        };
    }, [url]);

    useEffect(() => {
        const handleResize = () => {
            if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;

            const width = containerRef.current.clientWidth;
            const height = containerRef.current.clientHeight;

            cameraRef.current.aspect = width / height;
            cameraRef.current.updateProjectionMatrix();
            rendererRef.current.setSize(width, height);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return {
        containerRef,
        loading,
        error,
        fileExists,
        scene: sceneRef.current,
        camera: cameraRef.current,
        renderer: rendererRef.current,
        controls: controlsRef.current,
    };
}