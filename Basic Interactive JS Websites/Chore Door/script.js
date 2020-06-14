let currentPlaying = true

let doorImage1 = document.getElementById('door1')
let doorImage2 = document.getElementById('door2')
let doorImage3 = document.getElementById('door3')

let startButton = document.getElementById('start')

let botDoorPath = './img/robot.svg'
let beachDoorPath = "./img/beach.svg"
let spaceDoorPath = "./img/space.svg"
let closedDoorPath = "./img/closed_door.svg"

let numClosedDoors=3

let openDoor1, openDoor2, openDoor3

const fileName = (filePath) => {
    let fileArray = filePath.split('/')
    return './img/' + fileArray[fileArray.length-1]
}

const randomChoreDoorGenerator = () => {
    let choreDoor = Math.floor(Math.random()*numClosedDoors)
    if(choreDoor === 0 ) {
        openDoor1 = botDoorPath
        openDoor2 = beachDoorPath
        openDoor3 = spaceDoorPath
    } else if(choreDoor === 1) {
        openDoor1 = spaceDoorPath
        openDoor2 = botDoorPath
        openDoor3 = beachDoorPath
    } else {
        openDoor1 = beachDoorPath
        openDoor2 = spaceDoorPath
        openDoor3 = botDoorPath
    }
}

const isClicked = (door) => {
    let src = fileName(door.src)
    if(src === closedDoorPath) return false
    else return true
}

const playDoor = (door) => {
    numClosedDoors--
    if(numClosedDoors === 0) {
        gameOver('win')
    } 
    else if (isBot(door)) 
        gameOver() 
}

const isBot = (door) => {
    let src = fileName(door.src)
    if(src === botDoorPath) return true
    else return false
}

const gameOver = (status) => {
    if(status === 'win') {
        startButton.innerHTML = 'You Win! Play Again?'
    }
    else{
        startButton.innerHTML = 'Game over! Play Again?'
    }
    currentPlaying = false
}

doorImage1.onclick = () => {
    if(currentPlaying && !isClicked(doorImage1)) {
        doorImage1.src=openDoor1
        playDoor(doorImage1)
    }
}

doorImage2.onclick = () => {
    if(currentPlaying && !isClicked(doorImage2)) {
        doorImage2.src=openDoor2 
        playDoor(doorImage2)
    }   
}

doorImage3.onclick = () => {
    if(currentPlaying && !isClicked(doorImage3)){
        doorImage3.src=openDoor3
        playDoor(doorImage3)
    }
}

const startRound = () => {
    doorImage1.src = closedDoorPath
    doorImage2.src = closedDoorPath
    doorImage3.src = closedDoorPath
    startButton.innerHTML = 'Good Luck!'
    currentPlaying = true
    numClosedDoors=3
    randomChoreDoorGenerator()
}

startButton.onclick = () => {
    startRound()
}

startRound()