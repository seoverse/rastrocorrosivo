let scene, camera, renderer;
let nodes = [];
let lines = [];
let targetPosition = null;
let moveSpeed = 0.05;

// Crear escena
scene = new THREE.Scene();
camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 5000);
camera.position.z = 800;
renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Luz
const light = new THREE.PointLight(0x00ff00, 2, 1000);
light.position.set(0, 0, 400);
scene.add(light);

// Definición de nodos
const nodesData = [
  { id: "Salmonella", x: -300, y: 150, z: 300, description: "Salmonella", image: "gifs/salmonella.mp4" },
  { id: "Salmonella_enterica", x: -100, y: 250, z: 300, description: "Salmonella Enterica", image: "gifs/salmonellaenterica.mp4" },
  { id: "Shigella", x: 100, y: 150, z: 300, description: "Shigella", image: "gifs/shigella.mp4" },
  { id: "Vibrio_cholerae", x: 300, y: 100, z: 300, description: "Vibrio cholerae", image: "gifs/vc.mp4" },
  { id: "Burkholderia", x: 200, y: -150, z: 300, description: "Burkholderia pseudomallei", image: "gifs/bp.mp4" },
  { id: "Giardia", x: -200, y: -120, z: 300, description: "Giardia", image: "gifs/giardia.mp4" },
  
  // Nodos secundarios 
  { id: "Tracto_intestinal_humano", x: -100, y: 260, z: -200, description: "Tracto intestinal humano", image: "gifs/intestino.mp4",  width: 70, height: 100 },
  { id: "Heces_infectadas", x: 100, y: 600, z: -400, description: "Heces infectadas", image: "imagenes/heces.mp4" },
  { id: "Drenaje", x: 200, y: 0, z: -600, description: "Drenaje", image: "gifs/mariscos.mp4" },
  { id: "Agua_estancada", x: -300, y: -100, z: -800, description: "Agua estancada", image: "gifs/aguaestancada.mp4", width: 90, height: 90, offsetX: 0, offsetY: 26 },
  { id: "Filtracion_subsuelo", x: 400, y: 200, z: -1000, description: "Filtración al subsuelo", image: "imagenes/filtracion.mp4" },
  { id: "Acuiferos", x: 500, y: -700, z: -1200, description: "Acuíferos", image: "imagenes/acuiferos.mp4" },
  { id: "Suministro", x: 600, y: -250, z: -1400, description: "Inflitración del parásito en el suministro de agua de la Cuenca del Valle de México.", image: "gifs/suministro.mp4",  
  width: 190, height: 70, offsetX: 43, offsetY: -10, },
  { id: "Ingesta", x: 900, y: -300, z: -1600, description: "Ingesta", image: "imagenes/ingesta.mp4" },
  { id: "Cultivos_contaminados", x: 200, y: -250, z: -1200, description: "Cultivos contaminados", image: "gifs/cultivos.mp4",width: 85, height:90 },
  { id: "Consumo", x: 300, y: -300, z: -1400, description: "Consumo de alimentos contaminados", image: "imagenes/consumo.mp4" },
  { id: "Zonas_sin_drenaje", x: 150, y: -50, z: -600, description: "Zonas sin drenaje", image: "imagenes/sin_drenaje.mp4" },
  { id: "Fosas_negras", x: 250, y: -180, z: -800, description: "Fosas negras", image: "imagenes/fosas_negras.mp4" },
  { id: "Pozos", x: 950, y: -600, z: -1000, description: "Pozos de extracción de agua", image: "imagenes/pozos.mp4" },
  { id: "Criadero_mosquitos", x: -300, y: -200, z: -600, description: "Criadero de mosquitos", image: "imagenes/mosquitos.mp4" },
  { id: "Contacto_directo", x: -400, y: -300, z: -800, description: "Contacto directo", image: "imagenes/contacto.mp4" },
  { id: "Rios_lagos", x: -830, y: -200, z: -800, description: "Ríos, océanos y lagos" },
  { id: "Agua_riego", x: 0, y: -400, z: -1000, description: "Agua de riego para cultivos", image: "imagenes/riego.mp4" },
  { id: "Tracto_intestinal_animal", x: -300, y: -40, z: -100, description: "tracto animal", image: "imagenes/riego.mp4" },
  { id: "Zonas_de_pastoreo", x: 100, y: -270, z: -120, description: "heces infectadas en zonas de pastoreo", image: "imagenes/riego.mp4" },
  { id: "Agua_residual_sin_tratamiento", x: 900, y: 400, z: -240, description: "Agua residual sin tratamiento", image: "imagenes/riego.mp4" },
  { id: "Agua_residual_con_tratamiento_incorrecto", x: 310, y: -57, z: -290, description: "Agua residual con tratamiento incorrecto", image: "imagenes/riego.mp4" },
  { id: "Contagio", x: 930, y: -88, z: -760, description: "contagio", image: "imagenes/riego.mp4" },
  { id: "Suelo", x: 830, y: -880, z: -360, description: "contagio", image: "imagenes/riego.mp4" },
  { id: "cuerpo_agua", x: 230, y: -290, z: -60, description: "cuerpos de agua contaminada", image: "imagenes/riego.mp4" },
  { id: "Mariscos", x: -230, y: -580, z: -180, description: "marisco contaminado", image: "gifs/pescado.mp4", width: 90, height: 90 },
 

  
  

];

