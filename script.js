import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.162.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.162.0/examples/jsm/controls/OrbitControls.js';



let scene, camera, renderer, controls;
let nodes = [];
let lines = [];
let targetPosition = null;
let moveSpeed = 0.08;
let cameraTarget = new THREE.Vector3(0, 0, 0);


let flickerFrameCounter = 0;
const flickerFrameDelay = 2; // animación de las lineas (flicker)

const initialCameraPosition = new THREE.Vector3(0, 0, 800);

scene = new THREE.Scene();
camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 5000);
camera.position.copy(initialCameraPosition);
renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const light = new THREE.PointLight(0x00ff00, 2, 1000);
light.position.set(0, 0, 400);
scene.add(light);

// OrbitControls
controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.rotateSpeed = 0.5;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.15;
controls.enablePan = false;

//num de los nodos
function crearNumeroSprite(numero) {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const context = canvas.getContext('2d');

  context.fillStyle = '#00ff00';
  context.font = 'bold 29px Arial';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(numero.toString(), canvas.width / 2, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(40, 40, 1); // Tamaño del número
  return sprite;
}


// Definición de nodos
const nodesData = [
  { id: "Salmonella", x: -360, y: 50, z: 400, description: "Salmonella es un género de bacterias que habitan en el tracto intestinal de humanos y animales. Se transmiten principalmente por vía fecal-oral, es decir, al consumir alimentos o agua contaminados con heces infectadas. La presencia de Salmonella en el agua potable es alarmante, ya que puede causar salmonelosis, una infección que provoca diarrea, fiebre y cólicos abdominales. En casos severos, puede llevar a deshidratación y requerir hospitalización.", image: "gifs/salmonella.mp4" },
  { id: "Salmonella_enterica", x: -100, y: 200, z: 400, description: "Salmonella enterica es una especie bacteriana del género Salmonella que habitan en el tracto intestinal de humanos y animales. La fiebre tifoidea, o fiebre entérica, es causada por esta bacteria. La fiebre tifoidea es endémica en México, sin tratamiento, la fiebre tifoidea puede durar un mes o más y volverse muy grave, incluso mortal. ", image: "gifs/salmonellaenterica.mp4" , offsetY: -10},
  { id: "Shigella", x: 140, y: 150, z: 350, description: "Shigella es una bacteria que se encuentra en el intestino humano y es muy contagiosa.  La infección por Shigella, conocida como shigelosis, puede causar diarrea severa, fiebre y dolor abdominal. En casos graves, puede llevar a deshidratación y disentería, un trastorno inflamatorio del intestino que produce diarrea grave que contiene moco o sangre en las heces. Si no se trata, la disentería puede resultar mortal.", image: "gifs/shigella.mp4" },
  { id: "Vibrio_cholerae", x: 380, y: 100, z: 400, description: "Vibrio cholerae es la bacteria responsable del cólera y se encuentra en ambientes acuáticos, como ríos y mares. El cólera es una enfermedad bacteriana que, por lo general, se propaga a través del agua contaminada. El cólera provoca diarrea intensa y deshidratación. Si no se trata, el cólera puede ser mortal en cuestión de horas, incluso en personas previamente sanas.", image: "gifs/vc.mp4" },
  { id: "Burkholderia_pseudomallei", x: 200, y: -150, z: 400, description: "Burkholderia pseudomallei es una bacteria presente en el suelo y el agua, responsable de la infección meliodosis. La melioidosis puede afectar múltiples órganos y manifestarse como neumonía, abscesos y sepsis. Es una enfermedad grave con una alta tasa de mortalidad si no se trata adecuadamente.", image: "gifs/bp.mp4" },
  { id: "Giardia", x: -270, y: -120, z: 400, description: "Giardia es un parásito de varios mamíferos, incluyendo el ser humano. Vive en el intestino delgado y provoca una infección denominada giardiosis, La infección por Giardia es una infección intestinal caracterizada por cólicos estomacales, hinchazón, náuseas y episodios de diarrea acuosa. ", image: "gifs/giardia.mp4" },
  
  // Nodos secundarios 
  { id: "Tracto_intestinal_humano", x: -200, y: 260, z: -100, description: "El patógeno se encuentra dentro del tracto intestinal de un humano.", image: "gifs/intestino.mp4",  width: 70, height: 100 },
  { id: "Heces_infectadas", x: 100, y: 600, z: -400, description: "Heces infectadas por el patógeno.", image: "gifs/heces.mp4", width: 110, height: 105, offsetX: -10, offsetY: 10 },
  { id: "Drenaje", x: 500, y: 130, z: -300, description: "Infraestructura que recolecta y evacúa aguas residuales de viviendas y edificios.", image: "gifs/drenaje.mp4", width: 57, height: 50 },
  { id: "Agua_estancada", x: -300, y: 100, z: -800, description: "Aguas superficiales que no circulan de ninguna forma que suponen las condiciones ideales para la formación de bacterias y gérmenes nocivos para la salud.", image: "gifs/estancada1.mp4", width: 120, height: 70, offsetX: 0, offsetY: 0 },
  { id: "Filtracion_subsuelo", x: 480, y: 200, z: -1000, description: "Filtración del patógeno al subsuelo.", image: "gifs/subsuelo1.mp4", width: 90, height: 90, offsetX: 3, offsetY: 10  },
  { id: "Acuiferos", x: 550, y: -600, z: -1200, description: "Sistema de acuíferos de la Ciudad de México, un conjunto de mantos acuíferos subterráneos que son la principal fuente de agua para la capital.", image: "gifs/acuiferos.mp4", width: 110, height: 110 },
  { id: "Suministro", x: 600, y: -250, z: -1400, description: "Inflitración del parásito en el suministro de agua de la Cuenca del Valle de México.", image: "gifs/suministro.mp4",  
  width: 190, height: 70, offsetX: 43, offsetY: -10, },
  { id: "Ingesta", x: 1000, y: -420, z: -1390, description: "Ingesta del agua contaminada.", image: "gifs/ingesta.mp4", width: 50, height: 50 },
  { id: "Cultivos_contaminados", x: -90, y: -130, z: -1100, description: "Cultivos contaminados por el patógeno.", image: "gifs/cultivos.mp4",width: 85, height:90 },
  { id: "Consumo", x: 300, y: 400, z: -1350, description: "Consumo de alimentos contaminados", image: "gifs/consumo.mp4", width: 80, height: 65, offsetX: 0, offsetY: 16  },
  { id: "Zonas_sin_drenaje", x: -150, y: 300, z: -600, description: "Estas zonas sin drenaje o con deficiencias en la infraestructura de drenaje suelen concentrarse en las alcaldías de Milpa Alta, Tláhuac, Xochimilco e Iztapalapa.", image: "gifs/sindrenaje.mp4" },
  { id: "Fosas_negras", x: 250, y: -100, z: -800, description: "Excavación en el terreno en forma de pozo, cubierto de paredes perforadas que recibe la descarga de las aguas negras.", image: "gifs/fosa.mp4" },
  { id: "Pozos", x: 980, y: -700, z: -1000, description: "Estructura o perforación diseñada para captar y extraer agua subterránea de un acuífero.", image: "gifs/pozo.mp4", width:70, height: 55 },
  { id: "Criadero_mosquitos", x: -350, y: -400, z: -600, description: "Las aguas residuales mal gestionadas crean charcos o cuerpos de agua estancados: canales, zanjas, ríos contaminados. Estas zonas se convierten en criaderos masivos de mosquitos. Enfermedades como dengue o zika no se transmiten por beber agua, pero sí por la picadura de mosquitos criados en zonas contaminadas.", image: "gifs/mosquito.mp4", offsetX: 10, offsetY: 20, width: 80, height: 75 },
  { id: "Contacto_directo", x: -400, y: -330, z: -820, description: "Contacto directo con el patógeno.", image: "gifs/contacto.mp4", width: 90, height: 70, offsetX: -10, offsetY: -10 },
  { id: "Rios_lagos", x: -830, y: -200, z: -800, description: "El agua residual sin tratamiento es canalizada hacia cuerpos de agua superficiales, como ríos, lagos y océanos." },
  { id: "Agua_riego", x: 0, y: -470, z: -1000, description: "Agua de riego para cultivos.", image: "gifs/riego.mp4", width: 80, height: 50 },
  { id: "Tracto_intestinal_animal", x: -300, y: -40, z: -100, description: "El patógeno se encuentra dentro del tracto intestinal de un animal.", image: "gifs/tractoanimal.mp4",  width: 90, height: 50 },
  { id: "Zonas_de_pastoreo", x: 100, y: -360, z: -120, description: "Heces infectadas en zonas donde los animales, especialmente el ganado, se alimentan de pasto u otro tipo de forraje.", image: "gifs/pastoreo.mp4", width: 70, height: 40 },
  { id: "Agua_residual_sin_tratamiento", x: 600, y: 400, z: -240, description: "Agua residual sin ningún proceso de saneamiento previo.", image: "gifs/sintratamiento.mp4", width: 100, height: 100 },
  { id: "Agua_residual_con_tratamiento_incorrecto", x: 470, y: -97, z: -290, description: "Agua residual que reciben tratamiento inadecuado.", image: "gifs/tratamiento.mp4", width: 100, height: 90  },
  { id: "Contagio", x: 930, y: -88, z: -790, description: "Contagio del patógeno.", image: "gifs/contagio.mp4", width: 50, height: 50 },
  { id: "Suelo", x: 830, y: -680, z: -360, description: "Suelo contaminado por el patógeno.", image: "gifs/suelo.mp4" },
  { id: "cuerpo_agua", x: 270, y: -390, z: -60, description: "Cuerpos de agua contaminada por el patógeno.", image: "gifs/cuerpoagua.mp4",  width: 100, height: 60 },
  { id: "Mariscos", x: -230, y: -580, z: -190, description: "Animales marinos contagiados que solemos consumir como mariscos.", image: "gifs/pescado.mp4", width: 90, height: 90 },
 

  
  

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

["Burkholderia_pseudomallei", "Suelo"],
["Suelo", "Drenaje"],
["Drenaje", "Agua_residual_con_tratamiento_incorrecto"],
["Agua_residual_con_tratamiento_incorrecto","Agua_riego"],
["Agua_riego", "Cultivos_contaminados"],
["Cultivos_contaminados", "Consumo"],
["Consumo", "Contagio"],

["Burkholderia_pseudomallei", "Agua_estancada"],
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
  const outlineMaterial = new THREE.LineBasicMaterial({
    color: 0x00ff00,
    transparent: true,
    opacity: 1
  });
  
  const outline = new THREE.LineSegments(outlineEdges, outlineMaterial);
  
  group.add(outline);

  group.position.set(data.x, data.y, data.z);
  group.userData = { id: data.id, description: data.description };
  scene.add(group);
  if (nodes.length < 6) {
    const numeroSprite = crearNumeroSprite(nodes.length + 1);
    numeroSprite.position.set(35, 35, 1); // arriba a la derecha del nodo
    group.add(numeroSprite);
  }
  
  nodes.push(group);
});


