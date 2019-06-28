function quad(a, b, c, d, mesh)
{
    let vertices = [
        vec4( -0.5, -0.5,  0.5, 1.0 ),
        vec4( -0.5,  0.5,  0.5, 1.0 ),
        vec4(  0.5,  0.5,  0.5, 1.0 ),
        vec4(  0.5, -0.5,  0.5, 1.0 ),
        vec4( -0.5, -0.5, -0.5, 1.0 ),
        vec4( -0.5,  0.5, -0.5, 1.0 ),
        vec4(  0.5,  0.5, -0.5, 1.0 ),
        vec4(  0.5, -0.5, -0.5, 1.0 )
    ];

    let indices = [ a, b, c, a, c, d ];

    let counter = 0;

    for ( let i = 0; i < indices.length; ++i )
    {
        mesh.points.push( vertices[indices[i]] );
        counter = counter + 1;
        if(counter === 3) {
            counter = 0;
            let a = mesh.points[i];
            let b = mesh.points[i-1];
            let c = mesh.points[i-2];

            mesh.normals.push(a[0],a[1], a[2], 0.0);
            mesh.normals.push(b[0],b[1], b[2], 0.0);
            mesh.normals.push(c[0],c[1], c[2], 0.0);
        }
    }
}

function cube()
{
    let cubeMesh = {points: [], normals: []};

    quad( 1, 0, 3, 2, cubeMesh);
    quad( 2, 3, 7, 6, cubeMesh);
    quad( 3, 0, 4, 7, cubeMesh);
    quad( 6, 5, 1, 2, cubeMesh);
    quad( 4, 5, 6, 7, cubeMesh);
    quad( 5, 4, 0, 1, cubeMesh);

    return cubeMesh;
}