const connections = [

  //ruta de salmonella//
  ["Salmonella", "Tracto_intestinal_humano"],

  ["Tracto_intestinal_humano", "Heces_infectadas"],
  ["Heces_infectadas", "Drenaje"],
  ["Heces_infectadas", "Zonas_sin_drenaje"],
  ["Drenaje", "Agua_residual_sin_tratamiento"],
  ["Agua_residual_sin_tratamiento", "Rios_lagos"],
  ["Rios_lagos", "Contacto_directo"],
  ["Contacto_directo", "Contagio"],
  ["Contagio", "Tracto_intestinal_humano"],

  ["Drenaje", "Agua_residual_con_tratamiento_incorrecto"],
  ["Agua_residual_con_tratamiento_incorrecto","Agua_riego"],
  ["Agua_riego", "Cultivos_contaminados"],
  ["Cultivos_contaminados", "Consumo"],
  ["Consumo", "Contagio"],

  ["Zonas_sin_drenaje", "Agua_estancada"],
  ["Agua_estancada", "Filtracion_subsuelo"],
  ["Filtracion_subsuelo", "Acuiferos"],
  ["Acuiferos", "Suministro"],
  ["Suministro", "Ingesta"],
  ["Ingesta", "Contagio"],

  ["Filtracion_subsuelo", "Pozos"],
  ["Pozos", "Ingesta"],

  ["Zonas_sin_drenaje", "Fosas_negras"],
  ["Fosas_negras", "Filtracion_subsuelo"],
  ["Filtracion_subsuelo", "Acuiferos"],
  ["Acuiferos", "Suministro"],
  ["Suministro", "Ingesta"],

  ["Salmonella", "Tracto_intestinal_animal"],
  ["Tracto_intestinal_animal", "Zonas_de_pastoreo"],
  ["Zonas_de_pastoreo", "Agua_riego"],
  

//ruta salmonella enterica//
["Salmonella_enterica", "Tracto_intestinal_humano"],

["Tracto_intestinal_humano", "Heces_infectadas"],
["Heces_infectadas", "Drenaje"],
["Heces_infectadas", "Zonas_sin_drenaje"],
["Drenaje", "Agua_residual_sin_tratamiento"],
["Agua_residual_sin_tratamiento", "Rios_lagos"],
["Rios_lagos", "Contacto_directo"],
["Contacto_directo", "Contagio"],
["Contagio", "Tracto_intestinal_humano"],

["Drenaje", "Agua_residual_con_tratamiento_incorrecto"],
["Agua_residual_con_tratamiento_incorrecto","Agua_riego"],
["Agua_riego", "Cultivos_contaminados"],
["Cultivos_contaminados", "Consumo"],
["Consumo", "Contagio"],

["Zonas_sin_drenaje", "Agua_estancada"],
["Agua_estancada", "Filtracion_subsuelo"],
["Filtracion_subsuelo", "Acuiferos"],
["Acuiferos", "Suministro"],
["Suministro", "Ingesta"],
["Ingesta", "Contagio"],

["Filtracion_subsuelo", "Pozos"],
["Pozos", "Ingesta"],

["Zonas_sin_drenaje", "Fosas_negras"],
["Fosas_negras", "Filtracion_subsuelo"],
["Filtracion_subsuelo", "Acuiferos"],
["Acuiferos", "Suministro"],
["Suministro", "Ingesta"],

["Salmonella_enterica", "Tracto_intestinal_animal"],
["Tracto_intestinal_animal", "Zonas_de_pastoreo"],
["Zonas_de_pastoreo", "Agua_riego"],
  
 //ruta shigella// 

 ["Shigella", "Tracto_intestinal_humano"],

["Tracto_intestinal_humano", "Heces_infectadas"],
["Heces_infectadas", "Drenaje"],
["Heces_infectadas", "Zonas_sin_drenaje"],
["Drenaje", "Agua_residual_sin_tratamiento"],
["Agua_residual_sin_tratamiento", "Rios_lagos"],
["Rios_lagos", "Contacto_directo"],
["Contacto_directo", "Contagio"],
["Contagio", "Tracto_intestinal_humano"],

["Drenaje", "Agua_residual_con_tratamiento_incorrecto"],
["Agua_residual_con_tratamiento_incorrecto","Agua_riego"],
["Agua_riego", "Cultivos_contaminados"],
["Cultivos_contaminados", "Consumo"],
["Consumo", "Contagio"],

["Zonas_sin_drenaje", "Agua_estancada"],
["Agua_estancada", "Filtracion_subsuelo"],
["Filtracion_subsuelo", "Acuiferos"],
["Acuiferos", "Suministro"],
["Suministro", "Ingesta"],
["Ingesta", "Contagio"],

["Filtracion_subsuelo", "Pozos"],
["Pozos", "Ingesta"],

["Zonas_sin_drenaje", "Fosas_negras"],
["Fosas_negras", "Filtracion_subsuelo"],
["Filtracion_subsuelo", "Acuiferos"],
["Acuiferos", "Suministro"],
["Suministro", "Ingesta"],

//ruta giarda//

["Giardia", "Tracto_intestinal_humano"],

["Tracto_intestinal_humano", "Heces_infectadas"],
["Heces_infectadas", "Drenaje"],
["Heces_infectadas", "Zonas_sin_drenaje"],
["Drenaje", "Agua_residual_sin_tratamiento"],
["Agua_residual_sin_tratamiento", "Rios_lagos"],
["Rios_lagos", "Contacto_directo"],
["Contacto_directo", "Contagio"],
["Contagio", "Tracto_intestinal_humano"],

["Drenaje", "Agua_residual_con_tratamiento_incorrecto"],
["Agua_residual_con_tratamiento_incorrecto","Agua_riego"],
["Agua_riego", "Cultivos_contaminados"],
["Cultivos_contaminados", "Consumo"],
["Consumo", "Contagio"],

["Zonas_sin_drenaje", "Agua_estancada"],
["Agua_estancada", "Filtracion_subsuelo"],
["Filtracion_subsuelo", "Acuiferos"],
["Acuiferos", "Suministro"],
["Suministro", "Ingesta"],
["Ingesta", "Contagio"],

["Filtracion_subsuelo", "Pozos"],
["Pozos", "Ingesta"],

["Zonas_sin_drenaje", "Fosas_negras"],
["Fosas_negras", "Filtracion_subsuelo"],
["Filtracion_subsuelo", "Acuiferos"],
["Acuiferos", "Suministro"],
["Suministro", "Ingesta"],
 
//ruta bp//

["Burkholderia", "Suelo"],
["Suelo", "Drenaje"],
["Drenaje", "Agua_residual_con_tratamiento_incorrecto"],
["Agua_residual_con_tratamiento_incorrecto","Agua_riego"],
["Agua_riego", "Cultivos_contaminados"],
["Cultivos_contaminados", "Consumo"],
["Consumo", "Contagio"],

["Burkholderia", "Agua_estancada"],
["Agua_estancada", "Filtracion_subsuelo"],
["Agua_estancada", "Pozos"],

["Filtracion_subsuelo", "Acuiferos"],
["Acuiferos", "Suministro"],
["Suministro", "Agua_riego"],

["Agua_estancada","Criadero_mosquitos"],

//ruta Vibrio cholerae
["Vibrio_cholerae", "cuerpo_agua"],
["cuerpo_agua", "Filtracion_subsuelo"],
["cuerpo_agua", "Contacto_directo"],
["cuerpo_agua", "Mariscos"],
["Mariscos", "Consumo"],







  
  
  
  
];