connections.forEach(([from, to]) => {
  const nodeA = nodes.find(n => n.userData.id === from);
  const nodeB = nodes.find(n => n.userData.id === to);
  if (nodeA && nodeB) {
    const points = [nodeA.position.clone(), nodeB.position.clone()];
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x00ff00,
      transparent: true,
      opacity: 1
    });
    
    const line = new THREE.Line(geometry, lineMaterial);
    line.userData = {
      from: from,
      to: to,
      active: false
    };
    
    scene.add(line);
    lines.push(line);
  }
});

window.addEventListener('click', onClick, false);
document.getElementById('regresar').addEventListener('click', resetView);

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

renderer.domElement.addEventListener('click', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(lines, false);
  
  if (intersects.length > 0) {
    const clickedLine = intersects[0].object;
    const targetNode = nodes.find(n => n.userData.id === clickedLine.userData.to);
    if (targetNode) {
      targetPosition = targetNode.position.clone().add(new THREE.Vector3(0, 0, 300));
      cameraTarget.copy(targetNode.position); // ESTA LÍNEA es la clave
    }
  }
});



let logoYaDissuelto = false;
function onClick(event) {
  // Dissolve al hacer clic en cualquier nodo
  const logo = document.getElementById('logo-completo');
  const dissolveFilter = document.getElementById('dissolve-filter');
  const disp = dissolveFilter.querySelector('feDisplacementMap');
  const bNoise = dissolveFilter.querySelector('feTurbulence[result="bigNoise"]');
 
  
  
  function disolverLogo(callback) {
    if (logoYaDissuelto) return;
    logoYaDissuelto = true;
  
    document.getElementById('texto').style.display = 'none';
  
    bNoise.setAttribute("seed", Math.floor(Math.random() * 1000));
    const duracion = 1200;
    const escalaMax = 2000;
    const ease = t => 1 - Math.pow(1 - t, 3);
    const start = performance.now();
  
    function frame(now) {
      const t = Math.min((now - start) / duracion, 1);
      const e = ease(t);
      disp.setAttribute("scale", e * escalaMax);
      logo.style.transform = `scale(${1 + 0.05 * e})`;
      logo.style.opacity = `${1 - e}`;
      if (t < 1) requestAnimationFrame(frame);
      else {
        logo.style.display = 'none';
        if (callback) callback();
      }
    }
  
    requestAnimationFrame(frame);
  }
  

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
      selected.position.z + 180
    );
    cameraTarget.copy(selected.position); // para que la cámara mire hacia el nodo
    
    toggleInfo(selected.userData);
    if (["Salmonella", "Salmonella_enterica", "Shigella", "Vibrio_cholerae", "Burkholderia_pseudomallei", "Giardia"].includes(selected.userData.id)) {
      iluminarRutaDesdeNodo(selected.userData.id);
    }
    
    disolverLogo();
    
  }
}

