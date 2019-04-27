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

        // ====================================
        // == Get each tile and its metadata ==
        // ====================================
        this.layerTiles = this.getTileMetadata(this.data.tilesets);
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
        let isEncoded = true;

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
            isEncoded = false;
            data = rawData;
        }

        // ====================================
        // == Read buffer data every 4 bytes ==
        // ====================================
        let array = [];
        let offset = 0;
        for(let i=0; i<layer.width; i++) {
            array.push(new Uint8Array(layer.width));
            for(let j=0; j<layer.height; j++, offset += 4) {

                if(isEncoded) {
                    array[i][j] = data.readUInt32LE(offset);
                } else {
                    array[i][j] = data[(i * layer.width) + j]; // If CSV data, no need to call readUInt32LE();
                }
            }
        }

        return array;
    }

    /**
     * @author           AdamInTheOculus
     * @date             April 26th 2019
     * @purpose          Returns an object. Mapped by unique tile ID. Each property contains tile metadata.
     * @param  tilesets  Array containing all tileset objects associated with layer.  
    **/
    getTileMetadata(tilesets) {

        let metadata = {};

        tilesets.forEach(tileset => {

            // ======================================================
            // == Skip iteration if no tiles exist within tileset. ==
            // ======================================================
            if(tileset.tiles === undefined) {
                return;
            }

            // ===========================================================================
            // == Iterate over each tile and add to metadata object, mapped by Tile ID. ==
            // ===========================================================================
            tileset.tiles.forEach(tile => {

                // This link explains the `offsetId` - https://stackoverflow.com/questions/25414596/why-property-ids-not-match-to-correct-tile-ids
                let offsetId = tile.id + tileset.firstgid;

                // ===========================================================
                // == Add tile object to metadata, mapped by offset tile ID ==
                // ===========================================================
                if(metadata[offsetId] === undefined) {
                    metadata[offsetId] = [tile];
                } else {
                    throw new Error(`TiledMap - getTileMetadata - Duplicate tile ID found [${offsetId}]`);
                }
            });
        });

        return metadata;
    }
};