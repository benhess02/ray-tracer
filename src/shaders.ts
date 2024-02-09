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
    in vec2 sensorPosition;
    out vec4 color;
    void main() {
        vec3 direction = normalize(cameraView * vec3(sensorPosition, 1.0));

        vec3 a = vec3(0.0f, -0.5f, 1.0f);
        vec3 b = vec3(-0.5f, 0.4f, 1.0);
        vec3 c = vec3(0.8f, 0.5f, 1.0f);
    
        vec3 normal = normalize(cross(b - a, c - a));

        if(dot(normal, direction) > 0.0) {
            color = vec4(0.0, 0.0, 0.0, 1.0);
            return;
        }

        float p_dist = dot(normal, cameraPosition - a);
        float slope = -dot(normal, direction);
        float dist = p_dist / slope;
        vec3 q = cameraPosition + direction * dist;
    
        float abc = dot(cross(b - a, c - a), normal);
        
        float qbc = dot(cross(c - b, q - b), normal);
        float aqc = dot(cross(a - c, q - c), normal);
        float abq = dot(cross(b - a, q - a), normal);
        
        if(qbc > 0.0 && aqc > 0.0 && abq > 0.0) {
            float alpha = qbc / abc;
            float beta = aqc / abc;
            float gamma = abq / abc;
    
            color = vec4(alpha, beta, gamma, 1.0);
        } else {
            color = vec4(0.0, 0.0, 0.0, 1.0);
        }
    }`;