document.querySelectorAll('.dissolvable').forEach(el => {
  el.classList.add('dissolved');
});


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
  targetPosition = initialCameraPosition.clone(); 
  cameraTarget.set(0, 0, 0); // 👈 Vuelve a mirar al centro

  // Reactivar auto-rotación
  controls.autoRotate = true;

  // Ocultar ventana de información
  const infoWindow = document.getElementById('infoWindow');
  if (infoWindow) {
    infoWindow.style.display = 'none';
  }

  // Mostrar logo otra vez
  const logo = document.getElementById('logo-completo');
  logo.style.display = 'block';
  logo.style.opacity = '1';
  logo.style.transform = 'scale(1)';

  // Mostrar el texto otra vez
  const texto = document.getElementById('texto');
  if (texto) texto.style.display = 'block';

  // Resetear estado de disolución
  logoYaDissuelto = false;

  // Restaurar animación de disolución
  const dissolveFilter = document.getElementById('dissolve-filter');
  const disp = dissolveFilter.querySelector('feDisplacementMap');
  if (disp) disp.setAttribute("scale", 0);
}


function animate() {
  requestAnimationFrame(animate);

  flickerFrameCounter++;
  if (flickerFrameCounter >= flickerFrameDelay) {
    flickerFrameCounter = 0;

    lines.forEach(line => {
      if (line.userData.active) {
        // Si es parte de la ruta activa: sólido, sin flicker
        line.material.opacity = 1;
        line.material.color.set(0x00ff00);
      } else {
        // Si no es activa: parpadea
        const flicker = Math.random() < 0.3;
        line.material.opacity = flicker ? 1 : 0.1;
        line.material.color.set(0x00ff00);
      }
      line.material.needsUpdate = true;
    });
  }


  if (targetPosition) {
    camera.position.lerp(targetPosition, moveSpeed);
    controls.target.lerp(cameraTarget, moveSpeed); // NUEVO: mueve el foco de la cámara hacia el nodo
    controls.update();
  
    // Cuando llegue suficientemente cerca, detén el movimiento
    if (camera.position.distanceTo(targetPosition) < 1 && 
        controls.target.distanceTo(cameraTarget) < 1) {
      targetPosition = null;
    }
  } else {
    controls.update();
  }
  
  renderer.render(scene, camera);
  
}
function iluminarRutaDesdeNodo(nodoId) {
  lines.forEach(line => {
    lines.forEach(line => {
      if (line.userData.active) {
        // Ruta activa: línea sólida, sin flicker, verde brillante
        line.material.color.set(0x00ff00);
        line.material.opacity = 1;
      } else {
        // Flicker solo para las inactivas
        const flicker = Math.random() < 0.3;
        line.material.opacity = flicker ? 1 : 0.1;
        line.material.color.set(0x00ff00);
      }
      line.material.needsUpdate = true;
    });
    
    line.userData.active = false;
  });

  const visitados = new Set();
  const cola = [nodoId];

  while (cola.length > 0) {
    const actual = cola.shift();
    visitados.add(actual);

    connections.forEach(([from, to]) => {
      if (from === actual && !visitados.has(to)) {
        const linea = lines.find(l => l.userData.from === from && l.userData.to === to);
        if (linea) {
          linea.userData.active = true;
        }
        cola.push(to);
      }
    });
  }
}


animate();
