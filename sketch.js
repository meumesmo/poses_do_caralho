let img;
let poseNet;
let poses = [];


function setup() {
    // esses parametro aqui sao melhores na resolucao 360x540 ou 540x360 
    createCanvas(360, 540);
    
    img = createImg('data/foto_01.jpeg', imageReady);
    img.size(width, height);

    img.hide(); 
    frameRate(1); 
}

function imageReady(){
    let options = {
        imageScaleFactor: 1,
        minConfidence: 0.1 
    }
    
    poseNet = ml5.poseNet(modelReady, options);

    poseNet.on('pose', function (results) {
        poses = results;
    });

    console.log(poses);
}

function modelReady() {
    select('#status').html('Model Loaded');
    //mude esse aqui pra poseNet.singlePose(img) pra detectar uma pose só
    poseNet.multiPose(img)
}

// se vc quiser que desenhe 
function draw() {
    if (poses.length > 0) {
        image(img, 0, 0, width, height);
        drawSkeleton(poses);
        drawKeypoints(poses);
        noLoop(); 
    }
    console.log(poses);
}

function drawKeypoints() {
    for (let i = 0; i < poses.length; i++) {
        let pose = poses[i].pose;
        for (let j = 0; j < pose.keypoints.length; j++) {
            let keypoint = pose.keypoints[j];
            
            if (keypoint.score > 0.2) {
                fill(255);
                stroke(20);
                strokeWeight(4);
                ellipse(round(keypoint.position.x), round(keypoint.position.y), 8, 8);
            }
        }
    }
}

function drawSkeleton() {
    for (let i = 0; i < poses.length; i++) {
        let skeleton = poses[i].skeleton;
        for (let j = 0; j < skeleton.length; j++) {
            let partA = skeleton[j][0];
            let partB = skeleton[j][1];
            stroke(255);
            strokeWeight(1);
            line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
        }
    }
}