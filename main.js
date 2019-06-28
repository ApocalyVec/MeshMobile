// TODO flat lighting, spot light, different material
// TODO user inputs
// TODO Extra Credit

var NumVertices  = 36;

var gl;

var fovy = 45.0;  // Field-of-view in Y direction angle (in degrees)
var aspect;       // Viewport aspect ratio
var program;

var mvMatrix, pMatrix;
var modelView, projection;

let initModelMatrix;

let transformStack = [];

// light related globals
let lightPosition = vec4(10.0, 10.0, 10.0, 0.0 );  // position if the light source
var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );
var lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
var lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );

var materialAmbient = vec4( 1.0, 0.0, 1.0, 1.0 );
var materialDiffuse = vec4( 1.0, 0.8, 0.0, 1.0 );
var materialSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );
var materialShininess = 20.0;

let lightMode = 'flat';

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

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);

    projection = gl.getUniformLocation(program, "projectionMatrix");
    modelView = gl.getUniformLocation(program, "modelMatrix");

    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    let diffuseProduct = mult(lightDiffuse, materialDiffuse);
    let specularProduct = mult(lightSpecular, materialSpecular);
    let ambientProduct = mult(lightAmbient, materialAmbient);


    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"), flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"), flatten(diffuseProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"), flatten(specularProduct));

    gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"), flatten(lightPosition));
    gl.uniform1f(gl.getUniformLocation(program, "materialShininess"), materialShininess);

    window.addEventListener("keypress", function(e) {

        if (e.key === 'm') {
            lightMode = 'gourand';

            console.log('using Gouraud lighting ' + lightMode);
        }
        if (e.key === 'M') {
            lightMode = 'flat';

            console.log('using Flat lighting' + lightMode);
        }
    });

    render();
}

// animation related globals
let cube1RotAngle = 0;
let cube2RotAngle = 0;
let cube3RotAngle = 0;
let cube4RotAngle = 0;
let tetraRotAngle = 0;

let hie1RotAngle = 0;
let hie11RotAngle = 0;
let hie12RotAngle = 0;


