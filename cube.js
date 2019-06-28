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

    let normals_vertices = [
        vec4( -0.5, -0.5,  0.5, 0.0 ),
        vec4( -0.5,  0.5,  0.5, 0.0 ),
        vec4(  0.5,  0.5,  0.5, 0.0 ),
        vec4(  0.5, -0.5,  0.5, 0.0 ),
        vec4( -0.5, -0.5, -0.5, 0.0 ),
        vec4( -0.5,  0.5, -0.5, 0.0 ),
        vec4(  0.5,  0.5, -0.5, 0.0 ),
        vec4(  0.5, -0.5, -0.5, 0.0 )
    ];

    let indices = [ a, b, c, a, c, d ];


    for ( let i = 0; i < indices.length; i++ )
    {
        mesh.normals.push( normals_vertices[indices[i]][0] );
        mesh.normals.push( normals_vertices[indices[i]][1] );
        mesh.normals.push( normals_vertices[indices[i]][2] );
        mesh.normals.push( normals_vertices[indices[i]][3] );


        mesh.points.push( vertices[indices[i]] );

    }
}

function cube()
{
    let cubeMesh = {points: [],
                    normals: [],
                    face_normals: []
                    };

    quad( 1, 0, 3, 2, cubeMesh);
    quad( 2, 3, 7, 6, cubeMesh);
    quad( 3, 0, 4, 7, cubeMesh);
    quad( 6, 5, 1, 2, cubeMesh);
    quad( 4, 5, 6, 7, cubeMesh);
    quad( 5, 4, 0, 1, cubeMesh);

    for (let i = 0; i < cubeMesh.points.length -2; i += 3) {
        cubeMesh.face_normals.push(newell(cubeMesh.points[i], cubeMesh.points[i+1], cubeMesh.points[i+2]));

    }
    return cubeMesh;
}