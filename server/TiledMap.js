/**
 * @author   AdamInTheOculus
 * @date     April 26th 2019
 * @purpose  Contains all data and logic of TiledMap class.
**/

const fs = require('fs');
const zlib = require('zlib');

module.exports = class TiledMap {

    /**
     * @author   AdamInTheOculus
     * @date     May 8th 2019
     * @purpose  Retrieves world/object data from Tiled JSON file.
     * @note     There MUST be an object layer named SpawnPoints.
    **/
    constructor(filename) {

        // =================================================
        // == Attempt to load TiledMap data with filename ==
        // =================================================
        let fileData = fs.readFileSync('public/game/assets/maps/' + filename);
        if(fileData === undefined || fileData === null || fileData.length === 0) {
            throw new Error(`TiledMap -- constructor() -- Failed to load file [${filename}].`);
        }

        // ===============================
        // == Convert file data to JSON ==
        // ===============================
        let data = JSON.parse(fileData);

        // =========================================
        // == Get unique tiles and their metadata ==
        // =========================================
        this.uniqueTiles = this.getUniqueTileData(data.tilesets);
        this.tileheight = data.tileheight;
        this.tilewidth = data.tilewidth;

        this.world = {};
        this.objects = [];
        this.spawnPoints = {};

        data.layers.forEach((layer, index) => {
            switch(layer.type) {
                case 'tilelayer': 
                    this.world[layer.name] = this.parseTileLayer(layer);
                    break;
                case 'objectgroup':
                    if(layer.name === 'SpawnPoints') {
                        this.spawnPoints = layer;
                    } else {
                        this.objects.push(layer); 
                    }
                    break;
                default: 
                    console.log(`Layer [${layer.name}] of type [${layer.type}] is currently not supported.`);
            }
        });

        // ===============================
        // == Validate any missing data ==
        // ===============================
        if(Object.keys(this.spawnPoints).length === 0) {
            throw new Error(`TiledMap -- constructor() -- No spawn points found within Tiled layer 'SpawnPoints'.`);
        }
    }

    /**
     * @author         AdamInTheOculus
     * @date           April 26th 2019
     * @purpose        Returns an array of Tiled layer data from a given layer.
     * @param  layer   Layer object. Contains metadata and map data.
    **/
    parseTileLayer(layer) {

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
    getUniqueTileData(tilesets) {

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

    /**
     * @author           AdamInTheOculus
     * @date             April 27th 2019
     * @purpose          Returns metadata of one tile, based on given position.
     * @param  position  Object containing (x,y) positions.
    **/
    getTileAtPosition(position, layer) {
        if(position === undefined) {
            throw new Error('TiledMap - getTileAtPosition - `position` parameter is undefined.');
        }

        let x = Math.floor(position.x / this.tilewidth);
        let y = Math.floor(position.y / this.tileheight);

        return this.uniqueTiles[layer[x][y]];
    }
};