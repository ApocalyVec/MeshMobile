function triangle(a, b, c, mesh) {
    mesh.points.push(c);
    mesh.points.push(b);
    mesh.points.push(a);

    // normals are vectors

    mesh.normals.push(c[0],c[1], c[2], 0.0);
    mesh.normals.push(b[0],b[1], b[2], 0.0);
    mesh.normals.push(a[0],a[1], a[2], 0.0);

    mesh.face_normals.push(newell(c,b,a));

}

function divideTriangle(a, b, c, count, mesh) {
    if ( count > 0 ) {

        var ab = mix( a, b, 0.5);
        var ac = mix( a, c, 0.5);
        var bc = mix( b, c, 0.5);

        ab = normalize(ab, true);
        ac = normalize(ac, true);
        bc = normalize(bc, true);

        divideTriangle( a, ab, ac, count - 1, mesh);
        divideTriangle( ab, b, bc, count - 1, mesh);
        divideTriangle( bc, c, ac, count - 1, mesh);
        divideTriangle( ab, bc, ac, count - 1, mesh);
    }
    else {
        triangle( a, b, c, mesh);
    }
}


function tetrahedron(n) {
    let a = vec4(0.0, 0.0, -1.0,1);
    let b = vec4(0.0, 0.942809, 0.333333, 1);
    let c = vec4(-0.816497, -0.471405, 0.333333, 1);
    let d = vec4(0.816497, -0.471405, 0.333333,1);

    let tetraMesh = {points: [], normals: [], face_normals: []};

    divideTriangle(a, b, c, n, tetraMesh);
    divideTriangle(d, c, b, n, tetraMesh);
    divideTriangle(a, d, b, n, tetraMesh);
    divideTriangle(a, c, d, n, tetraMesh);

    return tetraMesh;
}