nodesData.forEach(data => {
  const group = new THREE.Group();

  if (data.id === "Rios_lagos") {
    // VIDEO 1
    const video1 = document.createElement('video');
    video1.src = "gifs/mar.mp4";
    video1.loop = true;
    video1.muted = true;
    video1.playsInline = true;
    video1.autoplay = true;
    video1.style.display = "none";
    document.body.appendChild(video1);
    video1.play();
    const tex1 = new THREE.VideoTexture(video1);
    const mat1 = new THREE.MeshBasicMaterial({ map: tex1, transparent: true });
    const vid1 = new THREE.Mesh(new THREE.PlaneGeometry(70, 70), mat1);
    vid1.position.set(-30, 30, -1);
    group.add(vid1);
  
    // VIDEO 2
    const video2 = document.createElement('video');
    video2.src = "gifs/rio.mp4";
    video2.loop = true;
    video2.muted = true;
    video2.playsInline = true;
    video2.autoplay = true;
    video2.style.display = "none";
    document.body.appendChild(video2);
    video2.play();
    const tex2 = new THREE.VideoTexture(video2);
    const mat2 = new THREE.MeshBasicMaterial({ map: tex2, transparent: true });
    const vid2 = new THREE.Mesh(new THREE.PlaneGeometry(60, 50), mat2);
    vid2.position.set(40, 20, -1);
    group.add(vid2);
  
    // VIDEO 3
    const video3 = document.createElement('video');
    video3.src = "gifs/lago.mp4";
    video3.loop = true;
    video3.muted = true;
    video3.playsInline = true;
    video3.autoplay = true;
    video3.style.display = "none";
    document.body.appendChild(video3);
    video3.play();
    const tex3 = new THREE.VideoTexture(video3);
    const mat3 = new THREE.MeshBasicMaterial({ map: tex3, transparent: true });
    const vid3 = new THREE.Mesh(new THREE.PlaneGeometry(90, 70), mat3);
    vid3.position.set(-30, -47, -1);
    group.add(vid3);
  } else {
    // NODOS NORMALES CON UNA SOLA IMAGEN O VIDEO

    let texture;
    if (data.image.endsWith('.mp4')) {
      const video = document.createElement('video');
      video.src = data.image;
      video.loop = true;
      video.muted = true;
      video.playsInline = true;
      video.play();
      texture = new THREE.VideoTexture(video);
    } else {
      texture = new THREE.TextureLoader().load(data.image);
    }

    const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
    const width = data.width || 70;
    const height = data.height || 70;
    const image = new THREE.Mesh(new THREE.PlaneGeometry(width, height), material);
    const offsetX = data.offsetX || 0;
    const offsetY = data.offsetY || 0;
    image.position.set(offsetX, offsetY, -1);
    
    group.add(image);
  }

  // CONTORNO (SE AÑADE SIEMPRE)
  const outlineGeometry = new THREE.PlaneGeometry(50, 50);
  const outlineEdges = new THREE.EdgesGeometry(outlineGeometry);
  const outlineMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 });
  const outline = new THREE.LineSegments(outlineEdges, outlineMaterial);
  group.add(outline);

  group.position.set(data.x, data.y, data.z);
  group.userData = { id: data.id, description: data.description };
  scene.add(group);
  nodes.push(group);
});