function render()
{
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // meshes to render
    let redCube = cube();
    let blueCube = cube();
    let magentaCube = cube();
    let cube4 = cube();

    let tetra1 = tetrahedron(5);
    let tetra2 = tetrahedron(3);
    let tetra3 = tetrahedron(3);

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
    let tetra1InitTransformM =rotateY(tetraRotAngle);
    let tetra2InitTransformM =rotateY(tetraRotAngle);
    let tetra3InitTransformM =rotateY(tetraRotAngle);

    let cube11InitTransformM =rotateY(cube1RotAngle);
    let cube12InitTransformM =rotateY(cube2RotAngle);
    let cube21InitTransformM =rotateY(cube3RotAngle);
    let cube22InitTransformM =rotateY(cube4RotAngle);

    let hie1X = 0.0;
    let hie1Y = 4.0;

    let hie11X = 3.0;
    let hie11Y = -3.0;
    let hie12X = -2.3;

    let hie111Y = -4.0;
    let hie111X = -2.0;

    let hie121Y = -2.4;
    let hie122Y = -3.5;

    let hie1VerArm0 = [vec4(hie1X, 0.0, 0.0, 1.0), vec4(hie1X, hie1Y-5.2, 0.0, 1.0)];
    let hie1HorArm = [vec4(hie11X, hie1Y-5.2, 0.0, 1.0), vec4(hie12X, hie1Y-5.2, 0.0, 1.0)];
    let hie1VerArm1 = [vec4(hie11X, -3.0, 0.0, 1.0), vec4(hie11X, hie1Y-5.2, 0.0, 1.0)];
    let hie1VerArm2 = [vec4(hie12X, -3.0, 0.0, 1.0), vec4(hie12X, hie1Y-5.2, 0.0, 1.0)];

    let hie12HorArm0 = [vec4(-2, hie11Y + 1.8, 0.0, 1.0), vec4(1, hie11Y + 1.8, 0.0, 1.0)];
    let hie12VerArm0 = [vec4(0, hie11Y + 1.8, 0.0, 1.0), vec4(0, hie11Y+2.2, 0.0, 1.0)];
    let hie12VerArm1 = [vec4(-2, hie11Y + 1.8, 0.0, 1.0), vec4(-2, hie11Y + .8, 0.0, 1.0)];
    let hie12VerArm2 = [vec4(1, hie11Y + 1.8, 0.0, 1.0), vec4(1, hie11Y, 0.0, 1.0)];

    let hie11HorArm0 = [vec4(-2, hie11Y + 1.8, 0.0, 1.0), vec4(1, hie11Y + 1.8, 0.0, 1.0)];
    let hie11VerArm0 = [vec4(0, hie11Y + 1.8, 0.0, 1.0), vec4(0, hie11Y+2.2, 0.0, 1.0)];
    let hie11VerArm1 = [vec4(-2, hie11Y + 1.8, 0.0, 1.0), vec4(-2, hie11Y-1, 0.0, 1.0)];
    let hie11VerArm2 = [vec4(1, hie11Y + 1.8, 0.0, 1.0), vec4(1, hie11Y, 0.0, 1.0)];

    // animating
    hie1RotAngle = hie1RotAngle - 0.4;
    hie11RotAngle = hie11RotAngle + 0.2;
    hie12RotAngle = hie12RotAngle + 0.6;

    cube1RotAngle += 1.0;
    cube2RotAngle += 1.0;
    cube3RotAngle += 1.0;
    cube4RotAngle += 1.0;
    tetraRotAngle += 1.0;

    // hierarchy transform matrices
    let hie1TransM = mult(translate(hie1X, hie1Y, 0.0), rotateY(hie1RotAngle));

        let hie11TransM= mult(translate(hie11X, hie11Y, 0.0), rotateY(hie11RotAngle));

            let hie111TransM= mult(translate(hie111X, hie111Y, 0.0), rotateY(0));
            let hie112TransM= mult(translate(1.0, -3.0, 0.0), rotateY(0));

        let hie12TransM= mult(translate(hie12X, -4.0, 0.0), rotateY(hie12RotAngle));

            let hie121TransM= mult(translate(-2.0, hie121Y, 0.0), rotateY(0));
            let hie122TransM= mult(translate(1.0, hie122Y, 0.0), rotateY(0));

    //Hierarchy modeling
    transformStack.push(mvMatrix); // matrix 0 saved
        mvMatrix = mult(mvMatrix, hie1TransM);  // matrix 1  created
        gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix) );
        drawLine(hie1HorArm[0], hie1HorArm[1]);
        drawLine(hie1VerArm0[0], hie1VerArm0[1]);
        drawLine(hie1VerArm1[0], hie1VerArm1[1]);
        drawLine(hie1VerArm2[0], hie1VerArm2[1]);
        // first hierarchy
        transformStack.push(mvMatrix); // matrix 1 saved
            mvMatrix = mult(mvMatrix, tetra1InitTransformM);
            gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix) );
            draw(tetra1, vec4(1.0, 1.0, 1.0, 1.0));

    mvMatrix = transformStack.pop(); // matrix 1 retrieved

        transformStack.push(mvMatrix); // matrix 1 saved
            mvMatrix = mult(mvMatrix, hie11TransM);
            gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix) );
            drawLine(hie11HorArm0[0], hie11HorArm0[1]);
            drawLine(hie11VerArm0[0], hie11VerArm0[1]);
            drawLine(hie11VerArm1[0], hie11VerArm1[1]);
            drawLine(hie12VerArm2[0], hie11VerArm2[1]);

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
            gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix) );
            drawLine(hie12HorArm0[0], hie12HorArm0[1]);
            drawLine(hie12VerArm0[0], hie12VerArm0[1]);
            drawLine(hie12VerArm1[0], hie12VerArm1[1]);
            drawLine(hie12VerArm2[0], hie12VerArm2[1]);
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

    requestAnimationFrame(render);

}

