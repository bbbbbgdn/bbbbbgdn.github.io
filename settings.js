
let start_batch = 0; // images to spawn at start on scroll after (if 0 spawn nonstop)

let shuffle_order = true; // shuffle images order
let allow_pause = true; //pauses on click
let stop_in_background = true; //pauses if window is in background

let interval = 5; // interval in frames between image spawn
let show_batch = 50; // max to be shown on the screen at once
let buffer_batch = 10; // images to download & store in buffer

let bgR = 100; // background color
let bgG = 100;
let bgB = 100;



let minSpeed = 3; // min move speed of paricles
let maxSpeed = 7; // min move speed of paricles

let min_scale_spd = 0.002; //  image arc scale speed
let max_scale_spd = 0.02;


let interval_walk = 180; // in frames
let easing = 0.005; // image thrower easing in frames


let debug = false; // show debug info