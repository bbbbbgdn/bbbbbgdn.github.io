let automatic = true;
let start = true;
let running = true; // pause boolean
let folder_list, folder_i;
let scrollAmount = 0;
let used_scroll = 0;
let Scroll_timer = 0;
let scroll_d = 0;
let images_buffer = [];
let img_i = 0; //index of spawned objects
let count = 0;
let particles = [];
let stop_timer = 1;
let reverse_scr = false;
let reverse_speed = 1;
let walkX = 0;
let targetX = 0;
let walkY = 0;
let targetY = 0;

function preload() {
    folder_list = loadStrings('samples.txt');
}

function setup() {
    let cnv = createCanvas(innerWidth, innerHeight);
    frameRate(60);
    //preload images from folder
    cnv.mouseOut(outpara);
    folder_count = folder_list.length;
    max_img = show_batch + buffer_batch; // max image in the screen + memory
    shuffle(folder_list, shuffle_order);
    imageMode(CENTER);

    //image thrower start point
    walkX = width / 2;
    walkY = height / 2;


    // tmp_img = loadImage('sample/giphy (8).gif');
    // images_buffer.push(tmp_img);
    for (folder_i = 0, i = 0; i < 1 && i < show_batch; i++) {
        console.log(i);
        try {
            tmp_img = null;
            tmp_img = loadImage('sample/' + folder_list[i]);
            if (tmp_img != null) {
                images_buffer.push(tmp_img);
            }
        } catch {
            console.error('no image sample/' + folder_list[i]);
        }
        folder_i++;
        //
        print('setup finished')
    }
}

// function touchStarted() {
//     automatic = true;
// }

// function touchEnded() {
//     automatic = false;
// }

function mousePressed() {
    // // pause function
    if(allow_pause){
    running = !running;
    if (!running) {
        print('pause');
    } else {
        print('run');
    }
}
}

function keyTyped() {
    if (key === '?') {
        debug = !debug;
    }
}


function mouseWheel(event) {
    if (start_batch!=0 && !automatic && event.deltaY!=0 && running) {
        if (event.deltaY > 0) {
            scrollAmount += event.deltaY;
            Scroll_timer += event.deltaY;
            // print('Scroll_timer = ' + Scroll_timer);
        }
        scroll_d = event.deltaY * 5;

        stop_timer = 1;

        if (event.deltaY < 0) {
            reverse_scr = true;
            reverse_speed += 0.2;
        } else {
            reverse_scr = false;
            reverse_speed = 1;
        }

    }
return false;
}



function outpara() {
    if(!automatic){
    stop_timer = 0;}
}



function draw() {


    if (!focused == stop_in_background || !running) {
        push();
        textSize(width/8);
        textAlign(CENTER, CENTER);
        text('PAUSE', width/2, height/2 ); 
        pop();
        return;
    }; // pause everything if no focused

    //checks if automatic start batch is over
    if (start && automatic && count <= start_batch || start_batch === 0) {} else {
        automatic = false;
        start = false;
    }

    background(bgR, bgG, bgB);


    //spawn on scroll
    if (!reverse_scr &&
        frameCount % interval == 0 &&
        stop_timer > 0 &&
        !automatic &&
        scrollAmount > used_scroll
        //spawn automatiaclly
        ||
        frameCount % interval == 0 &&
        stop_timer > 0 &&
        automatic
    ) {
        spawn_new();
        used_scroll = scrollAmount;
    }

    //update each position and redraw
    particles.forEach(
        Particle => {
            Particle.update();
            Particle.draw();
        }
    );

    //remove when finished (or failed to draw)
    particles.forEach((item, index, object) => {
        if (item.isFinished) {
            object.splice(index, 1);
            // print('removed finished or bad obj');
        }
    });


    if (!automatic && stop_timer > 0) {
        if (scroll_d != 0) {
            stop_timer -= 1 / abs(scroll_d) / 10;
        } else {
            stop_timer -= 0.01;
        }
    } else if (stop_timer < 0) {
        stop_timer = 0
    }

    //image thrower point movement
    if (frameCount % interval_walk == 0) {
        targetX = random(width);
        targetY = random(height);
        targetX = constrain(targetX, 0, width);
        targetY = constrain(targetY, 0, height);
    }
    walkX += (targetX - walkX) * easing;
    walkY += (targetY - walkY) * easing;

    fill(0, 255, 0);
    if (debug) {

        text('fps = ' + frameRate().toFixed(1) +
            '\nscroll timer = ' + Scroll_timer +
            '\nscroll deltaY = ' + scroll_d +
            '\nscroll stop timer = ' + stop_timer +
            '\nimg index = ' + img_i +
            '\nparticles on screen = ' + particles.length +
            '\nfolder index = ' + folder_i +
            '\ntotal count = ' + count, 10, 20);
    }


}


async function load_new() {

    if (folder_i >= folder_list.length) {
        folder_i = 0;
    }

    loadImage('sample/' + folder_list[folder_i], (img) => {
        images_buffer.push(img);
    }, (e) => {
        console.error(e);
    });
    folder_i++;
}

function spawn_new() {
    //spawn posiion
    let sp_X = walkX;
    let sp_Y = walkY;

    //remove oldest one from buffer if too much spawned
    if (images_buffer.length >= max_img && img_i > 0) {
        images_buffer.splice(0, 1);
        img_i--;
        // print('removed buffer maximg');
    }
    load_new(); //gets iage from folder to images_buffer

    //spawn new object
    if (particles.length < show_batch) {
        tmp_img = images_buffer[img_i];
        dx = random(minSpeed, maxSpeed) * random(-1, 1);
        dy = random(minSpeed, maxSpeed) * random(-1, 1);
        particles.push(new Particle(tmp_img, sp_X, sp_Y, dx, dy, random(min_scale_spd, max_scale_spd)));
        img_i++;
        count++;
    }
}

class Particle {
    constructor(image, x, y, dx, dy, scale_spd) {
        this.image = image;
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.scale = 0.001;
        this.scale_spd = scale_spd;
        this.isFinished = false;
    }

    checkIfFinished() {
        this.isFinished = this.isFinished ? true : sin(this.scale) <= 0 ||
            this.y >= height + this.height / 2 ||
            this.y <= 0 - this.height / 2 ||
            this.x <= width + this.width / 2 ||
            this.x <= 0 - this.width / 2;
    }

    draw() {
        if (this.isFinished) {
            return;
        }
        let death = sin(this.scale);
        try {

            image(this.image, this.x, this.y,
                this.image.width * death,
                this.image.height * death);
        } catch (err) {
            // this.isFinished = true;
            console.error('draw unsuccessful');
        }
        this.checkIfFinished();
    }

    update() {
        if (!reverse_scr) {
            this.scale += this.scale_spd * stop_timer;
            this.x += this.dx * stop_timer;
            this.y += this.dy * stop_timer;
        } else {
            this.scale -= this.scale_spd * stop_timer / reverse_speed
            this.scale = constrain(this.scale, 0.001, 10);
            this.x -= this.dx * stop_timer / reverse_speed;
            this.y -= this.dy * stop_timer / reverse_speed;
        }
    }
}