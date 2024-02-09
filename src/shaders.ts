export const raytracerVertex = `#version 300 es
    uniform vec2 size;
    in vec4 position;
    out vec2 sensorPosition;
    void main() {
        float aspectRatio = size.x / size.y;
        sensorPosition = 0.5 * vec2(position.x * aspectRatio, position.y);
        gl_Position = position;
    }`;

export const raytracerFragment = `#version 300 es
    precision highp float;
    uniform vec3 cameraPosition;
    uniform mat3 cameraView;
    uniform sampler2D scene;
    uniform int triangleCount;
    in vec2 sensorPosition;
    out vec4 color;
    void main() {
        vec3 direction = normalize(cameraView * vec3(sensorPosition, 1.0));

        float abc = -1.0;
        float qbc = -1.0;
        float aqc = -1.0;
        float abq = -1.0;
        float dist;
        vec3 normal;
        bool hit = false;

        for(int i = 0; i < triangleCount; i++) {
            vec3 a = texelFetch(scene, ivec2(0, i), 0).xyz;
            vec3 b = texelFetch(scene, ivec2(1, i), 0).xyz;
            vec3 c = texelFetch(scene, ivec2(2, i), 0).xyz;
        
            vec3 next_normal = normalize(cross(b - a, c - a));
    
            float p_dist = -dot(next_normal, cameraPosition - a);
            float slope = dot(next_normal, direction);
    
            float next_dist = p_dist / slope;
            vec3 q = cameraPosition + direction * next_dist;
        
            float next_abc = dot(cross(b - a, c - a), next_normal);
            float next_qbc = dot(cross(c - b, q - b), next_normal);
            float next_aqc = dot(cross(a - c, q - c), next_normal);
            float next_abq = dot(cross(b - a, q - a), next_normal);

            if(next_dist > 0.0 && next_qbc > 0.0 && next_aqc > 0.0 && next_abq > 0.0) {
                if(!hit || next_dist < dist) {
                    hit = true;
                    abc = next_abc;
                    qbc = next_qbc;
                    aqc = next_aqc;
                    abq = next_abq;
                    normal = next_normal;
                    dist = next_dist;
                }
            }
        }

        if(hit) {
            float alpha = qbc / abc;
            float beta = aqc / abc;
            float gamma = abq / abc;
    
            color = vec4(abs(normal), 1.0);
        } else {
            color = vec4(0.0, 0.0, 0.0, 1.0);
        }
    }`;