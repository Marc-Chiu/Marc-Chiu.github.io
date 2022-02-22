(function() {
  "use strict";

  window.addEventListener("load", init);
  const dimesionEdge = 500;
  const mid = 250;

  /** creates the graph on the canvas and has the event listeners for all the buttons */
  function init() {
    createGraph();
    addScale(1);
    id("add").addEventListener("click", addition);
    id("sub").addEventListener("click", subtract);
    id("clear").addEventListener("click", clear);
    id("record").addEventListener("click", record);
  }

  /** draws all the lines on the graph */
  function createGraph() {
    let canvas = id("canvas");
    const ctx = canvas.getContext('2d');
    const increment = 25;
    for (let i = increment; i < dimesionEdge; i += increment) {
      if (i === mid) {
        ctx.strokeStyle = 'rgba(0, 0, 204, 1)';
        ctx.lineWidth = 2;
        ctx.beginPath();
      } else {
        ctx.strokeStyle = 'rgba(0, 0, 0, .5)';
        ctx.lineWidth = 1;
        ctx.beginPath();
      }
      ctx.moveTo(0, i);
      ctx.lineTo(dimesionEdge, i);
      ctx.moveTo(i, 0);
      ctx.lineTo(i, dimesionEdge);
      ctx.stroke();
    }
  }
  /** adds the numbers to the graph so you know the scale @param {int} scale scale choice */
  function addScale(scale) {
    const point1 =- 5
    const point2=5, point3=115, point4=268, point5=255, point6=130, point7=380, point8=370;
    let canvas = id("canvas");
    let ctx = canvas.getContext('2d');
    ctx.font = "16px Arial";
    ctx.fillStyle = 'blue';
    ctx.fillText("" + scale * point1, point3, point4);
    ctx.fillText("" + scale * point2, point5, point6);
    ctx.fillText("" + scale * point1, point5, point7);
    ctx.fillText("" + scale * point2, point8, point4);
  }

  /**
   * takes in a point and draws a connecting line from the origin
   * @param {int} x x value
   * @param {int} y y value
   * @param {string} color color of the line
   */
  function graphVector(x, y, color) {
    const scale = 25;
    const l1 = 0.95;
    const l2 = 0.05;
    x = x * scale;
    y = y * scale;
    let canvas = id('canvas');
    let ctx = canvas.getContext('2d');
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(mid, mid);
    ctx.lineTo(x + mid, mid - y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(mid + x, mid - y);
    ctx.lineTo(l1 * x + mid + l2 * y, mid - l1 * y + l2 * x);
    ctx.lineTo(l1 * x + mid - l2 * y, mid - l1 * y - l2 * x);
    ctx.lineTo(mid + x, mid - y);
    ctx.fill();
  }

  /**
   * takes the input field numbers and adds the two vectors together and draws all three vector
   * on the graph
  */
  function addition() {
    let xp1 = qs(".a.x").value;
    let yp1 = qs(".a.y").value;
    let xp2 = qs(".b.x").value;
    let yp2 = qs(".b.y").value;
    let newVectx = parseFloat(xp1) + parseFloat(xp2);
    let newVecty = parseFloat(yp1) + parseFloat(yp2);
    if (isNaN(newVectx) || isNaN(newVecty)) {
      id("answer").innerText = "Please enter points";
    } else {
      graphVector(parseFloat(xp1), parseFloat(yp1), 'rgb(200, 28, 32, 1)');
      graphVector(parseFloat(xp2), parseFloat(yp2), 'rgb(34, 165, 64, 1)');
      graphVector(newVectx, newVecty, 'rgb(0, 0, 0, 1)');
      id("answer").innerText =
      "The Vector (" + xp1 + ", " + yp1 + ") + " + "(" + xp2 + ", " + yp2 + ") = " +
      "(" + newVectx + ", " + newVecty + ")";
    }
  }

  /**
   * takes input field numbers and subtracts the two vectors and draws all three vectors on
   * the graph
   */
  function subtract() {
    let xp1 = qs(".a.x").value;
    let yp1 = qs(".a.y").value;
    let xp2 = qs(".b.x").value;
    let yp2 = qs(".b.y").value;
    let newVectx = parseFloat(xp1) - parseFloat(xp2);
    let newVecty = parseFloat(yp1) - parseFloat(yp2);
    if (isNaN(newVectx) || isNaN(newVecty)) {
      id("answer").innerText = "Please enter points";
    } else {
      graphVector(parseFloat(xp1), parseFloat(yp1), 'rgb(200, 28, 32, 1)');
      graphVector(parseFloat(xp2), parseFloat(yp2), 'rgb(34, 165, 64, 1)');
      graphVector(newVectx, newVecty, 'rgb(0, 0, 0, 1)');
      id("answer").innerText =
      "The Vector (" + xp1 + ", " + yp1 + ") - " + "(" + xp2 + ", " + yp2 + ") = " +
      "(" + newVectx + ", " + newVecty + ")";
    }
  }

  /** earases the canvas and redraws default graph */
  function clear() {
    id("answer").innerText = "";
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    createGraph();
    addScale(1);
  }

  /** appends the solution to the unorder list */
  function record() {
    let answer = id("answer").textContent;
    if (answer !== "Please enter points") {
      let solution = document.createElement("li");
      solution.textContent = answer;
      solution.classList.add("result");
      solution.addEventListener("dblclick", function() {
        this.parentNode.removeChild(this);
      });
      qs("ul").appendChild(solution);
    }
  }

  /** helper func */
  function id(id) {
    return document.getElementById(id);
  }

  /** helper func */
  function qs(selector) {
    return document.querySelector(selector);
  }
})();
