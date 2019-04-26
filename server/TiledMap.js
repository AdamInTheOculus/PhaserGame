/**
 * @author   AdamInTheOculus
 * @date     April 26th 2019
 * @purpose  Contains all data and logic of TiledMap class.
**/

const fs = require('fs');
const zlib = require('zlib');

module.exports = class TiledMap {

    constructor(filename, layer) {

        // ==============================================
        // == Try to load TiledMap data with filename. ==
        // ==============================================
        let data = fs.readFileSync('public/game/assets/maps/' + filename);
        if(data === undefined || data === null || data.length === 0) {
            throw new Error(`TiledMap -- constructor() -- Failed to load file [${filename}].`);
        }

        // =============================================
        // == Convert data into JSON and fetch layer. ==
        // =============================================
        this.data = JSON.parse(data);
        let mapLayer = this.getMapLayer(this.data, layer);

        // ==========================================
        // == Assign map details to 'this' object. ==
        // ==========================================
        this.name = mapLayer.name;
        this.encoding = (mapLayer.encoding === undefined) ? null : mapLayer.encoding;
        this.compression = (mapLayer.compression === undefined) ? null : mapLayer.compression;

        // ==========================================================
        // == Get individual tile data and store in 2D Uint8 array ==
        // ==========================================================
        this.worldData = this.getTiles(mapLayer);

        this.worldData.forEach(element => {
            process.stdout.write(element + ' ');
        });

        console.log('\nNo more world data!');
    }

    /**
     * @author   AdamInTheOculus
     * @date     April 26th 2019
     * @purpose  Helper function that finds specific layer from map data and returns it.
    **/
    getMapLayer(map, layer) {
        
        // =======================================================================
        // == Find layer with static map information (currently: 'Collidable'). ==
        // =======================================================================
        let mapLayer = {};
        for(let i=0; i<map.layers.length; i++) {
            if(map.layers[i].name === layer) {
                mapLayer = map.layers[i];
                break;
            }
        }

        // =========================================
        // == Check if layer was correctly found. ==
        // =========================================
        if(Object.keys(mapLayer).length === 0) {
            throw new Error(`TiledMap -- getMapLayer() -- Layer [${layer}] not found.`)
        }

        return mapLayer;
    }

    /**
     * @author   AdamInTheOculus
     * @date     April 26th 2019
     * @purpose  Returns a 2D Uint8 array representing the game world. Each ID represents a specific tile from Tiled.
    **/
    getTiles(layer) {

        let data = null;
        let rawData = layer.data;

        // ==================================
        // == If applicable, decode Base64 ==
        // ==================================
        if(layer.encoding === 'base64') {
            console.log('Decoding data!');
            data = Buffer.from(rawData, 'base64');
        }

        // ============================================
        // == If applicable, extract compressed data ==
        // ============================================
        if(layer.compression === 'gzip') {
            console.log('Extracting data!');
            zlib.gunzipSync(data);
            // TODO: Display compressed size
        }

        // =============================================================
        // == Use raw data if no Base64 encoding or GZIP compression. ==
        // =============================================================
        if(data === null) {
            data = rawData;
            return new Uint8Array(data);
        }

        // ====================================
        // == Read buffer data every 4 bytes ==
        // ====================================
        let array = new Uint8Array(1600); // TODO: Should not be hard coded.
        for(let i=0, index=0; i<data.length; i += 4, index++) {
            array[index] = data.readUInt32LE(i);
            index++;
        }

        return array;
    }
};