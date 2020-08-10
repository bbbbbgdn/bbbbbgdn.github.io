let capturer;
let btn;

function record() {
    capturer = new CCapture({
        format: "webm",
        framerate: 30,
        timeLimit: 7
    });
    capturer.start();
    btn.textContent = "stop recording";
    btn.onclick = e => {
        capturer.stop();
        capturer.save();
        capturer = null;
        btn.textContent = "start recording";
        btn.onclick = record;
    };
}
//capture



let sizeW = 0;
let sizeH = 100;
let power = 2;
let i = 0;
let t = 0;
let n = 1;
let img_i = 0;
let img;
let h_margin = 0;
let running = true;
let allimg = [];
let temp_img;







function preload() {
    img = loadImage('c001.jpg');
}

function gotFile(file) {
    // running = false;
    temp_img = createImg(file.data, '').hide();
    allimg.push(temp_img);
    img = allimg[allimg.length - 1];
    print('n = ' + allimg.length);
}

function get_size() {
    ratio = img.height / img.width;
    sizeW = width / 2;
    sizeH = sizeW * ratio;
}



function setup() {

    cnv = createCanvas(1080 / 2, 1920 / 2);
    cnv.drop(gotFile);
    // cnv.mouseClicked(download); // attach listener for
    get_size();
    // rectMode(CENTER);
    // imageMode(CENTER);
    // textFont(inconsolata);
    fill(0);
    textSize(20);


}

function draw() {

    push();

    if (frameCount % 60 == 0 && allimg.length > 0 && running) {
        // print(n);
        img = allimg[n % allimg.length];
        get_size();
        n++;
        // if (n > allimg.length-1) {
        //     n = 0
        // };
    }
    if (running && frameCount > 30) {
        power = 1 + abs(sin(frameCount / 60)); //animate power
    }

    rw = sizeW;
    rh = sizeH;
    translate(0, 0);
    background(255);

    for (m = 0; m < 2; m++) {
        //fractal layers
        push();
        for (i = 0; i < 7; i++) {

            //fractal blocks
            push();
            //y=1 (no cut) y=0 (cut)
            for (let y = 1; y <= pow(power, i); y++) {
                rotate(t);
                //rectangle
                image(img, 0, 0, rw, rh);
                translate(0, rh);
                // translate(rw, rh);
            }
            pop();

            //size down
            translate(rw * 1 + h_margin, 0);
            rh /= power;
            rw /= power;

        }
        pop();

        rw = sizeW;
        rh = sizeH;

        translate(0, rh);
    }

    pop();
    
}


function keyPressed() {
    if (key === 'p') {
        saveCanvas();
    }
}

function keyPressed() {
    if (key === 'u') {
        running = !running;
    }
}

function keyTyped() {
    if (key === 'r') {
        // img_i = (img_i+1) % 3;
        allimg = [];
        img = loadImage('c001.jpg');
    }
}