connections.forEach(([from, to]) => {
  const nodeA = nodes.find(n => n.userData.id === from);
  const nodeB = nodes.find(n => n.userData.id === to);
  if (nodeA && nodeB) {
    const points = [nodeA.position.clone(), nodeB.position.clone()];
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: 0x00ff00 }));
    scene.add(line);
    lines.push(line);
  }
});

window.addEventListener('click', onClick, false);
document.getElementById('regresar').addEventListener('click', resetView);

function onClick(event) {
  event.preventDefault();
  const mouse = new THREE.Vector2(
    (event.clientX / window.innerWidth) * 2 - 1,
    -(event.clientY / window.innerHeight) * 2 + 1
  );
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(nodes, true);

  if (intersects.length > 0) {
    const selected = intersects[0].object.parent;
    targetPosition = new THREE.Vector3(
      selected.position.x,
      selected.position.y,
      selected.position.z + 300
    );
    toggleInfo(selected.userData);
  }
}

function toggleInfo(data) {
  const info = document.getElementById('infoWindow');
  const title = document.getElementById('infoTitle');
  const description = document.getElementById('infoDescription');
  if (info.style.display === 'block' && title.textContent === data.id) {
    info.style.display = 'none';
  } else {
    title.textContent = data.id;
    description.textContent = data.description;
    info.style.display = 'block';
  }
}

function resetView() {
  camera.position.set(0, 0, 800);
  targetPosition = null;
  document.getElementById('infoWindow').style.display = 'none';
}

function animate() {
  requestAnimationFrame(animate);
  if (targetPosition) camera.position.lerp(targetPosition, moveSpeed);
  renderer.render(scene, camera);
}
animate();
