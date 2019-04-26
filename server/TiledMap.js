/**
 * @author   AdamInTheOculus
 * @date     April 26th 2019
 * @purpose  Contains all data and logic of TiledMap class.
**/

const fs = require('fs');

module.exports = class TiledMap {

    constructor(filename, layer) {

        // Try to load TiledMap data with filename.
        let data = fs.readFileSync('public/game/assets/maps/' + filename);
        if(data === undefined || data === null || data.length === 0) {
            throw new Error(`TiledMap -- constructor -- Failed to load file [${filename}].`);
        }

        // Convert data into JSON.
        let map = JSON.parse(data);
        
        // Find layer with static map information (currently: 'Collidable').
        let mapLayer = {};
        for(let i=0; i<map.layers.length; i++) {
            if(map.layers[i].name === layer) {
                mapLayer = map.layers[i];
                break;
            }
        }

        // Check if layer was correctly found.
        if(Object.keys(mapLayer).length === 0) {
            throw new Error(`TiledMap - constructor - Layer [${layer}] not found.`)
        }

        // Assign map details to 'this' object.
        this.name = mapLayer.name;
        this.encoding = (mapLayer.encoding === undefined) ? null : mapLayer.encoding;
        this.compression = (mapLayer.compression === undefined) ? null : mapLayer.compression;
    }
};