'use strict';

let myData = {
  username: null,
  socketId: null,
  roomId: null,
};

(function () {
  let username;

  while (!username) {
    username = prompt("Enter your name: ");
  }

  // change title
  document.title = `Your Name: ${username}`;


  const roomId = document.getElementById('roomId').value;

  const socket = io();
  socket.on('connect', () => {
    myData = {
      username,
      roomId,
      socketId: socket.id,
    }

  })

  socket.emit('joinRoom', { username, roomId });

  socket.on('user-connected', function (data) {
    const usersUl = document.getElementById('users');
    const li = document.createElement('li');
    li.innerHTML = data.username
    li.id = data.socketId;
    const span = document.createElement('span');
    span.id = `status_${socket.id}`;
    li.appendChild(span);
    usersUl.appendChild(li);
  });

  socket.on('left', (socketId) => {
    const userLi = document.getElementById(socketId);
    console.log(userLi, socketId);
    if (userLi) {
      userLi.remove();
    }
  })

  const canvas = document.getElementsByClassName('whiteboard')[0];
  const colors = document.getElementsByClassName('color');
  const context = canvas.getContext('2d');


  const current = {
    color: 'red'
  };

  let drawing = false;



  canvas.addEventListener('mousedown', onMouseDown, false);
  canvas.addEventListener('mouseup', onMouseUp, false);
  canvas.addEventListener('mouseout', onMouseUp, false);
  canvas.addEventListener('mousemove', throttle(onMouseMove, 10), false);

  //Touch support for mobile devices
  canvas.addEventListener('touchstart', onMouseDown, false);
  canvas.addEventListener('touchend', onMouseUp, false);
  canvas.addEventListener('touchcancel', onMouseUp, false);
  canvas.addEventListener('touchmove', throttle(onMouseMove, 10), false);

  for (var i = 0; i < colors.length; i++) {
    colors[i].addEventListener('click', onColorUpdate, false);
  }

  socket.on('drawing', onDrawingEvent);

  window.addEventListener('resize', onResize, false);
  onResize();


  function drawLine(x0, y0, x1, y1, color, emit) {
    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);

    context.strokeStyle = color;
    context.lineWidth = 2;
    context.stroke();
    context.closePath();

    if (!emit) { return; }
    var w = canvas.width;
    var h = canvas.height;

    socket.emit('drawing', {
      x0: x0 / w,
      y0: y0 / h,
      x1: x1 / w,
      y1: y1 / h,
      color: color,
      roomId
    });
  }

  function onMouseDown(e) {
    drawing = true;
    current.x = e.clientX || e.touches[0].clientX;
    current.y = e.clientY || e.touches[0].clientY;
  }

  function onMouseUp(e) {
    if (!drawing) { return; }
    drawing = false;
    drawLine(current.x, current.y, e.clientX || e.touches[0].clientX, e.clientY || e.touches[0].clientY, current.color, true);
  }

  function onMouseMove(e) {
    if (!drawing) { return; }
    drawLine(current.x, current.y, e.clientX || e.touches[0].clientX, e.clientY || e.touches[0].clientY, current.color, true);
    current.x = e.clientX || e.touches[0].clientX;
    current.y = e.clientY || e.touches[0].clientY;
  }

  function onColorUpdate(e) {
    current.color = e.target.className.split(' ')[1];
  }

  // limit the number of events per second
  function throttle(callback, delay) {
    var previousCall = new Date().getTime();
    return function () {
      var time = new Date().getTime();

      if ((time - previousCall) >= delay) {
        previousCall = time;
        callback.apply(null, arguments);
      }
    };
  }

  function onDrawingEvent(data) {
    var w = canvas.width;
    var h = canvas.height;
    drawLine(data.x0 * w, data.y0 * h, data.x1 * w, data.y1 * h, data.color);
    updateUserStatus(data.socketId, data.color)
  }

  // make the canvas fill its parent
  function onResize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function updateUserStatus(socketId, color) {
    const usernameHtml = document.getElementById(socketId);
    const colorHtml = document.getElementsByClassName(color)[0]
    // get attribute hexcolor
    const hex = colorHtml.getAttribute('data-hexcolor');

    if (usernameHtml) {

      const status = usernameHtml.firstElementChild
      if (status) {
        status.innerHTML = `
          <i class="fas fa-circle" style="color: ${hex}"></i> drawing...
        `

        setTimeout(() => {
          status.innerHTML = ''
          status.style.backgroundColor = ''
        }, 1000)
      }
    }
  }




})()