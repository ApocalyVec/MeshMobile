var points;
var colors;

var NumVertices  = 36;

var gl;

var fovy = 45.0;  // Field-of-view in Y direction angle (in degrees)
var aspect;       // Viewport aspect ratio
var program;

var mvMatrix, pMatrix;
var modelView, projection;


let stack = [];

function main()
{
	// Retrieve <canvas> element
	var canvas = document.getElementById('webgl');

	// Get the rendering context for WebGL
    gl = WebGLUtils.setupWebGL(canvas);

	//Check that the return value is not null.
	if (!gl)
	{
		console.log('Failed to get the rendering context for WebGL');
		return;
	}

	// Initialize shaders
	program = initShaders(gl, "vshader", "fshader");
	gl.useProgram(program);

	//Set up the viewport
    gl.viewport( 0, 0, 400, 400);

    aspect =  canvas.width/canvas.height;
    // Set clear color
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Clear <canvas> by clearing the color buffer
    gl.enable(gl.DEPTH_TEST);

	points = [];
	colors = [];

    projection = gl.getUniformLocation(program, "projectionMatrix");
    modelView = gl.getUniformLocation(program, "modelMatrix");

    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    render();
}


function render()
{
    let redCube = cube();
    let blueCube = cube();
    let magentaCube = cube();

    let tetra1 = tetrahedron(1);
    let tetra2 = tetrahedron(3);
    let tetra3 = tetrahedron(5);


    pMatrix = perspective(fovy, aspect, .1, 10);
    gl.uniformMatrix4fv( projection, false, flatten(pMatrix) );

    let eye;
    let at = vec3(0.0,0.0, 0.0);
    let up = vec3(0.0, 1.0, 0.0);
    eye = vec3(0.0, 0.0, 8.0);
    mvMatrix = lookAt(eye, at , up);

    // let tetra3TransformM =translate()

    //Hierarchy modeling
    stack.push(mvMatrix); // matrix 0 saved
        mvMatrix = mult(rotateZ(45), mvMatrix);
        gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix) );
        draw(redCube, vec4(1.0, 0.0, 0.0, 1.0));

        stack.push(mvMatrix);  // matrix 1 saved
            mvMatrix = mult(translate(0,3.0,0.0), mvMatrix);
            gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix) );
            draw(magentaCube, vec4(1.0, 0.0, 1.0, 1.0));
        mvMatrix = stack.pop();  // matrix 1 popped
    mvMatrix = stack.pop();  // matrix 0 popped

    stack.push(mvMatrix);  // matrix 0 saved
        mvMatrix = mult(translate(-1,-1,0.0), mvMatrix);
        gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix) );
        draw(blueCube, vec4(0.0, 0.0, 1.0, 1.0));
    mvMatrix = stack.pop();  // matrix 0 popped

    gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix) );
    draw(tetra1, vec4(1.0, 1.0, 0.0, 1.0));

}

// mesh must be a
function draw(mesh, color) {
    /*
    * param: mesh: dictionary object with keys:
    *   points: array of points that make up the mesh
    *   normals: array of normals of the mesh
     */
    let fragColors = [];

    for(let i = 0; i < mesh.points.length; i++)
    {
        fragColors.push(color);
    }

    let pBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, pBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(mesh.points), gl.STATIC_DRAW);

    let vPosition = gl.getAttribLocation(program,  "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    let cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(fragColors), gl.STATIC_DRAW);

    let vColor= gl.getAttribLocation(program,  "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    gl.drawArrays( gl.TRIANGLES, 0, mesh.points.length );
}

