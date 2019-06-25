var points;
var colors;

var NumVertices  = 36;

var gl;

var fovy = 45.0;  // Field-of-view in Y direction angle (in degrees)
var aspect;       // Viewport aspect ratio
var program;

var mvMatrix, pMatrix;
var modelView, projection;

let initModelMatrix;


let transformStack = [];

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
    gl.viewport( 0, 0, canvas.width, canvas.height);

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
    // meshes to render
    let redCube = cube();
    let blueCube = cube();
    let magentaCube = cube();
    let cube4 = cube();

    let tetra1 = tetrahedron(1);
    let tetra2 = tetrahedron(2);
    let tetra3 = tetrahedron(5);

    // set up projection
    pMatrix = perspective(fovy, aspect, .1, 100);
    gl.uniformMatrix4fv( projection, false, flatten(pMatrix) );

    // eye coordinates
    let eye;
    let at = vec3(0.0,0.0, 0.0);
    let up = vec3(0.0, 1.0, 0.0);
    eye = vec3(0.0, 0.0, 15.0);
    mvMatrix = lookAt(eye, at , up);

    // mesh transform matrices
    let tetra1InitTransformM =translate(0.0, 0.0, 0.0);
    let tetra2InitTransformM =translate(0.0, 0.0, 0.0);
    let tetra3InitTransformM =translate(0.0, 0.0, 0.0);

    let cube11InitTransformM =translate(0.0, 0.0, 0.0);
    let cube12InitTransformM =translate(0.0, 0.0, 0.0);
    let cube21InitTransformM =rotateY(0);
    let cube22InitTransformM =translate(0.0, 0.0, 0.0);

    // hierarchy transform matrices
    let hie1TransM = mult(translate(0.0, 3.0, 0.0), rotateY(0));

        let hie11TransM= mult(translate(-2.0, -2.0, 0.0), rotateY(0));

            let hie111TransM= mult(translate(-1.0, -3.0, 0.0), rotateY(0));
            let hie112TransM= mult(translate(1.0, -3.0, 0.0), rotateY(0));

        let hie12TransM= mult(translate(2.0, -2.0, 0.0), rotateY(0));

            let hie121TransM= mult(translate(-1.0, -3.0, 0.0), rotateY(0));
            let hie122TransM= mult(translate(1.0, -3.0, 0.0), rotateY(0));

    //Hierarchy modeling
    transformStack.push(mvMatrix); // matrix 0 saved
        mvMatrix = mult(mvMatrix, hie1TransM);  // matrix 1  created

        // first hierarchy
        transformStack.push(mvMatrix); // matrix 1 saved
            mvMatrix = mult(mvMatrix, tetra1InitTransformM);
            gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix) );
            draw(tetra1, vec4(1.0, 1.0, 1.0, 1.0));
        mvMatrix = transformStack.pop(); // matrix 1 retrieved

        transformStack.push(mvMatrix); // matrix 1 saved
            mvMatrix = mult(mvMatrix, hie11TransM);

            transformStack.push(mvMatrix); //matrix 11 saved
                mvMatrix = mult(mvMatrix, tetra2InitTransformM);
                gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix) );
                draw(tetra2, vec4(.5, 1.0, 0.0, 1.0));
            mvMatrix = transformStack.pop(); // matrix 11 retrieved

                transformStack.push(mvMatrix); // matrix 11 saved
                    mvMatrix = mult(mvMatrix, hie111TransM);

                    transformStack.push(mvMatrix); // matrix 111 saved

                        mvMatrix = mult(mvMatrix, cube11InitTransformM);
                        gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix) );
                        draw(redCube, vec4(1.0, 0.0, 0.0, 1.0));
                mvMatrix = transformStack.pop(); // matrix 111 retrieved

            mvMatrix = transformStack.pop(); // matrix 11 retrieved

                transformStack.push(mvMatrix); // matrix 11 saved
                    mvMatrix = mult(mvMatrix, hie112TransM);

                    transformStack.push(mvMatrix); // matrix 112 saved

                        mvMatrix = mult(mvMatrix, cube12InitTransformM);
                        gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix) );
                        draw(magentaCube, vec4(1.0, 0.0, 1.0, 1.0));
                mvMatrix = transformStack.pop(); // matrix 113 retrieved

            mvMatrix = transformStack.pop(); // matrix 11 retrieved
        mvMatrix = transformStack.pop(); // matrix 1 retrieved

        transformStack.push(mvMatrix); // matrix 1 saved
            mvMatrix = mult(mvMatrix, hie12TransM);

            transformStack.push(mvMatrix); //matrix 12 saved
                mvMatrix = mult(mvMatrix, tetra3InitTransformM);
                gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix) );
                draw(tetra3, vec4(0.3, 0.4, 1.0, 1.0));
            mvMatrix = transformStack.pop(); // matrix 12 retrieved

            transformStack.push(mvMatrix); // matrix 12 saved
                mvMatrix = mult(mvMatrix, hie121TransM);

                transformStack.push(mvMatrix); // matrix 121 saved

                    mvMatrix = mult(mvMatrix, cube21InitTransformM);
                    gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix) );
                    draw(blueCube, vec4(0.0, 0.0, 1.0, 1.0));
                mvMatrix = transformStack.pop(); // matrix 121 retrieved

            mvMatrix = transformStack.pop(); // matrix 12 retrieved

            transformStack.push(mvMatrix); // matrix 12 saved
                mvMatrix = mult(mvMatrix, hie122TransM);

                transformStack.push(mvMatrix); // matrix 122 saved

                    mvMatrix = mult(mvMatrix, cube22InitTransformM);
                    gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix) );
                    draw(cube4, vec4(0.0, 1.0, 1.0, 1.0));
                mvMatrix = transformStack.pop(); // matrix 122 retrieved

            mvMatrix = transformStack.pop(); // matrix 12 retrieved
        mvMatrix = transformStack.pop(); // matrix 1 retrieved
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