function drawLine(start, end) {
    let points = [];
    points.push(start);
    points.push(end);

    let normals = [];
    normals.push(start[0], start[1], start[0], 0.0);
    normals.push(end[0], end[1], end[0], 0.0);

    let pBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, pBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);
    let vPosition = gl.getAttribLocation(program,  "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    // buffer normals
    let nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normals), gl.STATIC_DRAW );
    let vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal);

    gl.uniform1i(gl.getUniformLocation(program, "isMesh"), 0);
    gl.drawArrays( gl.LINES, 0, points.length );
}

function drawTriangle(p1, p2, p3) {
    let points = [];
    points.push(p1);
    points.push(p2);
    points.push(p3);

    let normals = [];
    normals.push(p1[0], p1[1], p1[0], 0.0);
    normals.push(p2[0], p2[1], p2[0], 0.0);
    normals.push(p3[0], p3[1], p3[0], 0.0);

    let pBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, pBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);
    let vPosition = gl.getAttribLocation(program,  "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    let nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normals), gl.STATIC_DRAW );
    let vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal);

    gl.uniform1i(gl.getUniformLocation(program, "isMesh"), 0);
    gl.drawArrays( gl.TRIANGLES, 0, points.length );
}

// mesh must be a
function draw(mesh, color) {
    /*
    * param: mesh: dictionary object with keys:
    *   points: array of points that make up the mesh
    *   normals: array of normals of the mesh
     */
    // let fragColors = [];
    //
    // for(let i = 0; i < mesh.points.length; i++)
    // {
    //     fragColors.push(color);
    // }

    if (lightMode == 'flat') {
        mesh.normals = [];

        for(let i = 0; i < mesh.face_normals.length; i ++) {
            mesh.normals.push(mesh.face_normals[i]);
            mesh.normals.push(mesh.face_normals[i]);
            mesh.normals.push(mesh.face_normals[i]);
        }

        mesh.normals = mesh.normals.flat();

    }
    else if (lightMode == 'gourand') {
    }
    else{
        console.log('Invalid Lighting Mode');
    }

    // buffer vertices
    let pBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, pBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(mesh.points), gl.STATIC_DRAW);
    let vPosition = gl.getAttribLocation(program,  "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    // buffer normals
    let nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(mesh.normals), gl.STATIC_DRAW );
    let vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal);

    //buffer colors
    // let cBuffer = gl.createBuffer();
    // gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    // gl.bufferData(gl.ARRAY_BUFFER, flatten(fragColors), gl.STATIC_DRAW);
    // let vColor= gl.getAttribLocation(program,  "vColor");
    // gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    // gl.enableVertexAttribArray(vColor);



    gl.uniform1i(gl.getUniformLocation(program, "isMesh"), 1);

    gl.drawArrays( gl.TRIANGLES, 0, mesh.points.length );
}

function newell(v1, v2, v3) {
    /*
    * finds the surface normal for v1, v2, and v3
    * return the surface normal as a unit vector
    * */

    let n1, n2, n3; //

    n1 = (v1[1] - v2[1]) * (v1[2] + v2[2]) +
        (v2[1] - v3[1]) * (v2[2] + v3[2]) +
        (v3[1] - v1[1]) * (v3[2] + v1[2]);

    n2 = (v1[2] - v2[2]) * (v1[0] + v2[0]) +
        (v2[2] - v3[2]) * (v2[0] + v3[0]) +
        (v3[2] - v1[2]) * (v3[0] + v1[0]);

    n3 = (v1[0] - v2[0]) * (v1[1] + v2[1]) +
        (v2[0] - v3[0]) * (v2[1] + v3[1]) +
        (v3[0] - v1[0]) * (v3[1] + v1[1]);

    let normal = normalize(vec3(n1,n2,n3), false);
    return vec4(normal[0], normal[1], normal[2], 0.0);
}