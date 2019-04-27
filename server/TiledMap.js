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
        this.layerData = this.getTilesFromLayer(mapLayer);
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
        let tempLayer = {};
        for(let i=0; i<map.layers.length; i++) {
            if(map.layers[i].name === layer) {
                tempLayer = map.layers[i];
                break;
            }
        }

        // =========================================
        // == Check if layer was correctly found. ==
        // =========================================
        if(Object.keys(tempLayer).length === 0) {
            throw new Error(`TiledMap -- getMapLayer() -- Layer [${layer}] not found.`)
        }

        return tempLayer;
    }

    /**
     * @author         AdamInTheOculus
     * @date           April 26th 2019
     * @purpose        Returns an array of Tiled layer data from a given layer.
     * @param  layer   Layer object. Contains metadata and map data.
    **/
    getTilesFromLayer(layer) {

        let data = null;
        let rawData = layer.data;

        // ==================================
        // == If applicable, decode Base64 ==
        // ==================================
        if(layer.encoding === 'base64') {
            data = Buffer.from(rawData, 'base64');
        }

        // ============================================
        // == If applicable, extract compressed data ==
        // ============================================
        if(layer.compression === 'gzip') {
            data = zlib.gunzipSync(data);
        }

        // =============================================================
        // == Use raw data if no Base64 encoding or GZIP compression. ==
        // =============================================================
        if(data === null) {
            data = rawData;
            return new Uint8Array(data);
        }

        // Each 32-bit integer is placed in an 8-bit integer array.
        // There will never be a tile ID greater than 255, so only 1 byte is required.
        let array = new Uint8Array(layer.width * layer.height);

        // ====================================
        // == Read buffer data every 4 bytes ==
        // ====================================
        for(let i=0, index=0; i<data.length; i += 4, index++) {
            array[index] = data.readUInt32LE(i);
            index++;
        }

        return array;
    }
};