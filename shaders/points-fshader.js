// vim: set filetype=glsl:
const pointsShader = `#version 300 es
// Copyright 2017 Intel Corporation.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
//
precision highp float;

layout(location = 0) out vec4 outCrossProduct;
layout(location = 1) out vec4 outNormal;
layout(location = 2) out vec2 outDotAndError;
in vec2 aTexCoord;

// Two depth images from the camera.
uniform highp sampler2D sourceDepthTexture;
uniform highp sampler2D destDepthTexture;

uniform mat4 movement;
// Information from the depth camera on how to convert the values from the
// 'depthTexture' into meters.

${PROJECT_DEPROJECT_SHADER_FUNCTIONS}

vec3 estimateNormal(sampler2D tex, vec2 imageCoord) {
    vec3 position = deproject(tex, imageCoord);

    ivec2 texSize = textureSize(tex, 0);
    vec2 texStep = vec2(1.0/float(texSize.x), 1.0/float(texSize.y));
    // TODO remove this
    if (imageCoord.x + texStep.x >= 1.0 ||
        imageCoord.y + texStep.y >= 1.0)
            return vec3(0.0, 0.0, 0.0);

    vec3 positionRight = deproject(tex, imageCoord + vec2(texStep.x, 0.0));
    vec3 positionTop   = deproject(tex, imageCoord + vec2(0.0, texStep.y));
    // TODO remove this
    if (positionTop == vec3(0.0, 0.0, 0.0) || positionRight == vec3(0.0, 0.0, 0.0)) {
        return vec3(0.0, 0.0, 0.0);
    }

    vec3 normal = cross(positionTop - position, positionRight - position);
    return normalize(normal);
}


void main() {
    vec4 zero = vec4(0.0, 0.0, 0.0, 0.0);
    outCrossProduct = zero;
    outNormal = zero;
    outDotAndError = vec2(0.0, 0.0);

    // TODO most of these if conditions could be removed or replaced by somthing
    // that doesn't use branching, but this should be done only after I test
    // that it works properly.
    //vec2 imageCoord = aTexCoord - 0.5;
    //vec3 sourcePosition = deproject(sourceDepthTexture, imageCoord);
    //float depth = texture(destDepthTexture, vec2(0.5, 0.5)).r;
    if (aTexCoord.x < 0.5) {
        outCrossProduct = vec4(0.5, 0.5, 0.5, 0.5);
    }
    //if (sourcePosition.z != 0.0) {
        //vec3 sourceNormal = estimateNormal(sourceDepthTexture, imageCoord);
        //if (sourceNormal != vec3(0.0, 0.0, 0.0)) {

            //sourcePosition = (movement * vec4(sourcePosition, 1.0)).xyz;
            //sourceNormal = mat3(movement) * sourceNormal;

            //vec2 destImageCoord = project(sourcePosition);
            //vec3 destPosition = deproject(destDepthTexture, destImageCoord);
            //if (destPosition.z != 0.0) {
                //vec3 destNormal = estimateNormal(destDepthTexture, destImageCoord);
                //if (destNormal != vec3(0.0, 0.0, 0.0)) {

                    //if (distance(sourcePosition, destPosition) < 0.2
                            //&& dot(sourceNormal, destNormal) > 0.9) {

                        //outCrossProduct = vec4(cross(sourcePosition, sourceNormal), 1.0);
                        //outNormal = vec4(sourceNormal, 1.0);
                        //float dotProduct = dot(sourcePosition - destPosition, sourceNormal);
                        //float error = pow(dotProduct, 2.0);
                        //outDotAndError = vec2(dotProduct, error);
                    //}
                //}
            //}
        //}
    //}
}
`;
